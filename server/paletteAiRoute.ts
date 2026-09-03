import { isAiConfigured } from "./env";
import { proposePaletteFromTheme } from "./anthropicPalette";

export const MAX_THEME_LENGTH = 200;

export interface RouteResult {
  status: number;
  body: unknown;
}

/**
 * Shared validation + AI-generation logic for POST /api/palette/ai, used by both
 * the local Express server (server/index.ts) and the Vercel serverless function
 * (api/palette/ai.ts) so the two runtimes can't silently drift on accepted input
 * or error behavior. Rate limiting stays out of this — it's wired differently
 * (Express middleware vs. a manual check) in each caller.
 */
export async function handlePaletteAiRequest(theme: unknown): Promise<RouteResult> {
  if (typeof theme !== "string" || !theme.trim() || theme.length > MAX_THEME_LENGTH) {
    return {
      status: 400,
      body: { error: `theme must be a non-empty string under ${MAX_THEME_LENGTH} characters.` },
    };
  }

  if (!isAiConfigured) {
    return { status: 503, body: { error: "AI is not configured on this server." } };
  }

  try {
    const result = await proposePaletteFromTheme(theme.trim());
    return { status: 200, body: result };
  } catch (err) {
    console.error("AI palette generation failed:", err);
    return { status: 502, body: { error: "AI palette generation failed. Try again, or generate without AI." } };
  }
}
