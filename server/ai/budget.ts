/**
 * Remembers that the provider said "out of credit / quota", so we stop sending requests
 * that are guaranteed to fail (they'd still cost a round trip) and can tell the UI up front.
 *
 * In-memory only: it lives as long as the server process. On a single Node host that's
 * reliable; on serverless each function (and warm instance) keeps its own copy, so it's
 * best-effort there, like the rate limiter.
 */
export const BUDGET_COOLDOWN_MS = 30 * 60 * 1000;

let exhaustedAt: number | null = null;

export function markBudgetExhausted(now = Date.now()): void {
  exhaustedAt = now;
}

/** True during the cooldown after exhaustion; afterwards the next request acts as a probe. */
export function isBudgetExhausted(now = Date.now()): boolean {
  if (exhaustedAt === null) return false;
  if (now - exhaustedAt >= BUDGET_COOLDOWN_MS) {
    exhaustedAt = null;
    return false;
  }
  return true;
}

export function resetBudgetState(): void {
  exhaustedAt = null;
}
