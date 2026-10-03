import { ProviderError } from "./types.js";

/** Provider wording for "the account is out of credit, quota or spend limit". */
const BUDGET_PATTERN =
  /credit balance|insufficient[_ ]quota|exceeded your current quota|out of (credit|funds)|billing (hard )?limit|spend(ing)? limit|usage limits?/i;

/**
 * Wording of a plain rate limit. Some providers reuse the "current quota" sentence for
 * per-minute limits, so these hints veto a budget match: a burst of requests must not
 * pause AI for everyone.
 */
const RATE_LIMIT_HINT = /per[ -]?(minute|second)|retry(delay| in| after)|rate[ -]?limit|too many requests/i;

export function looksLikeBudgetExhausted(text: string): boolean {
  return BUDGET_PATTERN.test(text) && !RATE_LIMIT_HINT.test(text);
}

/** HTTP statuses providers use for "out of budget" (400 Anthropic credit, 402 payment, 403 spend cap, 429 quota). */
export function isBudgetStatus(status: number | undefined): boolean {
  return status === 400 || status === 402 || status === 403 || status === 429;
}

const REQUEST_TIMEOUT_MS = 18_000;

/**
 * POSTs JSON and returns the parsed body. Throws ProviderError on non-2xx without
 * ever including the request headers (which carry the key) in the message.
 */
export async function postJson(url: string, headers: Record<string, string>, body: unknown): Promise<unknown> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ProviderError(`Provider request failed (${res.status}): ${text.slice(0, 300)}`, {
      budgetExhausted: isBudgetStatus(res.status) && looksLikeBudgetExhausted(text),
    });
  }
  return res.json();
}
