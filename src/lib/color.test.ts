import { describe, expect, it } from "vitest";
import {
  clamp,
  contrastRatio,
  generateShadeScale,
  hexToHsl,
  hexToRgb,
  hslToHex,
  readableTextColor,
  relativeLuminance,
  rgbToHex,
  rgbToHsl,
} from "./color.js";
import { SHADE_STEPS } from "./types.js";

describe("clamp", () => {
  it("passes values inside the range through unchanged", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps to min/max at the boundaries", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe("hex/rgb/hsl conversions", () => {
  it("round-trips hex -> rgb -> hex", () => {
    expect(rgbToHex(...hexToRgb("#3366cc"))).toBe("#3366cc");
  });

  it("round-trips rgb -> hsl -> hex back to (approximately) the same color", () => {
    const [r, g, b] = [51, 102, 204];
    const hsl = rgbToHsl(r, g, b);
    const hex = hslToHex(hsl);
    expect(hex).toBe(rgbToHex(r, g, b));
  });

  it("expands 3-digit hex shorthand", () => {
    expect(hexToRgb("#fff")).toEqual([255, 255, 255]);
  });

  it("treats pure gray as zero saturation", () => {
    const hsl = rgbToHsl(128, 128, 128);
    expect(hsl.s).toBe(0);
  });

  it("hexToHsl matches hexToRgb -> rgbToHsl", () => {
    expect(hexToHsl("#8844aa")).toEqual(rgbToHsl(...hexToRgb("#8844aa")));
  });
});

describe("generateShadeScale", () => {
  it("anchors shade 500 on the input lightness, not a hardcoded constant", () => {
    // Regression test: generateShadeScale used to hardcode shade 500 to l:52
    // regardless of the requested lightness. It must reflect the caller's l.
    const base = { h: 260, s: 60, l: 30 };
    const scale = generateShadeScale(base);
    const { l: shade500Lightness } = hexToHsl(scale[500]);
    expect(shade500Lightness).toBeCloseTo(base.l, 0);
  });

  it("clamps the anchor lightness used for shade 500 into [15, 90]", () => {
    const veryDark = generateShadeScale({ h: 200, s: 50, l: 2 });
    const veryLight = generateShadeScale({ h: 200, s: 50, l: 99 });
    expect(hexToHsl(veryDark[500]).l).toBeCloseTo(15, 0);
    expect(hexToHsl(veryLight[500]).l).toBeCloseTo(90, 0);
  });

  it("produces a monotonically decreasing lightness ramp from shade 50 to 950", () => {
    const scale = generateShadeScale({ h: 210, s: 55, l: 45 });
    const lightnesses = SHADE_STEPS.map((step) => hexToHsl(scale[step]).l);
    for (let i = 1; i < lightnesses.length; i++) {
      expect(lightnesses[i]).toBeLessThanOrEqual(lightnesses[i - 1] + 0.01);
    }
  });

  it("returns a hex value for every shade step", () => {
    const scale = generateShadeScale({ h: 0, s: 0, l: 50 });
    for (const step of SHADE_STEPS) {
      expect(scale[step]).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});

describe("contrast helpers", () => {
  it("gives white and black a contrast ratio of 21:1", () => {
    expect(contrastRatio("#ffffff", "#000000")).toBeCloseTo(21, 0);
  });

  it("picks black text on a light background", () => {
    expect(readableTextColor("#fdf6e3")).toBe("#000000");
  });

  it("picks white text on a dark background", () => {
    expect(readableTextColor("#101010")).toBe("#ffffff");
  });

  it("gives identical colors a contrast ratio of 1:1", () => {
    expect(contrastRatio("#336699", "#336699")).toBeCloseTo(1, 5);
  });

  it("relativeLuminance is 0 for black and 1 for white", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 5);
  });
});
