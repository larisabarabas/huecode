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

const { handlePaletteAiRequest, MAX_THEME_LENGTH } = await import("./paletteAiRoute.js");
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

  it.each([[[]], [{}], [42], [null], [undefined], ["   "]])("rejects non-string or blank theme %j", async (theme) => {
    expect((await handlePaletteAiRequest(theme)).status).toBe(400);
    expect(propose).not.toHaveBeenCalled();
  });

  it("measures the limit on the trimmed theme and sends it trimmed", async () => {
    propose.mockResolvedValue({ colors: {}, rationale: "" });
    const padded = `  ${"a".repeat(MAX_THEME_LENGTH)}  `;
    expect((await handlePaletteAiRequest(padded)).status).toBe(200);
    expect(propose).toHaveBeenCalledWith("a".repeat(MAX_THEME_LENGTH));
    expect((await handlePaletteAiRequest("a".repeat(MAX_THEME_LENGTH + 1))).status).toBe(400);
  });

  it("never leaks provider error text in the 502 body", async () => {
    propose.mockRejectedValueOnce(new ProviderError("Incorrect API key provided: sk-abc***xyz"));
    const res = await handlePaletteAiRequest("x");
    expect(res.status).toBe(502);
    expect(JSON.stringify(res.body)).not.toContain("sk-");
  });

});
