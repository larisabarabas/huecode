import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const SECRET_KEY = "sk-SECRET-key-value";
const SECRET_MODEL = "secret-model-name";

// Importing ./index resolves the config from process.env once, so each case sets env, resets modules, re-imports.
async function load(env: Record<string, string>) {
  vi.resetModules();
  vi.doMock("../env.js", () => ({}));
  for (const k of ["ANTHROPIC_API_KEY", "OPENAI_API_KEY", "GEMINI_API_KEY", "AI_PROVIDER", "AI_MODEL", "AI_DEMO_MODE", "ANTHROPIC_MODEL"]) {
    vi.stubEnv(k, env[k] ?? "");
  }
  vi.spyOn(console, "warn").mockImplementation(() => {});
  const index = await import("./index");
  const budget = await import("./budget");
  return { ...index, ...budget };
}

beforeEach(() => vi.resetModules());
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("publicAiConfig", () => {
  it("is fully off with no key", async () => {
    const { publicAiConfig } = await load({});
    expect(publicAiConfig()).toEqual({ aiAvailable: false, provider: null, demo: false, paused: false });
  });

  it("reports provider and demo flag when configured", async () => {
    const { publicAiConfig } = await load({ OPENAI_API_KEY: SECRET_KEY, AI_DEMO_MODE: "true" });
    expect(publicAiConfig()).toEqual({ aiAvailable: true, provider: "openai", demo: true, paused: false });
  });

  it("never exposes the key or model, even when both are set", async () => {
    const { publicAiConfig } = await load({ GEMINI_API_KEY: SECRET_KEY, AI_MODEL: SECRET_MODEL });
    const json = JSON.stringify(publicAiConfig());
    expect(json).not.toContain(SECRET_KEY);
    expect(json).not.toContain(SECRET_MODEL);
    expect(Object.keys(publicAiConfig()).sort()).toEqual(["aiAvailable", "demo", "paused", "provider"]);
  });

  it("flips to paused once the budget is marked exhausted", async () => {
    const { publicAiConfig, markBudgetExhausted } = await load({ OPENAI_API_KEY: SECRET_KEY });
    expect(publicAiConfig().paused).toBe(false);
    markBudgetExhausted();
    expect(publicAiConfig().paused).toBe(true);
  });

  it("never reports paused when AI is not configured, even if a stale exhaustion flag exists", async () => {
    const { publicAiConfig, markBudgetExhausted } = await load({});
    markBudgetExhausted();
    expect(publicAiConfig()).toMatchObject({ aiAvailable: false, paused: false });
  });

});

describe("api/config Vercel handler", () => {
  it("returns exactly the public config with status 200 and no secrets", async () => {
    await load({ ANTHROPIC_API_KEY: SECRET_KEY, AI_MODEL: SECRET_MODEL });
    const handler = (await import("../../api/config")).default;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    handler({} as never, res as never);

    expect(res.status).toHaveBeenCalledWith(200);
    const body = res.json.mock.calls[0][0];
    expect(body).toEqual({ aiAvailable: true, provider: "anthropic", demo: false, paused: false });
    expect(JSON.stringify(body)).not.toContain(SECRET_KEY);
    expect(JSON.stringify(body)).not.toContain(SECRET_MODEL);
  });
});
