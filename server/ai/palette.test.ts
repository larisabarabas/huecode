import { describe, expect, it } from "vitest";
import { COLOR_ROLES } from "../../src/lib/types";
import { isBudgetStatus, looksLikeBudgetExhausted } from "./http";
import { sanitizeHsl, toPaletteResult } from "./palette";
import { ProviderError } from "./types";

describe("toPaletteResult", () => {
  it("clamps saturation/lightness, wraps hue, and fills missing roles with fallbacks", () => {
    const { colors, rationale } = toPaletteResult({
      primary: { h: 400, s: -5, l: 120 },
      accent: { h: "red", s: NaN },
      rationale: "x".repeat(500),
    });

    expect(Object.keys(colors).sort()).toEqual([...COLOR_ROLES].sort());
    expect(colors.primary).toEqual({ h: 40, s: 0, l: 100 });
    expect(colors.accent).toEqual({ h: 220, s: 50, l: 50 });
    expect(rationale).toHaveLength(240);
  });

  it.each([[-10, 350], [720, 0]])("wraps hue %i to %i (hue is circular)", (h, expected) => {
    expect(sanitizeHsl({ h, s: 50, l: 50 }, { h: 1, s: 2, l: 3 }).h).toBe(expected);
  });

  it("falls back instead of propagating NaN, Infinity, strings, null, arrays or booleans", () => {
    for (const bad of [NaN, Infinity, -Infinity, "120", null, [], true]) {
      expect(sanitizeHsl({ h: bad, s: bad, l: bad }, { h: 1, s: 2, l: 3 })).toEqual({ h: 1, s: 2, l: 3 });
    }
  });

  it.each([null, [], "x", 42])("rejects a non-object model response (%j) as a ProviderError", (bad) => {
    expect(() => toPaletteResult(bad as never)).toThrow(ProviderError);
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
    "You exceeded your current quota. Quota exceeded for metric generate_content_free_tier_requests, limit: 0, PerDay. Please retry in 3600s.",
    "Daily quota exceeded for this project; you exceeded your current quota.",
  ])("a per-day quota is budget exhaustion even with a retry hint: %s", (text) =>
    expect(looksLikeBudgetExhausted(text)).toBe(true));

  it("a message naming both per-minute and per-day limits stays a rate limit", () => {
    expect(looksLikeBudgetExhausted("exceeded your current quota: 15 per minute, 1500 per day. Retry in 20s")).toBe(false);
  });

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
  it("accepts the statuses providers use for out-of-budget", () => {
    for (const status of [400, 402, 403, 429]) expect(isBudgetStatus(status)).toBe(true);
  });
  it("rejects everything else", () => {
    for (const status of [200, 401, 404, 500, 503, undefined]) expect(isBudgetStatus(status)).toBe(false);
  });
});
