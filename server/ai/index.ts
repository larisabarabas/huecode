import "../env.js"; // loads .env before resolveAiConfig reads process.env
import { resolveAiConfig } from "./config.js";
import { createAnthropicProvider } from "./anthropic.js";
import { createGeminiProvider } from "./gemini.js";
import { createOpenAiProvider } from "./openai.js";
import { isBudgetExhausted } from "./budget.js";
import { toPaletteResult, type AiPaletteResult } from "./palette.js";
import type { PaletteProvider } from "./types.js";

export type { AiPaletteResult } from "./palette.js";
export { ProviderError } from "./types.js";

// Resolved once at module load — on Vercel that's once per warm instance, same as the old Anthropic client.
export const aiConfig = resolveAiConfig(process.env, (msg) => console.warn(msg));
export const isAiConfigured = aiConfig !== null;

function createProvider(): PaletteProvider | null {
  if (!aiConfig) return null;
  switch (aiConfig.provider) {
    case "anthropic":
      return createAnthropicProvider(aiConfig.apiKey, aiConfig.model);
    case "openai":
      return createOpenAiProvider(aiConfig.apiKey, aiConfig.model);
    case "gemini":
      return createGeminiProvider(aiConfig.apiKey, aiConfig.model);
  }
}

const provider = createProvider();

export async function proposePaletteFromTheme(theme: string): Promise<AiPaletteResult> {
  if (!provider) throw new Error("AI is not configured on this server.");
  return toPaletteResult(await provider.propose(theme));
}

/** What GET /api/config exposes: never the key or model, only what the UI needs to decide what to show. */
export function publicAiConfig() {
  return {
    aiAvailable: isAiConfigured,
    provider: aiConfig?.provider ?? null,
    demo: aiConfig?.demo ?? false,
    /** True while the provider is known to be out of credit/quota; the UI disables AI instead of letting users fail. */
    paused: isAiConfigured && isBudgetExhausted(),
  };
}
