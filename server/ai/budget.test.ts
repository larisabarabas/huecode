import { afterEach, describe, expect, it } from "vitest";
import { BUDGET_COOLDOWN_MS, isBudgetExhausted, markBudgetExhausted, resetBudgetState } from "./budget";

afterEach(resetBudgetState);

describe("budget exhaustion state", () => {
  it("starts not exhausted", () => {
    expect(isBudgetExhausted(0)).toBe(false);
  });

  it("stays exhausted during the cooldown", () => {
    markBudgetExhausted(1_000);
    expect(isBudgetExhausted(1_000 + BUDGET_COOLDOWN_MS - 1)).toBe(true);
  });

  it("clears after the cooldown so the next request can probe the provider", () => {
    markBudgetExhausted(1_000);
    expect(isBudgetExhausted(1_000 + BUDGET_COOLDOWN_MS)).toBe(false);
    expect(isBudgetExhausted(1_000 + BUDGET_COOLDOWN_MS + 1)).toBe(false);
  });
});
