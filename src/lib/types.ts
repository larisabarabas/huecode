export const SHADE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type ShadeStep = (typeof SHADE_STEPS)[number];

export type ShadeScale = Record<ShadeStep, string>;

export const COLOR_ROLES = [
  "primary",
  "secondary",
  "accent",
  "neutral",
  "success",
  "warning",
  "error",
  "info",
] as const;
export type ColorRole = (typeof COLOR_ROLES)[number];

export type Palette = Record<ColorRole, ShadeScale>;

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface PaletteSource {
  kind: "text" | "image";
  label: string;
  note?: string;
  /** Raw base colors the AI proposed, before shade-ramp expansion. Only set for AI-generated palettes. */
  proposedColors?: Record<ColorRole, HSL>;
}
