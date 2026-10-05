import { describe, expect, it, vi } from "vitest";
import { DEFAULT_MODELS, resolveAiConfig } from "./config";

describe("resolveAiConfig", () => {
  it("is disabled with no keys", () => {
    expect(resolveAiConfig({})).toBeNull();
  });

  it("infers the provider from a single key", () => {
    expect(resolveAiConfig({ OPENAI_API_KEY: "k" })).toEqual({
      provider: "openai",
      apiKey: "k",
      model: DEFAULT_MODELS.openai,
      demo: false,
    });
  });

  it("stays backward compatible with an Anthropic-only .env", () => {
    const cfg = resolveAiConfig({ ANTHROPIC_API_KEY: "k", ANTHROPIC_MODEL: "claude-sonnet-5" });
    expect(cfg?.provider).toBe("anthropic");
    expect(cfg?.model).toBe("claude-sonnet-5");
  });

  it("disables AI and warns when several keys are set without AI_PROVIDER", () => {
    const warn = vi.fn();
    expect(resolveAiConfig({ ANTHROPIC_API_KEY: "a", GEMINI_API_KEY: "g" }, warn)).toBeNull();
    expect(warn).toHaveBeenCalledOnce();
  });

  it("honors AI_PROVIDER when several keys are set", () => {
    const cfg = resolveAiConfig({ ANTHROPIC_API_KEY: "a", GEMINI_API_KEY: "g", AI_PROVIDER: "Gemini" });
    expect(cfg?.provider).toBe("gemini");
    expect(cfg?.apiKey).toBe("g");
  });

  it("disables AI when AI_PROVIDER has no matching key or is unknown", () => {
    const warn = vi.fn();
    expect(resolveAiConfig({ AI_PROVIDER: "openai", GEMINI_API_KEY: "g" }, warn)).toBeNull();
    expect(resolveAiConfig({ AI_PROVIDER: "mistral", GEMINI_API_KEY: "g" }, warn)).toBeNull();
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it("AI_MODEL overrides the default and AI_DEMO_MODE sets the demo flag", () => {
    const cfg = resolveAiConfig({ GEMINI_API_KEY: "g", AI_MODEL: "gemini-x", AI_DEMO_MODE: "true" });
    expect(cfg?.model).toBe("gemini-x");
    expect(cfg?.demo).toBe(true);
  });

  it("trims keys, so a pasted trailing newline never reaches the Authorization header", () => {
    expect(resolveAiConfig({ OPENAI_API_KEY: " sk-x\n" })?.apiKey).toBe("sk-x");
  });

  it("a blank key does not make the setup ambiguous", () => {
    expect(resolveAiConfig({ OPENAI_API_KEY: "k", GEMINI_API_KEY: "  " })?.provider).toBe("openai");
  });

  it("reads AI_DEMO_MODE case- and space-insensitively", () => {
    expect(resolveAiConfig({ OPENAI_API_KEY: "k", AI_DEMO_MODE: " TRUE " })?.demo).toBe(true);
    expect(resolveAiConfig({ OPENAI_API_KEY: "k", AI_DEMO_MODE: "yes" })?.demo).toBe(false);
  });

  it("does not leak ANTHROPIC_MODEL into other providers", () => {
    expect(resolveAiConfig({ OPENAI_API_KEY: "k", ANTHROPIC_MODEL: "claude-x" })?.model).toBe(DEFAULT_MODELS.openai);
  });
});
