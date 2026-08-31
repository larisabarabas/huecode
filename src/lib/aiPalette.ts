import { assemblePalette } from "./paletteBuilder";
import { COLOR_ROLES, type ColorRole, type HSL, type Palette } from "./types";

export class AiPaletteError extends Error {}

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

export async function fetchAiAvailability(): Promise<boolean> {
  try {
    const res = await fetch("/api/config");
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.aiAvailable);
  } catch {
    return false;
  }
}

export async function paletteFromThemeTextAI(theme: string): Promise<AiPaletteResult> {
  const res = await fetch("/api/palette/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new AiPaletteError(body?.error ?? `AI request failed (${res.status}).`);
  }

  const data = await res.json();
  const colors = data?.colors;
  if (!colors || !COLOR_ROLES.every((role) => isHsl(colors[role]))) {
    throw new AiPaletteError("AI returned an unexpected response.");
  }

  const proposedColors = colors as Record<ColorRole, HSL>;

  return {
    palette: assemblePalette(proposedColors),
    proposedColors,
    rationale: typeof data.rationale === "string" ? data.rationale : "",
  };
}
