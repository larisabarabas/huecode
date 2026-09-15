import { describe, expect, it } from "vitest";
import { hashToHue, KEYWORD_DICTIONARY } from "./keywordDictionary.js";
import { paletteFromThemeText, themeTextToBaseColor } from "./textToPalette.js";
import { COLOR_ROLES } from "./types.js";

describe("themeTextToBaseColor", () => {
  it("falls back to a hash-derived hue when no word matches the dictionary", () => {
    const result = themeTextToBaseColor("xqzflarn");
    expect(result).toEqual({ h: hashToHue("xqzflarn"), s: 55, l: 50 });
  });

  it("falls back to hashToHue('default') for empty or whitespace-only input", () => {
    expect(themeTextToBaseColor("")).toEqual({ h: hashToHue("default"), s: 55, l: 50 });
    expect(themeTextToBaseColor("   ")).toEqual({ h: hashToHue("default"), s: 55, l: 50 });
  });

  it("strips punctuation and is case-insensitive when matching keywords", () => {
    const lower = themeTextToBaseColor("sunset");
    const upperWithPunctuation = themeTextToBaseColor("SUNSET!!");
    expect(upperWithPunctuation).toEqual(lower);
  });

  it("averages saturation/lightness and takes the circular mean of hue for multiple matches", () => {
    const ocean = KEYWORD_DICTIONARY.ocean;
    const fire = KEYWORD_DICTIONARY.fire;
    const result = themeTextToBaseColor("ocean fire");

    expect(result.s).toBeCloseTo((ocean.s + fire.s) / 2, 5);
    expect(result.l).toBeCloseTo((ocean.l + fire.l) / 2, 5);
    // Not a simple arithmetic mean of hue — themeTextToBaseColor must use the
    // circular mean (meanHue), which differs from (ocean.h + fire.h) / 2
    // whenever the hues aren't already close together.
    expect(result.h).not.toBeCloseTo((ocean.h + fire.h) / 2, 0);
  });

  it("returns the matched hue/s/l untouched when every word matches", () => {
    const sunset = KEYWORD_DICTIONARY.sunset;
    const result = themeTextToBaseColor("sunset");
    expect(result).toEqual({ h: sunset.h, s: sunset.s, l: sunset.l });
  });

  it("nudges the hue for unmatched words instead of ignoring them", () => {
    // Both phrases share the "summer" keyword but diverge via their unmatched word,
    // so they must not resolve to the same base color (called out in a source comment).
    const romance = themeTextToBaseColor("summer romance");
    const storm = themeTextToBaseColor("summer storm");
    expect(romance.h).not.toBeCloseTo(storm.h, 5);
  });

  it("keeps the matched hue when there are no unmatched words to nudge with", () => {
    const single = themeTextToBaseColor("ocean");
    expect(single.h).toBeCloseTo(KEYWORD_DICTIONARY.ocean.h, 5);
  });
});

describe("paletteFromThemeText", () => {
  it("produces a full 8-role palette from free text", () => {
    const palette = paletteFromThemeText("cozy autumn evening");
    expect(Object.keys(palette).sort()).toEqual([...COLOR_ROLES].sort());
  });

  it("is deterministic for the same input", () => {
    const a = paletteFromThemeText("cyberpunk neon");
    const b = paletteFromThemeText("cyberpunk neon");
    expect(a).toEqual(b);
  });
});
