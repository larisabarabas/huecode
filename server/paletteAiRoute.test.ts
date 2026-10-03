import { beforeEach, describe, expect, it, vi } from "vitest";

const propose = vi.fn();

vi.mock("./ai/index.js", async () => {
  const { ProviderError } = await import("./ai/types.js");
  return {
    aiConfig: { provider: "openai", apiKey: "k", model: "m", demo: true },
    isAiConfigured: true,
    proposePaletteFromTheme: propose,
    ProviderError,
  };
});

const { handlePaletteAiRequest } = await import("./paletteAiRoute.js");
const { ProviderError } = await import("./ai/types.js");
const { isBudgetExhausted, resetBudgetState } = await import("./ai/budget.js");

beforeEach(() => {
  propose.mockReset();
  resetBudgetState();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("handlePaletteAiRequest budget handling", () => {
  it("returns budget_exhausted, pauses, and then skips the provider entirely", async () => {
    propose.mockRejectedValueOnce(new ProviderError("no credit", { budgetExhausted: true }));

    const first = await handlePaletteAiRequest("forest");
    expect(first.status).toBe(503);
    expect((first.body as { code: string }).code).toBe("budget_exhausted");
    expect(isBudgetExhausted()).toBe(true);

    const second = await handlePaletteAiRequest("forest");
    expect(second.status).toBe(503);
    expect(propose).toHaveBeenCalledTimes(1);
  });

  it("keeps ordinary provider failures as a generic 502 and does not pause", async () => {
    propose.mockRejectedValueOnce(new ProviderError("rate limited"));

    const res = await handlePaletteAiRequest("forest");
    expect(res.status).toBe(502);
    expect(isBudgetExhausted()).toBe(false);
  });

  it("rejects an invalid theme before touching the provider", async () => {
    expect((await handlePaletteAiRequest("")).status).toBe(400);
    expect(propose).not.toHaveBeenCalled();
  });
});
