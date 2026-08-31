import { SHADE_STEPS, type HSL, type ShadeScale } from "./types";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function hslToHex({ h, s, l }: HSL): string {
  const sat = clamp(s, 0, 100) / 100;
  const light = clamp(l, 0, 100) / 100;
  const hue = ((h % 360) + 360) % 360;

  const k = (n: number) => (n + hue / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const toHex = (n: number) =>
    Math.round(f(n) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(0)}${toHex(8)}${toHex(4)}`;
}

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: l * 100 };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h: number;
  switch (max) {
    case rN:
      h = (gN - bN) / d + (gN < bN ? 6 : 0);
      break;
    case gN:
      h = (bN - rN) / d + 2;
      break;
    default:
      h = (rN - gN) / d + 4;
  }
  h *= 60;

  return { h, s: s * 100, l: l * 100 };
}

export function hexToHsl(hex: string): HSL {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

/**
 * Fraction of the way from the near-white extreme (50) to the midpoint (500),
 * and from the midpoint (500) to the near-black extreme (950). Modeled on the
 * shape of Tailwind's default scales, but the midpoint itself is whatever
 * lightness the caller asked for (see generateShadeScale) rather than a
 * fixed constant — so a caller's chosen l is actually reflected in shade 500.
 */
const LIGHT_SIDE_FRACTION: Record<number, number> = {
  50: 0,
  100: 0.067,
  200: 0.244,
  300: 0.467,
  400: 0.733,
  500: 1,
};
const DARK_SIDE_FRACTION: Record<number, number> = {
  500: 0,
  600: 0.2,
  700: 0.4,
  800: 0.6,
  900: 0.8,
  950: 1,
};
const LIGHT_EXTREME = 97;
const DARK_EXTREME = 12;

export function generateShadeScale(base: HSL): ShadeScale {
  // Keep some headroom on each side so the ramp never collapses into a flat band.
  const midL = clamp(base.l, 15, 90);
  const scale = {} as ShadeScale;

  for (const step of SHADE_STEPS) {
    const isLightSide = step <= 500;
    const range = isLightSide ? LIGHT_EXTREME - midL : midL - DARK_EXTREME;
    const fraction = isLightSide ? LIGHT_SIDE_FRACTION[step] : DARK_SIDE_FRACTION[step];
    const targetL = isLightSide ? LIGHT_EXTREME - fraction * range : midL - fraction * range;

    // Pull saturation down slightly at the extremes so 50/950 don't look neon or muddy.
    const distanceFromMid = range === 0 ? 0 : Math.abs(targetL - midL) / range;
    const satAdjust = 1 - distanceFromMid * 0.28;

    scale[step] = hslToHex({
      h: base.h,
      s: clamp(base.s * satAdjust, 0, 100),
      l: targetL,
    });
  }
  return scale;
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const channel = c / 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(hexA: string, hexB: string): number {
  const lumA = relativeLuminance(hexA);
  const lumB = relativeLuminance(hexB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Returns "#000000" or "#ffffff", whichever reads better on the given background. */
export function readableTextColor(backgroundHex: string): string {
  const contrastWithBlack = contrastRatio(backgroundHex, "#000000");
  const contrastWithWhite = contrastRatio(backgroundHex, "#ffffff");
  return contrastWithBlack >= contrastWithWhite ? "#000000" : "#ffffff";
}
