import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProviderError } from "./types";

const create = vi.fn();

// The adapter relies on `err instanceof Anthropic.APIError`, so the mock must supply a real class.
vi.mock("@anthropic-ai/sdk", () => {
  class APIError extends Error {
    constructor(
      readonly status: number | undefined,
      message: string,
    ) {
      super(message);
    }
  }
  class Anthropic {
    static APIError = APIError;
    messages = { create };
  }
  return { default: Anthropic };
});

const Anthropic = (await import("@anthropic-ai/sdk")).default;
const { createAnthropicProvider } = await import("./anthropic");

const PALETTE = { primary: { h: 10, s: 20, l: 30 }, rationale: "warm" };
const provider = createAnthropicProvider("sk-ant-test", "model-x");

// The real constructor takes (status, error, message, headers); the mock above only needs (status, message).
const apiError = (status: number | undefined, message: string) =>
  new (Anthropic.APIError as unknown as new (status: number | undefined, message: string) => Error)(status, message);

// Errors are built lazily, inside the mock call, rather than in the test body.
function failWith(makeError: () => unknown) {
  create.mockImplementation(async () => {
    throw makeError();
  });
}

// Braces matter: a function returned from beforeEach is run as teardown, and mockReset() returns the mock itself.
beforeEach(() => {
  create.mockReset();
});

describe("anthropic adapter", () => {
  it("forces the palette tool and returns the tool_use input", async () => {
    create.mockResolvedValue({ content: [{ type: "text", text: "hi" }, { type: "tool_use", input: PALETTE }] });

    expect(await provider.propose("forest")).toEqual(PALETTE);

    const req = create.mock.calls[0][0];
    expect(req.model).toBe("model-x");
    expect(req.tool_choice).toEqual({ type: "tool", name: "propose_palette" });
    expect(req.messages).toEqual([{ role: "user", content: "forest" }]);
  });

  it("rejects a response with no tool_use block", async () => {
    create.mockResolvedValue({ content: [{ type: "text", text: "sorry" }] });
    await expect(provider.propose("x")).rejects.toThrow(/palette proposal/);
  });

  it("marks an empty credit balance (400) as budget exhausted", async () => {
    failWith(() => apiError(400, "Your credit balance is too low to access the Anthropic API."));
    const err = await provider.propose("x").catch((e) => e);
    expect(err).toBeInstanceOf(ProviderError);
    expect(err.budgetExhausted).toBe(true);
  });

  it("does not pause on an ordinary rate limit", async () => {
    failWith(() => apiError(429, "This request would exceed your organization's rate limit of 50 requests per minute."));
    expect((await provider.propose("x").catch((e) => e)).budgetExhausted).toBe(false);
  });

  it("does not pause when credit wording arrives with a non-budget status", async () => {
    failWith(() => apiError(500, "credit balance"));
    expect((await provider.propose("x").catch((e) => e)).budgetExhausted).toBe(false);
  });

  it("copes with an APIError that has no status", async () => {
    failWith(() => apiError(undefined, "Connection error."));
    const err = await provider.propose("x").catch((e) => e);
    expect(err).toBeInstanceOf(ProviderError);
    expect(err.budgetExhausted).toBe(false);
  });

  it("lets non-API errors (network, abort) through untouched", async () => {
    failWith(() => new TypeError("fetch failed"));
    const err = await provider.propose("x").catch((e) => e);
    expect(err).toBeInstanceOf(TypeError);
    expect(err).not.toBeInstanceOf(ProviderError);
  });
});
