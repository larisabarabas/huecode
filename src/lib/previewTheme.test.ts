import { describe, expect, it } from "vitest";
import { contrastRatio } from "./color.js";
import { assemblePalette } from "./paletteBuilder.js";
import { paletteToCssVars, type PreviewMode } from "./previewTheme.js";
import { COLOR_ROLES, type ColorRole, type HSL, type Palette } from "./types.js";

const role = (h: number, s: number, l: number): HSL => ({ h, s, l });

/** A plausible base hue/saturation for every role, independent of the dimension under test. */
const BASELINE_ROLES: Record<ColorRole, HSL> = {
  primary: role(255, 55, 50),
  secondary: role(210, 60, 50),
  accent: role(165, 55, 45),
  neutral: role(255, 8, 42),
  success: role(142, 65, 42),
  warning: role(38, 92, 50),
  error: role(4, 78, 52),
  info: role(217, 80, 52),
};

function palette(overrides: Partial<Record<ColorRole, HSL>>): Palette {
  return assemblePalette({ ...BASELINE_ROLES, ...overrides });
}

/** Three palettes chosen to stress the parts of paletteToCssVars that fall back to a
 * pickContrastShade candidate list instead of a fixed formula. */
const ADVERSARIAL_PALETTES: Record<string, Palette> = {
  "near-white primary": palette({ primary: role(255, 45, 97) }),
  "near-black primary": palette({ primary: role(255, 45, 3) }),
  "fully desaturated": palette(
    Object.fromEntries(COLOR_ROLES.map((r) => [r, role(0, 0, BASELINE_ROLES[r].l)])) as Record<ColorRole, HSL>,
  ),
};

const MODES: PreviewMode[] = ["light", "dark"];
const SEMANTIC_PREFIXES = ["ok", "warn", "err", "info"] as const;

describe("paletteToCssVars contrast guarantees", () => {
  for (const [label, p] of Object.entries(ADVERSARIAL_PALETTES)) {
    for (const mode of MODES) {
      describe(`${label} (${mode})`, () => {
        const vars = paletteToCssVars(p, mode);

        it("meets 7:1 for --text on --bg", () => {
          expect(contrastRatio(vars["--text"], vars["--bg"])).toBeGreaterThanOrEqual(7);
        });

        it("meets 4.5:1 for --text-2 and --text-3 on --bg", () => {
          expect(contrastRatio(vars["--text-2"], vars["--bg"])).toBeGreaterThanOrEqual(4.5);
          expect(contrastRatio(vars["--text-3"], vars["--bg"])).toBeGreaterThanOrEqual(4.5);
        });

        it("meets 4.5:1 for --accent-fg on --accent", () => {
          expect(contrastRatio(vars["--accent-fg"], vars["--accent"])).toBeGreaterThanOrEqual(4.5);
        });

        it("meets 4.5:1 for --accent-soft-fg on --accent-soft", () => {
          expect(contrastRatio(vars["--accent-soft-fg"], vars["--accent-soft"])).toBeGreaterThanOrEqual(4.5);
        });

        it.each(SEMANTIC_PREFIXES)("meets 4.5:1 for --%s-fg on --%s", (prefix) => {
          expect(contrastRatio(vars[`--${prefix}-fg`], vars[`--${prefix}`])).toBeGreaterThanOrEqual(4.5);
        });
      });
    }
  }
});

describe("paletteToCssVars token set", () => {
  const vars = paletteToCssVars(palette({}), "light");
  const expectedKeys = [
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
  ];

  it("emits exactly the v15 semantic token set", () => {
    expect(Object.keys(vars).sort()).toEqual([...expectedKeys].sort());
  });

  it("emits --ring as an 8-digit hex with an alpha channel", () => {
    expect(vars["--ring"]).toMatch(/^#[0-9a-f]{6}[0-9a-f]{2}$/i);
  });
});
