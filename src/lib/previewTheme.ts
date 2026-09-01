import { contrastRatio } from "./color";
import { SHADE_STEPS, type ColorRole, type Palette, type ShadeScale, type ShadeStep } from "./types";

export type PreviewMode = "light" | "dark";

const ROLE_PREFIX: Record<ColorRole, string> = {
  primary: "p",
  secondary: "s",
  accent: "a",
  neutral: "n",
  success: "su",
  warning: "w",
  error: "e",
  info: "i",
};

/** In dark mode, each ramp is read back-to-front so tints stay tints against a black shell. */
const MIRROR: Record<ShadeStep, ShadeStep> = {
  50: 950,
  100: 900,
  200: 800,
  300: 700,
  400: 600,
  500: 500,
  600: 400,
  700: 300,
  800: 200,
  900: 100,
  950: 50,
};

/** Fixed dark-mode neutrals — the app shell goes near-black, so the derived-from-palette
 * neutral-50..600 (light backgrounds/borders/muted-text) would be unreadable if mirrored. */
const DARK_NEUTRAL_OVERRIDES: Record<string, string> = {
  "--n-50": "#08080a",
  "--n-100": "#17171a",
  "--n-200": "#232327",
  "--n-300": "#3a3a40",
  "--n-400": "#6e6e78",
  "--n-500": "#9a94bc",
  "--n-600": "#c4c0d6",
};

export function shortHex(hex: string): string {
  return hex.replace("#", "");
}

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

export function paletteToCssVars(palette: Palette, mode: PreviewMode): Record<string, string> {
  const dark = mode === "dark";
  const vars: Record<string, string> = {};

  for (const role of Object.keys(ROLE_PREFIX) as ColorRole[]) {
    const prefix = ROLE_PREFIX[role];
    for (const step of SHADE_STEPS) {
      const sourceStep = dark ? MIRROR[step] : step;
      vars[`--${prefix}-${step}`] = palette[role][sourceStep];
    }
  }

  // Brand vars read the raw, un-mirrored palette: the marketing hero stays dark in both modes.
  vars["--brand-deep"] = palette.primary[950];
  vars["--brand-deep-2"] = palette.primary[900];
  vars["--brand-deep-3"] = palette.primary[800];
  vars["--brand-deep-bd"] = palette.primary[700];
  vars["--brand-fg"] = palette.primary[50];
  vars["--brand-fg-2"] = palette.primary[200];
  vars["--brand-fg-3"] = palette.primary[100];
  vars["--cta-bg"] = palette.accent[500];
  vars["--cta-fg"] = palette.accent[950];

  if (dark) {
    vars["--bg"] = "#000000";
    vars["--surface"] = "#0b0b0d";
    vars["--border"] = "#232327";
    vars["--text"] = "#fdfffc";
    vars["--text-muted"] = "#9a94bc";
    vars["--pricing-surface"] = "#0b0b0d";
    Object.assign(vars, DARK_NEUTRAL_OVERRIDES);
  } else {
    const lightBg = palette.neutral[50];
    vars["--bg"] = lightBg;
    vars["--surface"] = "#ffffff";
    vars["--border"] = palette.neutral[200];
    vars["--text"] = pickContrastShade(palette.neutral, lightBg, [900, 950], 7);
    vars["--text-muted"] = pickContrastShade(palette.neutral, lightBg, [500, 600, 700, 800, 900, 950], 4.5);
    vars["--pricing-surface"] = "#ffffff";
  }

  return vars;
}
