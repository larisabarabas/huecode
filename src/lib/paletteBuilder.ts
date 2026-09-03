import { clamp, generateShadeScale } from "./color.js";
import { COLOR_ROLES, type ColorRole, type HSL, type Palette } from "./types.js";

/** Shortest-path circular mix between two hues (0-360). */
export function mixHue(h1: number, h2: number, weight: number): number {
  const diff = ((h2 - h1 + 540) % 360) - 180;
  return (h1 + diff * weight + 360) % 360;
}

/**
 * Conventional hue/mood anchors for the semantic roles. Used both as the
 * default when nothing else proposes success/warning/error/info, and as
 * fallback values if a proposal (e.g. from the AI) omits one.
 */
export const SEMANTIC_ANCHORS: Record<"success" | "warning" | "error" | "info", HSL> = {
  success: { h: 142, s: 65, l: 42 },
  warning: { h: 38, s: 92, l: 50 },
  error: { h: 4, s: 78, l: 52 },
  info: { h: 217, s: 80, l: 52 },
};

/**
 * Unlike the other roles, "neutral" is conventionally used as text *on top of its own tints*
 * (e.g. neutral-500 body text on a neutral-50 background) rather than as a fill color with a
 * separately-chosen foreground. generateShadeScale anchors shade 500 exactly on the requested
 * lightness with no cushion, so a proposal near either extreme (a very light or very dark
 * neutral) collapses 500 into the same band as its own 50 or 950 neighbor, making it unreadable.
 * Clamping keeps 500 legibly separated from both ends regardless of what was proposed, while
 * leaving hue/saturation — which is what actually gives a theme's neutral its character — free.
 */
const NEUTRAL_LIGHTNESS_RANGE = { min: 38, max: 46 };

/** Turns eight already-chosen base HSL colors (one per role) into a full shade-ramped palette. */
export function assemblePalette(roles: Record<ColorRole, HSL>): Palette {
  return Object.fromEntries(
    COLOR_ROLES.map((role) => {
      const base =
        role === "neutral"
          ? { ...roles[role], l: clamp(roles[role].l, NEUTRAL_LIGHTNESS_RANGE.min, NEUTRAL_LIGHTNESS_RANGE.max) }
          : roles[role];
      return [role, generateShadeScale(base)];
    }),
  ) as Palette;
}

export interface PaletteRoles {
  primary: HSL;
  secondary: HSL;
  accent: HSL;
  neutral: HSL;
}

const MAX_SEMANTIC_HUE_SHIFT = 28;

/**
 * Nudges a conventional semantic anchor (green/amber/red/blue) toward the
 * theme's primary color. Hue shifts, but capped, so success/warning/error/
 * info stay recognizable by convention even for a very differently-hued
 * theme; saturation and lightness blend more freely, so a vivid theme
 * produces vivid status colors and a muted theme produces muted ones,
 * instead of every theme getting the same fixed look.
 */
function deriveSemanticColor(anchor: HSL, primary: HSL): HSL {
  const hueDiff = clamp(
    ((primary.h - anchor.h + 540) % 360) - 180,
    -MAX_SEMANTIC_HUE_SHIFT,
    MAX_SEMANTIC_HUE_SHIFT,
  );
  return {
    h: (anchor.h + hueDiff + 360) % 360,
    s: clamp(anchor.s * 0.65 + primary.s * 0.35, 0, 100),
    l: clamp(anchor.l * 0.8 + primary.l * 0.2, 0, 100),
  };
}

/**
 * Assembles a full role-based palette from four already-chosen base colors.
 * Semantic colors (success/warning/error/info) are derived from their
 * conventional anchors, tinted toward the primary color for cohesion.
 */
export function buildPaletteFromRoles({ primary, secondary, accent, neutral }: PaletteRoles): Palette {
  const semantics = Object.fromEntries(
    (Object.entries(SEMANTIC_ANCHORS) as [keyof typeof SEMANTIC_ANCHORS, HSL][]).map(([role, anchor]) => [
      role,
      deriveSemanticColor(anchor, primary),
    ]),
  ) as Record<keyof typeof SEMANTIC_ANCHORS, HSL>;

  return assemblePalette({ primary, secondary, accent, neutral, ...semantics });
}

/** Derives primary/secondary/accent/neutral from a single base hue via color-theory rotation. */
export function buildPaletteFromBase(base: HSL): Palette {
  const secondary: HSL = { h: mixHue(base.h, base.h - 30, 1), s: base.s * 0.85, l: base.l };
  const accent: HSL = { h: mixHue(base.h, base.h + 180, 1), s: Math.min(base.s * 1.1, 100), l: base.l };
  const neutral: HSL = { h: base.h, s: Math.min(base.s * 0.15, 12), l: 50 };

  return buildPaletteFromRoles({ primary: base, secondary, accent, neutral });
}
