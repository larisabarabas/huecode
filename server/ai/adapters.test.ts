import { afterEach, describe, expect, it, vi } from "vitest";
import { createGeminiProvider } from "./gemini";
import { createOpenAiProvider } from "./openai";
import { ProviderError } from "./types";

const PALETTE = { primary: { h: 10, s: 20, l: 30 }, rationale: "warm" };

function mockFetch(status: number, body: unknown) {
  const fn = vi.fn(async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
  }));
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => vi.unstubAllGlobals());

describe("openai adapter", () => {
  const provider = createOpenAiProvider("sk-test", "model-x");

  it("forces the palette tool and returns the parsed arguments", async () => {
    const fetchMock = mockFetch(200, {
      choices: [{ message: { tool_calls: [{ function: { arguments: JSON.stringify(PALETTE) } }] } }],
    });

    expect(await provider.propose("forest")).toEqual(PALETTE);

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const sent = JSON.parse(init.body as string);
    expect(url).toBe("https://api.openai.com/v1/chat/completions");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer sk-test");
    expect(sent.model).toBe("model-x");
    expect(sent.tool_choice).toEqual({ type: "function", function: { name: "propose_palette" } });
    expect(sent.messages.at(-1)).toEqual({ role: "user", content: "forest" });
  });

  it("rejects a response with no tool call", async () => {
    mockFetch(200, { choices: [{ message: {} }] });
    await expect(provider.propose("x")).rejects.toThrow(/palette proposal/);
  });

  it("rejects tool arguments that are not valid JSON", async () => {
    mockFetch(200, { choices: [{ message: { tool_calls: [{ function: { arguments: "{oops" } }] } }] });
    await expect(provider.propose("x")).rejects.toThrow(/valid JSON/);
  });

  it("flags an out-of-credit response as budget exhausted", async () => {
    mockFetch(429, { error: { code: "insufficient_quota", message: "You exceeded your current quota, check billing." } });
    const err = await provider.propose("x").catch((e) => e);
    expect(err).toBeInstanceOf(ProviderError);
    expect(err.budgetExhausted).toBe(true);
  });

  it("does not flag a plain rate limit as budget exhausted", async () => {
    mockFetch(429, { error: { message: "Rate limit reached for requests per minute. Please retry in 20s." } });
    const err = await provider.propose("x").catch((e) => e);
    expect(err.budgetExhausted).toBe(false);
  });

  it("never puts the key in an error message", async () => {
    mockFetch(500, "upstream exploded");
    const err = await provider.propose("x").catch((e) => e);
    expect(err.message).not.toContain("sk-test");
  });
});

describe("gemini adapter", () => {
  const provider = createGeminiProvider("g-test", "gem-model");

  it("sends the key as a header, not in the URL, and returns the function args", async () => {
    const fetchMock = mockFetch(200, {
      candidates: [{ content: { parts: [{ functionCall: { args: PALETTE } }] } }],
    });

    expect(await provider.propose("forest")).toEqual(PALETTE);

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const sent = JSON.parse(init.body as string);
    expect(url).toBe("https://generativelanguage.googleapis.com/v1beta/models/gem-model:generateContent");
    expect(url).not.toContain("g-test");
    expect((init.headers as Record<string, string>)["x-goog-api-key"]).toBe("g-test");
    expect(sent.toolConfig.functionCallingConfig).toEqual({
      mode: "ANY",
      allowedFunctionNames: ["propose_palette"],
    });
  });

  it("rejects a response with no function call", async () => {
    mockFetch(200, { candidates: [{ content: { parts: [{ text: "hi" }] } }] });
    await expect(provider.propose("x")).rejects.toThrow(/palette proposal/);
  });

  it("does not treat a per-minute 429 as budget exhausted", async () => {
    mockFetch(429, "You exceeded your current quota. Quota exceeded for metric ... limit: 15 per minute. Retry in 31s.");
    const err = await provider.propose("x").catch((e) => e);
    expect(err.budgetExhausted).toBe(false);
  });
});
