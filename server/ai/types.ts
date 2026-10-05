export const AI_PROVIDER_IDS = ["anthropic", "openai", "gemini"] as const;
export type AiProviderId = (typeof AI_PROVIDER_IDS)[number];

/** Unvalidated palette as returned by a provider's tool call — always run through toPaletteResult before use. */
export type RawPalette = Record<string, unknown>;

export interface PaletteProvider {
  id: AiProviderId;
  propose(theme: string): Promise<RawPalette>;
}

/**
 * A failure from a provider. `budgetExhausted` marks "out of credit / quota hit"
 * so the route can show demo users a friendly message instead of a generic error.
 */
export class ProviderError extends Error {
  readonly budgetExhausted: boolean;

  constructor(message: string, opts: { budgetExhausted?: boolean } = {}) {
    super(message);
    this.name = "ProviderError";
    this.budgetExhausted = opts.budgetExhausted ?? false;
  }
}
