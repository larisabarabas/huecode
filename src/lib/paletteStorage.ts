import { COLOR_ROLES, SHADE_STEPS, type Palette, type PaletteSource } from "./types";

const KEY = "huecode:last-palette";

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export interface StoredPalette {
  palette: Palette;
  source: PaletteSource;
}

function isValidPalette(value: unknown): value is Palette {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return COLOR_ROLES.every((role) => {
    const scale = record[role] as Record<string, unknown> | undefined;
    if (!scale) return false;
    return SHADE_STEPS.every((step) => {
      const hex = scale[step];
      return typeof hex === "string" && HEX_COLOR.test(hex);
    });
  });
}

/** Read the last persisted palette, or null if absent / unreadable / malformed. */
export function loadStoredPalette(): StoredPalette | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredPalette>;
    if (!isValidPalette(parsed.palette) || !parsed.source || typeof parsed.source.label !== "string") {
      return null;
    }
    return { palette: parsed.palette, source: parsed.source };
  } catch {
    return null;
  }
}

export function saveStoredPalette(data: StoredPalette): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Storage unavailable (private mode, quota, disabled) — non-fatal.
  }
}

export function clearStoredPalette(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
