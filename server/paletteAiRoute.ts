import { aiConfig, isAiConfigured, proposePaletteFromTheme, ProviderError } from "./ai/index.js";
import { isBudgetExhausted, markBudgetExhausted } from "./ai/budget.js";

export const MAX_THEME_LENGTH = 200;

function budgetExhaustedResult(): RouteResult {
  return {
    status: 503,
    body: {
      code: "budget_exhausted",
      error: aiConfig?.demo
        ? "The demo's shared AI budget is used up for this month. The standard generator still works, and you can self-host with your own key."
        : "The AI provider reports the account is out of credit or quota. Generating without AI still works.",
    },
  };
}

export interface RouteResult {
  status: number;
  body: unknown;
}

/**
 * Shared validation + AI-generation logic for POST /api/palette/ai, used by both
 * the local Express server (server/index.ts) and the Vercel serverless function
 * (api/palette/ai.ts) so the two runtimes can't silently drift on accepted input
 * or error behavior. Rate limiting stays out of this — it's wired differently
 * (Express middleware vs. a manual check) in each caller.
 */
export async function handlePaletteAiRequest(theme: unknown): Promise<RouteResult> {
  if (typeof theme !== "string" || !theme.trim() || theme.length > MAX_THEME_LENGTH) {
    return {
      status: 400,
      body: { error: `theme must be a non-empty string under ${MAX_THEME_LENGTH} characters.` },
    };
  }

  if (!isAiConfigured) {
    return { status: 503, body: { error: "AI is not configured on this server." } };
  }

  // Known to be out of budget: skip the provider call, it would only fail.
  if (isBudgetExhausted()) return budgetExhaustedResult();

  try {
    const result = await proposePaletteFromTheme(theme.trim());
    return { status: 200, body: result };
  } catch (err) {
    console.error("AI palette generation failed:", err);

    if (err instanceof ProviderError && err.budgetExhausted) {
      markBudgetExhausted();
      return budgetExhaustedResult();
    }

    return { status: 502, body: { error: "AI palette generation failed. Try again, or generate without AI." } };
  }
}
