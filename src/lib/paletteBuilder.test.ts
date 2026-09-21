import { describe, expect, it } from "vitest";
import { hexToHsl } from "./color.js";
import {
  SEMANTIC_ANCHORS,
  assemblePalette,
  buildPaletteFromBase,
  buildPaletteFromRoles,
  mixHue,
} from "./paletteBuilder.js";
import { mulberry32 } from "./random.js";
import { COLOR_ROLES, SHADE_STEPS, type HSL } from "./types.js";

const role = (h: number, s: number, l: number): HSL => ({ h, s, l });

describe("mixHue", () => {
  it("returns h1 unchanged at weight 0 and h2 at weight 1", () => {
    expect(mixHue(10, 50, 0)).toBeCloseTo(10, 5);
    expect(mixHue(10, 50, 1)).toBeCloseTo(50, 5);
  });

  it("takes the shortest path across the 0/360 wrap", () => {
    // 350 -> 10 the short way goes forward through 360/0, not backward through 180.
    const mixed = mixHue(350, 10, 0.5);
    expect(mixed).toBeCloseTo(0, 0);
  });
});

describe("assemblePalette", () => {
  it("generates a shade scale for every color role", () => {
    const roles = Object.fromEntries(
      COLOR_ROLES.map((r) => [r, role(200, 50, 50)]),
    ) as Record<(typeof COLOR_ROLES)[number], HSL>;

    const palette = assemblePalette(roles);

    for (const r of COLOR_ROLES) {
      for (const step of SHADE_STEPS) {
        expect(palette[r][step]).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
  });

  it("clamps neutral lightness into [38, 46] regardless of the requested value", () => {
    const roles = Object.fromEntries(
      COLOR_ROLES.map((r) => [r, role(0, 0, 50)]),
    ) as Record<(typeof COLOR_ROLES)[number], HSL>;
    roles.neutral = role(220, 10, 95); // far outside the allowed neutral range

    const palette = assemblePalette(roles);
    const neutral500Lightness = hexToHsl(palette.neutral[500]).l;

    // +/- 0.5 slack for hex quantization (lightness is stored as an 8-bit-per-channel hex color).
    expect(neutral500Lightness).toBeGreaterThanOrEqual(38 - 0.5);
    expect(neutral500Lightness).toBeLessThanOrEqual(46 + 0.5);
  });

  it("does not clamp lightness for non-neutral roles", () => {
    const roles = Object.fromEntries(
      COLOR_ROLES.map((r) => [r, role(0, 0, 50)]),
    ) as Record<(typeof COLOR_ROLES)[number], HSL>;
    roles.primary = role(260, 60, 90);

    const palette = assemblePalette(roles);
    const primary500Lightness = hexToHsl(palette.primary[500]).l;

    expect(primary500Lightness).toBeCloseTo(90, 0);
  });
});

describe("buildPaletteFromRoles / semantic color derivation", () => {
  it("keeps semantic hue shift within the 28-degree cap even for a far-off primary", () => {
    const primary = role(300, 70, 50); // far in hue from every semantic anchor
    const palette = buildPaletteFromRoles({
      primary,
      secondary: role(300, 60, 50),
      accent: role(120, 60, 50),
      neutral: role(0, 0, 42),
    });

    for (const [key, anchor] of Object.entries(SEMANTIC_ANCHORS) as [
      keyof typeof SEMANTIC_ANCHORS,
      HSL,
    ][]) {
      const derivedHue = hexToHsl(palette[key][500]).h;
      const diff = Math.abs(((derivedHue - anchor.h + 540) % 360) - 180);
      expect(diff).toBeLessThanOrEqual(28 + 1); // +1 for hex rounding slack
    }
  });

  it("leaves semantic hue at the anchor when primary shares that hue", () => {
    const primary = role(SEMANTIC_ANCHORS.error.h, 70, 50);
    const palette = buildPaletteFromRoles({
      primary,
      secondary: role(0, 60, 50),
      accent: role(120, 60, 50),
      neutral: role(0, 0, 42),
    });

    const derivedHue = hexToHsl(palette.error[500]).h;
    expect(derivedHue).toBeCloseTo(SEMANTIC_ANCHORS.error.h, 0);
  });
});

describe("buildPaletteFromBase", () => {
  it("produces a full 8-role palette from a single base hue", () => {
    const palette = buildPaletteFromBase(role(210, 60, 50));
    expect(Object.keys(palette).sort()).toEqual([...COLOR_ROLES].sort());
  });

  it("gives secondary and accent different hues from the base", () => {
    const base = role(210, 60, 50);
    const palette = buildPaletteFromBase(base);
    const primaryHue = hexToHsl(palette.primary[500]).h;
    const accentHue = hexToHsl(palette.accent[500]).h;
    expect(Math.abs(((accentHue - primaryHue + 540) % 360) - 180)).toBeGreaterThan(90);
  });

  it("produces a full 8-role palette when passed a seeded rng", () => {
    const base = role(210, 60, 50);
    const palette = buildPaletteFromBase(base, mulberry32(1));
    expect(Object.keys(palette).sort()).toEqual([...COLOR_ROLES].sort());
  });

  it("jitters secondary/accent hues away from the fixed defaults when given an rng", () => {
    const base = role(210, 60, 50);
    const fixed = buildPaletteFromBase(base);
    const jittered = buildPaletteFromBase(base, mulberry32(1));

    const fixedSecondaryHue = hexToHsl(fixed.secondary[500]).h;
    const jitteredSecondaryHue = hexToHsl(jittered.secondary[500]).h;
    const fixedAccentHue = hexToHsl(fixed.accent[500]).h;
    const jitteredAccentHue = hexToHsl(jittered.accent[500]).h;

    expect(jitteredSecondaryHue).not.toBeCloseTo(fixedSecondaryHue, 0);
    expect(jitteredAccentHue).not.toBeCloseTo(fixedAccentHue, 0);
  });
});
