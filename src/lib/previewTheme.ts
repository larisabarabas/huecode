import { clamp, contrastRatio, hexToHsl, readableTextColor } from "./color";
import type { ColorRole, Palette, ShadeScale, ShadeStep } from "./types";

export type PreviewMode = "light" | "dark";

/**
 * Picks the first candidate shade that clears `minRatio` contrast against `bgHex`, falling back
 * to the last (most extreme) candidate if none qualify. Shade 500 is anchored to whatever
 * lightness the theme's base color requested, so when that base is itself very light or dark,
 * 500 can end up nearly indistinguishable from a same-side extreme like 50 — this keeps
 * text tokens legible against the shell background regardless.
 */
function pickContrastShade(scale: ShadeScale, bgHex: string, candidates: ShadeStep[], minRatio: number): string {
  for (const step of candidates) {
    if (contrastRatio(scale[step], bgHex) >= minRatio) return scale[step];
  }
  return scale[candidates[candidates.length - 1]];
}

/**
 * Picks whichever candidate shade's actual lightness lands closest to `targetL`. Two themes with
 * very different base lightness produce very different lightness at a fixed shade step (e.g. a
 * dark-based green's 600 is far darker than a light-based violet's 600), so the accent role reads
 * as "thin" in one theme and "solid" in another even though the code drawing it never changes.
 * Searching nearby steps for a consistent target lightness keeps that visual weight comparable
 * across themes instead of anchoring to one fixed step.
 */
function pickShadeByLightness(scale: ShadeScale, candidates: ShadeStep[], targetL: number): string {
  let best = scale[candidates[0]];
  let bestDist = Infinity;
  for (const step of candidates) {
    const dist = Math.abs(hexToHsl(scale[step]).l - targetL);
    if (dist < bestDist) {
      bestDist = dist;
      best = scale[step];
    }
  }
  return best;
}

/** Appends an 8-digit hex alpha channel — used for the focus `--ring`, which needs to sit as a
 * translucent halo over whatever the accent color happens to be, not a flat fill. */
function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(clamp(alpha, 0, 1) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

const SEMANTIC_ROLES: Record<"ok" | "warn" | "err" | "info", ColorRole> = {
  ok: "success",
  warn: "warning",
  err: "error",
  info: "info",
};

/** Fixed per mode, not palette-derived. */
const SHADOWS: Record<PreviewMode, { sm: string; md: string; lg: string }> = {
  light: {
    sm: "0 1px 2px rgba(24,24,27,.06)",
    md: "0 4px 14px -4px rgba(24,24,27,.12)",
    lg: "0 24px 48px -16px rgba(24,24,27,.22)",
  },
  dark: {
    sm: "0 1px 2px rgba(0,0,0,.5)",
    md: "0 4px 14px -4px rgba(0,0,0,.6)",
    lg: "0 24px 48px -16px rgba(0,0,0,.7)",
  },
};

export function paletteToCssVars(palette: Palette, mode: PreviewMode): Record<string, string> {
  const dark = mode === "dark";
  const neutral = palette.neutral;
  const vars: Record<string, string> = {};

  // Structural surfaces. Light mode gets progressively darker as it recedes from the base
  // card color (surface > surface-2 > bg > surface-3); dark mode gets progressively lighter
  // as it elevates off the page (bg < surface < surface-2 < surface-3) — the two hierarchies
  // aren't mirrors of each other, so each is spelled out rather than derived from one rule.
  if (dark) {
    vars["--bg"] = neutral[900];
    vars["--surface"] = neutral[800];
    vars["--surface-2"] = neutral[700];
    vars["--surface-3"] = neutral[600];
    vars["--border"] = neutral[600];
    vars["--border-strong"] = neutral[500];
    vars["--text"] = pickContrastShade(neutral, vars["--bg"], [50, 100], 7);
    vars["--text-2"] = pickContrastShade(neutral, vars["--bg"], [100, 200, 300], 4.5);
    vars["--text-3"] = pickContrastShade(neutral, vars["--bg"], [200, 300, 400], 4.5);
  } else {
    vars["--surface"] = "#ffffff";
    vars["--bg"] = neutral[50];
    vars["--surface-2"] = neutral[50];
    vars["--surface-3"] = neutral[200];
    vars["--border"] = neutral[200];
    vars["--border-strong"] = neutral[300];
    vars["--text"] = pickContrastShade(neutral, vars["--bg"], [900, 950], 7);
    vars["--text-2"] = pickContrastShade(neutral, vars["--bg"], [600, 700, 800], 4.5);
    vars["--text-3"] = pickContrastShade(neutral, vars["--bg"], [500, 600, 700], 4.5);
  }

  // Accent. Picked by target lightness rather than a fixed shade step, so themes with a dark
  // base color (e.g. a muted forest green) don't render a visibly heavier accent than themes
  // with a light base (e.g. a bright violet) — see pickShadeByLightness above.
  const accentCandidates: ShadeStep[] = dark ? [300, 400, 500] : [500, 600, 700];
  const accentTargetL = dark ? 65 : 50;
  const accent = pickShadeByLightness(palette.primary, accentCandidates, accentTargetL);
  const accentSoft = dark ? palette.primary[900] : palette.primary[50];
  vars["--accent"] = accent;
  vars["--accent-hover"] = pickShadeByLightness(palette.primary, accentCandidates, accentTargetL + (dark ? 12 : -12));
  vars["--accent-fg"] = readableTextColor(accent);
  vars["--accent-soft"] = accentSoft;
  vars["--accent-soft-fg"] = dark
    ? pickContrastShade(palette.primary, accentSoft, [100, 200, 300], 4.5)
    : pickContrastShade(palette.primary, accentSoft, [700, 800, 900], 4.5);
  vars["--ring"] = withAlpha(accent, dark ? 0.34 : 0.3);

  // Semantic roles: base (solid fill), soft (pale tint), fg (readable text on the solid fill).
  for (const [prefix, role] of Object.entries(SEMANTIC_ROLES) as [string, ColorRole][]) {
    const scale = palette[role];
    const base = dark ? scale[400] : scale[600];
    vars[`--${prefix}`] = base;
    vars[`--${prefix}-soft`] = dark ? scale[900] : scale[50];
    vars[`--${prefix}-fg`] = readableTextColor(base);
  }

  const shadows = SHADOWS[mode];
  vars["--shadow-sm"] = shadows.sm;
  vars["--shadow-md"] = shadows.md;
  vars["--shadow-lg"] = shadows.lg;

  return vars;
}
