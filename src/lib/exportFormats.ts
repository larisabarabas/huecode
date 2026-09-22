import { paletteToCssVars, type PreviewMode } from "./previewTheme";
import { COLOR_ROLES, SHADE_STEPS, type Palette } from "./types";

export type ExportFormatId = "tailwind-v4" | "tailwind-v3" | "css-vars" | "ts-tokens";

export interface ExportFormat {
  id: ExportFormatId;
  label: string;
  filename: string;
  language: string;
  generate: (palette: Palette) => string;
}

function forEachSwatch(palette: Palette, fn: (role: string, step: number, hex: string) => void) {
  for (const role of COLOR_ROLES) {
    for (const step of SHADE_STEPS) {
      fn(role, step, palette[role][step]);
    }
  }
}

/**
 * Fixed order for the semantic light/dark tokens (rather than relying on the insertion order
 * `paletteToCssVars` happens to build its object in, which differs slightly between the light
 * and dark branches) so every export lists them in the same, readable sequence.
 */
const SEMANTIC_TOKENS = [
  "--bg",
  "--surface",
  "--surface-2",
  "--surface-3",
  "--border",
  "--border-strong",
  "--text",
  "--text-2",
  "--text-3",
  "--accent",
  "--accent-hover",
  "--accent-fg",
  "--accent-soft",
  "--accent-soft-fg",
  "--ring",
  "--ok",
  "--ok-soft",
  "--ok-fg",
  "--warn",
  "--warn-soft",
  "--warn-fg",
  "--err",
  "--err-soft",
  "--err-fg",
  "--info",
  "--info-soft",
  "--info-fg",
  "--shadow-sm",
  "--shadow-md",
  "--shadow-lg",
] as const;

function semanticEntries(palette: Palette, mode: PreviewMode): [string, string][] {
  const vars = paletteToCssVars(palette, mode);
  return SEMANTIC_TOKENS.map((key) => [key, vars[key]]);
}

/** "accent-soft-fg" -> "accentSoftFg", for the JS/TS object formats. */
function toCamelCase(key: string): string {
  return key.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

function cssVarLines(entries: [string, string][], indent = "  "): string[] {
  return entries.map(([key, value]) => `${indent}${key}: ${value};`);
}

/**
 * The semantic recipe (not just the raw shade scale) as portable CSS: light values at `:root`,
 * dark values applied either by OS preference or by an explicit `data-theme` override, so the
 * consuming app can let the browser decide or toggle it manually without needing to swap the
 * values itself.
 */
function semanticCssBlock(palette: Palette): string {
  const light = semanticEntries(palette, "light");
  const dark = semanticEntries(palette, "dark");
  return [
    "/* Semantic theme — light is the default; dark applies via OS preference or an explicit",
    '   data-theme override (e.g. <html data-theme="dark">), so either mechanism works. */',
    ":root {",
    ...cssVarLines(light),
    "}",
    "",
    "@media (prefers-color-scheme: dark) {",
    '  :root:not([data-theme="light"]) {',
    ...cssVarLines(dark, "    "),
    "  }",
    "}",
    "",
    '[data-theme="dark"] {',
    ...cssVarLines(dark),
    "}",
  ].join("\n");
}

/** Indented `key: "value",` lines for a JS/TS object, camelCased and unquoted. */
function jsObjectLines(entries: [string, string][], indent: string): string[] {
  return entries.map(([key, value]) => `${indent}${toCamelCase(key.slice(2))}: "${value}",`);
}

function tailwindV4(palette: Palette): string {
  const lines: string[] = ["@theme {"];
  forEachSwatch(palette, (role, step, hex) => {
    lines.push(`  --color-${role}-${step}: ${hex};`);
  });
  lines.push("}", "", semanticCssBlock(palette));
  return lines.join("\n");
}

function tailwindV3(palette: Palette): string {
  const lines: string[] = [
    "/** @type {import('tailwindcss').Config} */",
    "module.exports = {",
    "  theme: {",
    "    extend: {",
    "      colors: {",
  ];
  for (const role of COLOR_ROLES) {
    lines.push(`        ${role}: {`);
    for (const step of SHADE_STEPS) {
      lines.push(`          ${step}: "${palette[role][step]}",`);
    }
    lines.push("        },");
  }
  lines.push("      },", "    },", "  },", "");
  lines.push(
    "  // Semantic light/dark tokens. Tailwind v3's config can't express a token with two",
    "  // values — dark mode here means writing dark:bg-primary-400 with two static colors in",
    "  // markup, not swapping one. Provided for reference / manual use in your own CSS custom",
    "  // properties; see the CSS vars or Tailwind v4 export for a version that works as-is.",
    "  semanticTheme: {",
    "    light: {",
    ...jsObjectLines(semanticEntries(palette, "light"), "      "),
    "    },",
    "    dark: {",
    ...jsObjectLines(semanticEntries(palette, "dark"), "      "),
    "    },",
    "  },",
  );
  lines.push("};");
  return lines.join("\n");
}

function cssVars(palette: Palette): string {
  const lines: string[] = [":root {"];
  forEachSwatch(palette, (role, step, hex) => {
    lines.push(`  --color-${role}-${step}: ${hex};`);
  });
  lines.push("}", "", semanticCssBlock(palette));
  return lines.join("\n");
}

function tsTokens(palette: Palette): string {
  const lines: string[] = ["export const colors = {"];
  for (const role of COLOR_ROLES) {
    lines.push(`  ${role}: {`);
    for (const step of SHADE_STEPS) {
      lines.push(`    ${step}: "${palette[role][step]}",`);
    }
    lines.push("  },");
  }
  lines.push(
    "} as const;",
    "",
    "export type ColorRole = keyof typeof colors;",
    "export type ColorShade = keyof typeof colors.primary;",
    "",
    "export const theme = {",
    "  light: {",
    ...jsObjectLines(semanticEntries(palette, "light"), "    "),
    "  },",
    "  dark: {",
    ...jsObjectLines(semanticEntries(palette, "dark"), "    "),
    "  },",
    "} as const;",
    "",
    "export type ThemeMode = keyof typeof theme;",
  );
  return lines.join("\n");
}

export const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: "tailwind-v4",
    label: "Tailwind v4 (CSS theme)",
    filename: "theme.css",
    language: "css",
    generate: tailwindV4,
  },
  {
    id: "tailwind-v3",
    label: "Tailwind v3 (config)",
    filename: "tailwind.config.js",
    language: "javascript",
    generate: tailwindV3,
  },
  {
    id: "css-vars",
    label: "CSS custom properties",
    filename: "colors.css",
    language: "css",
    generate: cssVars,
  },
  {
    id: "ts-tokens",
    label: "TS tokens",
    filename: "colors.ts",
    language: "typescript",
    generate: tsTokens,
  },
];
