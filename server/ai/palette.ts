import { SEMANTIC_ANCHORS } from "../../src/lib/paletteBuilder.js";
import { COLOR_ROLES, type ColorRole, type HSL } from "../../src/lib/types.js";
import type { RawPalette } from "./types.js";

export const TOOL_NAME = "propose_palette";
export const TOOL_DESCRIPTION =
  "Propose base HSL colors for a cohesive 8-role UI color palette that matches a written theme.";
// Output-token cap sent to every provider. Plenty for 8 HSL colors + a short rationale; raise it if a
// reasoning-style model gets cut off before finishing the tool call (documented in the README).
export const MAX_OUTPUT_TOKENS = 700;

export const SYSTEM_PROMPT =
  "You are a color design assistant for a UI palette generator. Given a short theme description, " +
  "propose base HSL colors for eight roles: primary, secondary, accent, neutral, success, warning, " +
  "error, and info. Together they should feel like one cohesive, deliberately designed palette that " +
  "matches the mood of the theme. The neutral role should be a low-saturation color near the primary " +
  "hue, suitable as a gray/background scale. The success/warning/error/info roles must stay instantly " +
  "recognizable as their convention (green-ish for success, amber/orange for warning, red for error, " +
  "blue for info) but should be subtly tinted toward the primary hue and adjusted in saturation/" +
  "lightness so they feel like they belong to the same palette rather than generic defaults. Always " +
  `respond by calling the ${TOOL_NAME} tool exactly once, with no other text.`;

const HSL_SCHEMA = {
  type: "object",
  properties: {
    h: { type: "number", description: "Hue, 0-360" },
    s: { type: "number", description: "Saturation percent, 0-100" },
    l: { type: "number", description: "Lightness percent, 0-100" },
  },
  required: ["h", "s", "l"],
};

/**
 * Plain JSON Schema shared by every provider. Kept deliberately simple (no numeric
 * bounds, no additionalProperties) because each provider accepts a different subset;
 * ranges are enforced afterwards by sanitizeHsl instead.
 */
export const PALETTE_SCHEMA = {
  type: "object",
  properties: {
    ...Object.fromEntries(COLOR_ROLES.map((role) => [role, HSL_SCHEMA])),
    rationale: { type: "string", description: "One short sentence explaining the choice." },
  },
  required: [...COLOR_ROLES, "rationale"],
};

export interface AiPaletteResult {
  colors: Record<ColorRole, HSL>;
  rationale: string;
}

const FALLBACK_HUE: HSL = { h: 220, s: 50, l: 50 };

// Per-role fallback if the model omits a field: neutral falls back to a
// desaturated version of the generic default, semantic roles fall back to
// their conventional anchors so a partial response still reads sensibly.
const ROLE_FALLBACKS: Record<ColorRole, HSL> = {
  primary: FALLBACK_HUE,
  secondary: FALLBACK_HUE,
  accent: FALLBACK_HUE,
  neutral: { h: FALLBACK_HUE.h, s: 10, l: 50 },
  ...SEMANTIC_ANCHORS,
};

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.min(max, Math.max(min, n));
}

/** Never trust model output as-is: clamp every field into its valid range before it touches the palette. */
export function sanitizeHsl(value: unknown, fallback: HSL): HSL {
  const v = (value ?? {}) as Partial<Record<keyof HSL, unknown>>;
  return {
    h: clampNumber(v.h, 0, 360, fallback.h),
    s: clampNumber(v.s, 0, 100, fallback.s),
    l: clampNumber(v.l, 0, 100, fallback.l),
  };
}

export function toPaletteResult(input: RawPalette): AiPaletteResult {
  const colors = Object.fromEntries(
    COLOR_ROLES.map((role) => [role, sanitizeHsl(input[role], ROLE_FALLBACKS[role])]),
  ) as Record<ColorRole, HSL>;

  return {
    colors,
    rationale: typeof input.rationale === "string" ? input.rationale.slice(0, 240) : "",
  };
}
