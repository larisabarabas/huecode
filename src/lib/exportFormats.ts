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

function tailwindV4(palette: Palette): string {
  const lines: string[] = ["@theme {"];
  forEachSwatch(palette, (role, step, hex) => {
    lines.push(`  --color-${role}-${step}: ${hex};`);
  });
  lines.push("}");
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
  lines.push("      },", "    },", "  },", "};");
  return lines.join("\n");
}

function cssVars(palette: Palette): string {
  const lines: string[] = [":root {"];
  forEachSwatch(palette, (role, step, hex) => {
    lines.push(`  --color-${role}-${step}: ${hex};`);
  });
  lines.push("}");
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
  lines.push("} as const;", "", "export type ColorRole = keyof typeof colors;", "export type ColorShade = keyof typeof colors.primary;");
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
