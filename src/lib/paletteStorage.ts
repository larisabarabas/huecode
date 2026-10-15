import { COLOR_ROLES, SHADE_STEPS, type Palette, type PaletteSource } from "./types";

const KEY = "huecode:last-palette";

const AI_KEY = "huecode:use-ai";

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
    const { thumbnail, ...rest } = parsed.source;
    // The thumbnail feeds an <img src>, so only accept inline image data URLs.
    const safeThumbnail =
      typeof thumbnail === "string" && thumbnail.startsWith("data:image/") ? thumbnail : undefined;
    return {
      palette: parsed.palette,
      source: safeThumbnail ? { ...rest, thumbnail: safeThumbnail } : rest,
    };
  } catch {
    return null;
  }
}

export function saveStoredPalette(data: StoredPalette): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Quota is the likely cause and the thumbnail is the bulky part: keep the palette without it.
    try {
      const { thumbnail: _thumbnail, ...source } = data.source;
      localStorage.setItem(KEY, JSON.stringify({ palette: data.palette, source }));
    } catch {
      // Storage unavailable (private mode, disabled) — non-fatal.
    }
  }
}

export function clearStoredPalette(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

/** Last value of the "Use AI" toggle; false when absent or unreadable. */
export function loadStoredUseAi(): boolean {
  try {
    return localStorage.getItem(AI_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveStoredUseAi(value: boolean): void {
  try {
    localStorage.setItem(AI_KEY, value ? "1" : "0");
  } catch {
    // non-fatal
  }
}
