import { AI_PROVIDER_IDS, type AiProviderId } from "./types.js";

export interface AiConfig {
  provider: AiProviderId;
  apiKey: string;
  model: string;
  /** True on the hosted demo, where the shared key has a spend cap users should know about. */
  demo: boolean;
}

export const DEFAULT_MODELS: Record<AiProviderId, string> = {
  anthropic: "claude-haiku-4-5",
  openai: "gpt-6-luna",
  gemini: "gemini-3.5-flash-lite",
};

const KEY_VARS: Record<AiProviderId, string> = {
  anthropic: "ANTHROPIC_API_KEY",
  openai: "OPENAI_API_KEY",
  gemini: "GEMINI_API_KEY",
};

type Env = Record<string, string | undefined>;

/** Env value trimmed; blank counts as unset (a pasted key often carries a trailing newline or stray spaces). */
function read(env: Env, name: string): string | undefined {
  return env[name]?.trim() || undefined;
}

function isProviderId(value: string): value is AiProviderId {
  return (AI_PROVIDER_IDS as readonly string[]).includes(value);
}

/**
 * Picks the provider from AI_PROVIDER, or — if unset — from the one key that is
 * present. Returns null (AI disabled) when nothing is configured or the setup is
 * ambiguous (several keys, no AI_PROVIDER), with a warning explaining why.
 */
export function resolveAiConfig(env: Env, warn: (msg: string) => void = () => {}): AiConfig | null {
  const keys = AI_PROVIDER_IDS.filter((id) => Boolean(read(env, KEY_VARS[id])));
  const requested = read(env, "AI_PROVIDER")?.toLowerCase();

  let provider: AiProviderId;
  if (requested) {
    if (!isProviderId(requested)) {
      warn(`AI_PROVIDER="${requested}" is not one of: ${AI_PROVIDER_IDS.join(", ")}. AI is disabled.`);
      return null;
    }
    provider = requested;
  } else if (keys.length === 1) {
    provider = keys[0];
  } else {
    if (keys.length > 1) {
      warn(`Multiple AI keys are set (${keys.join(", ")}); set AI_PROVIDER to choose one. AI is disabled.`);
    }
    return null;
  }

  const apiKey = read(env, KEY_VARS[provider]);
  if (!apiKey) {
    warn(`AI_PROVIDER=${provider} but ${KEY_VARS[provider]} is not set. AI is disabled.`);
    return null;
  }

  // ANTHROPIC_MODEL predates AI_MODEL; keep honoring it so existing .env files still work.
  const model =
    read(env, "AI_MODEL") ||
    (provider === "anthropic" ? read(env, "ANTHROPIC_MODEL") : undefined) ||
    DEFAULT_MODELS[provider];

  return { provider, apiKey, model, demo: read(env, "AI_DEMO_MODE")?.toLowerCase() === "true" };
}
