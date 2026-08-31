import type { HSL, Palette } from "./types";
import { hashToHue, KEYWORD_DICTIONARY } from "./keywordDictionary";
import { buildPaletteFromBase, mixHue } from "./paletteBuilder";

/** Circular mean of a set of hues, weighted equally. */
function meanHue(hues: number[]): number {
  const radians = hues.map((h) => (h * Math.PI) / 180);
  const sumSin = radians.reduce((acc, r) => acc + Math.sin(r), 0);
  const sumCos = radians.reduce((acc, r) => acc + Math.cos(r), 0);
  const meanRad = Math.atan2(sumSin / hues.length, sumCos / hues.length);
  return ((meanRad * 180) / Math.PI + 360) % 360;
}

export function themeTextToBaseColor(text: string): HSL {
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const matchedWords = words.filter((word) => KEYWORD_DICTIONARY[word]);
  const unmatchedWords = words.filter((word) => !KEYWORD_DICTIONARY[word]);

  if (matchedWords.length === 0) {
    const trimmed = text.trim();
    return { h: hashToHue(trimmed || "default"), s: 55, l: 50 };
  }

  const matches = matchedWords.map((word) => KEYWORD_DICTIONARY[word]);
  const matchedHue = meanHue(matches.map((m) => m.h));
  const s = matches.reduce((acc, m) => acc + m.s, 0) / matches.length;
  const l = matches.reduce((acc, m) => acc + m.l, 0) / matches.length;

  // Words we don't recognize shouldn't be silently ignored: nudge the hue
  // toward a hash of them so two phrases sharing one keyword still diverge
  // (e.g. "summer romance" vs "summer storm").
  if (unmatchedWords.length === 0) {
    return { h: matchedHue, s, l };
  }
  const unmatchedHue = hashToHue(unmatchedWords.join(" "));
  const nudgeWeight = (unmatchedWords.length / words.length) * 0.6;
  return { h: mixHue(matchedHue, unmatchedHue, nudgeWeight), s, l };
}

export function paletteFromThemeText(text: string): Palette {
  return buildPaletteFromBase(themeTextToBaseColor(text));
}
