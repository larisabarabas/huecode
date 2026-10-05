import { assemblePalette } from "./paletteBuilder";
import { COLOR_ROLES, type ColorRole, type HSL, type Palette } from "./types";

/** Abort the AI request if the server hasn't answered in this long. */
export const AI_TIMEOUT_MS = 20_000;

/** How long the client keeps AI paused after hitting "out of budget"; mirrors BUDGET_COOLDOWN_MS on the server. */
export const AI_PAUSE_MS = 30 * 60 * 1000;

export class AiPaletteError extends Error {
  /** HTTP status when the failure came from a server response, else undefined. */
  readonly status?: number;
  /** True for transient conditions the user can just retry (timeout, 429, 5xx, network). */
  readonly retryable: boolean;
  /** Machine-readable reason from the server, e.g. "budget_exhausted" when the provider is out of credit. */
  readonly code?: string;

  constructor(message: string, opts: { status?: number; retryable?: boolean; code?: string } = {}) {
    super(message);
    this.name = "AiPaletteError";
    this.status = opts.status;
    this.retryable = opts.retryable ?? true;
    this.code = opts.code;
  }
}

export interface AiPaletteResult {
  palette: Palette;
  /** The raw base color per role, before shade-ramp expansion — what the AI actually proposed. */
  proposedColors: Record<ColorRole, HSL>;
  rationale: string;
}

function isHsl(value: unknown): value is HSL {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.h === "number" && typeof v.s === "number" && typeof v.l === "number";
}

export interface AiConfig {
  available: boolean;
  /** Provider id ("anthropic" | "openai" | "gemini"); null when AI is off. */
  provider: string | null;
  /** True on the hosted demo, where the shared key has a spend cap. */
  demo: boolean;
  /** True when the server knows the provider is out of credit/quota, so AI should be offered as paused. */
  paused: boolean;
}

const AI_OFF: AiConfig = { available: false, provider: null, demo: false, paused: false };

export async function fetchAiConfig(retries = 2): Promise<AiConfig> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch("/api/config");
      if (res.ok) {
        const data = await res.json();
        return {
          available: Boolean(data.aiAvailable),
          provider: typeof data.provider === "string" ? data.provider : null,
          demo: Boolean(data.demo),
          paused: Boolean(data.paused),
        };
      }
    } catch {
      // fall through to retry / give up
    }
    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
    }
  }
  return AI_OFF;
}

export async function paletteFromThemeTextAI(theme: string, signal?: AbortSignal): Promise<AiPaletteResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  const relayAbort = () => controller.abort();
  signal?.addEventListener("abort", relayAbort);

  try {
    const res = await fetch("/api/palette/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new AiPaletteError(body?.error ?? `AI request failed (${res.status}).`, {
        status: res.status,
        retryable: (res.status === 429 || res.status >= 500) && body?.code !== "budget_exhausted",
        code: typeof body?.code === "string" ? body.code : undefined,
      });
    }

    const data = await res.json();
    const colors = data?.colors;
    if (!colors || !COLOR_ROLES.every((role) => isHsl(colors[role]))) {
      throw new AiPaletteError("AI returned an unexpected response.", { retryable: false });
    }

    const proposedColors = colors as Record<ColorRole, HSL>;
    return {
      palette: assemblePalette(proposedColors),
      proposedColors,
      rationale: typeof data.rationale === "string" ? data.rationale : "",
    };
  } catch (err) {
    if (err instanceof AiPaletteError) throw err;
    if (controller.signal.aborted) {
      throw new AiPaletteError(
        signal?.aborted
          ? "AI request cancelled."
          : "AI request timed out. Try again, or generate without AI.",
        { retryable: true },
      );
    }
    throw new AiPaletteError("Couldn't reach the AI service. Check your connection and try again.", {
      retryable: true,
    });
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", relayAbort);
  }
}
