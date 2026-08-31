import { Vibrant } from "node-vibrant/browser";
import { hexToHsl } from "./color";
import { buildPaletteFromRoles, mixHue } from "./paletteBuilder";
import type { HSL, Palette } from "./types";

const SWATCH_NAMES = ["Vibrant", "DarkVibrant", "LightVibrant", "Muted", "DarkMuted", "LightMuted"] as const;
type SwatchName = (typeof SWATCH_NAMES)[number];
type Role = "primary" | "secondary" | "accent" | "neutral";

/**
 * Which named node-vibrant swatch to prefer for each palette role, in
 * priority order. node-vibrant (the algorithm behind Android's Palette API)
 * already separates an image's colors into perceptually distinct
 * vivid/muted, light/dark buckets — that maps onto UI roles far more
 * reliably than clustering raw pixels ourselves and guessing.
 */
const ROLE_PRIORITY: Record<Role, SwatchName[]> = {
  primary: ["Vibrant", "DarkVibrant", "LightVibrant", "Muted", "DarkMuted", "LightMuted"],
  secondary: ["DarkVibrant", "LightVibrant", "Vibrant", "DarkMuted", "LightMuted", "Muted"],
  accent: ["LightVibrant", "Vibrant", "DarkVibrant", "LightMuted", "Muted", "DarkMuted"],
  neutral: ["LightMuted", "Muted", "DarkMuted", "LightVibrant", "DarkVibrant", "Vibrant"],
};

const FALLBACK_PRIMARY: HSL = { h: 220, s: 45, l: 50 };

export async function extractPaletteColors(imageUrl: string): Promise<Record<Role, HSL>> {
  const vibrantPalette = await Vibrant.from(imageUrl).maxDimension(200).getPalette();

  const available = new Map<SwatchName, string>();
  for (const name of SWATCH_NAMES) {
    const swatch = vibrantPalette[name];
    if (swatch) available.set(name, swatch.hex);
  }

  const used = new Set<SwatchName>();
  const roles = {} as Record<Role, HSL>;

  for (const role of Object.keys(ROLE_PRIORITY) as Role[]) {
    const name = ROLE_PRIORITY[role].find((candidate) => available.has(candidate) && !used.has(candidate));
    if (name) {
      used.add(name);
      roles[role] = hexToHsl(available.get(name)!);
    }
  }

  // Very sparse image (e.g. a flat logo/icon) may not yield 4 distinct
  // swatches. Derive any missing role from whatever we did find via
  // color-theory rotation, rather than falling back to an unrelated color.
  const anchor = roles.primary ?? (available.size > 0 ? hexToHsl([...available.values()][0]) : FALLBACK_PRIMARY);
  roles.primary ??= anchor;
  roles.secondary ??= { h: mixHue(anchor.h, anchor.h - 30, 1), s: anchor.s * 0.85, l: anchor.l };
  roles.accent ??= { h: mixHue(anchor.h, anchor.h + 180, 1), s: Math.min(anchor.s * 1.1, 100), l: anchor.l };
  roles.neutral ??= { h: anchor.h, s: Math.min(anchor.s * 0.15, 12), l: 50 };

  return roles;
}

export async function paletteFromImage(file: File): Promise<Palette> {
  const url = URL.createObjectURL(file);
  try {
    const roles = await extractPaletteColors(url);
    return buildPaletteFromRoles(roles);
  } finally {
    URL.revokeObjectURL(url);
  }
}
