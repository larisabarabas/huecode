import { describe, expect, it } from "vitest";
import { COLOR_ROLES } from "../../src/lib/types";
import { isBudgetStatus, looksLikeBudgetExhausted } from "./http";
import { toPaletteResult } from "./palette";

describe("toPaletteResult", () => {
  it("clamps out-of-range values and fills missing roles with fallbacks", () => {
    const { colors, rationale } = toPaletteResult({
      primary: { h: 400, s: -5, l: 120 },
      accent: { h: "red", s: NaN },
      rationale: "x".repeat(500),
    });

    expect(Object.keys(colors).sort()).toEqual([...COLOR_ROLES].sort());
    expect(colors.primary).toEqual({ h: 360, s: 0, l: 100 });
    expect(colors.accent).toEqual({ h: 220, s: 50, l: 50 });
    expect(rationale).toHaveLength(240);
  });

  it("returns an empty rationale when the model omits it", () => {
    expect(toPaletteResult({}).rationale).toBe("");
  });
});

describe("looksLikeBudgetExhausted", () => {
  it.each([
    "Your credit balance is too low to access the Anthropic API.",
    '{"error":{"code":"insufficient_quota"}}',
    "You exceeded your current quota, please check your plan and billing details.",
    "You have reached your specific API usage limits. You will regain access on 2026-11-01.",
  ])("detects %s", (text) => expect(looksLikeBudgetExhausted(text)).toBe(true));

  it.each([
    "Invalid API key",
    "Quota exceeded for metric generate_content_requests, limit: 15 per minute. Please retry in 31s.",
    "You exceeded your current quota. Rate limit reached for requests per minute.",
    "Too many requests, retry after 20 seconds.",
    '{"error":{"details":[{"retryDelay":"31s"}],"message":"You exceeded your current quota"}}',
  ])("does not treat a plain rate limit as budget exhaustion: %s", (text) =>
    expect(looksLikeBudgetExhausted(text)).toBe(false));
});

describe("isBudgetStatus", () => {
  it.each([400, 402, 403, 429])("accepts %i", (status) => expect(isBudgetStatus(status)).toBe(true));
  it.each([200, 401, 404, 500, 503, undefined])("rejects %s", (status) => expect(isBudgetStatus(status)).toBe(false));
});
