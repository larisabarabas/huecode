import { Vibrant } from "node-vibrant/browser";
import { hexToHsl } from "./color";
import { buildPaletteFromRoles, mixHue } from "./paletteBuilder";
import type { HSL, Palette } from "./types";

export class ImagePaletteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImagePaletteError";
  }
}

/** Which color-extraction backend to run an image through. */
export type ExtractionEngine = "vibrant" | "python";

/**
 * Local dev-only companion service (python-service/, see its README) that
 * clusters in CIELAB instead of RGB/HSL for more perceptually accurate
 * swatches. Not deployed anywhere — only reachable when someone has it
 * running locally via `uvicorn main:app --port 8788`.
 */
const PYTHON_SERVICE_URL = import.meta.env.VITE_PYTHON_COLOR_SERVICE_URL ?? "http://localhost:8788";

/** How long we wait for the health check before assuming the service is down. */
const PYTHON_SERVICE_PING_TIMEOUT_MS = 1500;

export async function checkPythonServiceAvailability(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PYTHON_SERVICE_PING_TIMEOUT_MS);
    try {
      const res = await fetch(`${PYTHON_SERVICE_URL}/health`, { signal: controller.signal });
      return res.ok;
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return false;
  }
}

/** Longest edge (px) we downscale to before color extraction. */
const EXTRACT_MAX_DIM = 240;

/**
 * Decode + downscale the file with createImageBitmap (the decode runs off the
 * main thread), so Vibrant only ever quantizes a tiny image. Falls back to
 * handing Vibrant the raw file if createImageBitmap / canvas is unavailable.
 */
async function prepareImageSource(file: File): Promise<{ src: string; cleanup: () => void }> {
  if (typeof createImageBitmap === "function") {
    let bitmap: ImageBitmap | null = null;
    try {
      bitmap = await createImageBitmap(file);
      const scale = Math.min(1, EXTRACT_MAX_DIM / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(bitmap, 0, 0, w, h);
        return { src: canvas.toDataURL("image/png"), cleanup: () => {} };
      }
    } catch {
      // Unsupported by createImageBitmap (e.g. some SVGs) — fall back to Vibrant's own <img> decode.
    } finally {
      bitmap?.close();
    }
  }

  const url = URL.createObjectURL(file);
  return { src: url, cleanup: () => URL.revokeObjectURL(url) };
}

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

/**
 * Maps a set of named swatches (whichever extractor produced them) onto the
 * four palette roles, and derives any role a sparse image didn't yield via
 * color-theory rotation rather than falling back to an unrelated color.
 */
function rolesFromSwatches(available: Map<SwatchName, string>): Record<Role, HSL> {
  const used = new Set<SwatchName>();
  const roles = {} as Record<Role, HSL>;

  for (const role of Object.keys(ROLE_PRIORITY) as Role[]) {
    const name = ROLE_PRIORITY[role].find((candidate) => available.has(candidate) && !used.has(candidate));
    if (name) {
      used.add(name);
      roles[role] = hexToHsl(available.get(name)!);
    }
  }

  const anchor = roles.primary ?? (available.size > 0 ? hexToHsl([...available.values()][0]) : FALLBACK_PRIMARY);
  roles.primary ??= anchor;
  roles.secondary ??= { h: mixHue(anchor.h, anchor.h - 30, 1), s: anchor.s * 0.85, l: anchor.l };
  roles.accent ??= { h: mixHue(anchor.h, anchor.h + 180, 1), s: Math.min(anchor.s * 1.1, 100), l: anchor.l };
  roles.neutral ??= { h: anchor.h, s: Math.min(anchor.s * 0.15, 12), l: 50 };

  return roles;
}

export async function extractPaletteColors(imageUrl: string): Promise<Record<Role, HSL>> {
  const vibrantPalette = await Vibrant.from(imageUrl).maxDimension(200).getPalette();

  const available = new Map<SwatchName, string>();
  for (const name of SWATCH_NAMES) {
    const swatch = vibrantPalette[name];
    if (swatch) available.set(name, swatch.hex);
  }

  return rolesFromSwatches(available);
}

interface PythonExtractResponse {
  swatches: Partial<Record<SwatchName, { hex: string; population: number } | null>>;
}

/**
 * Sends the original file (no client-side downscale — the service does its
 * own) to the local python-service `/extract` endpoint and maps its named
 * swatches onto roles the same way the Vibrant path does.
 */
async function extractPaletteColorsViaPythonService(file: File): Promise<Record<Role, HSL>> {
  const body = new FormData();
  body.append("file", file);

  let res: Response;
  try {
    res = await fetch(`${PYTHON_SERVICE_URL}/extract`, { method: "POST", body });
  } catch {
    throw new ImagePaletteError(
      `Couldn't reach the Python color service at ${PYTHON_SERVICE_URL}. Is it running (uvicorn main:app --port 8788)?`,
    );
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw new ImagePaletteError(errBody?.detail ?? `Python color service request failed (${res.status}).`);
  }

  const data = (await res.json()) as PythonExtractResponse;
  const available = new Map<SwatchName, string>();
  for (const name of SWATCH_NAMES) {
    const swatch = data.swatches[name];
    if (swatch) available.set(name, swatch.hex);
  }

  return rolesFromSwatches(available);
}

export async function paletteFromImage(file: File, engine: ExtractionEngine = "vibrant"): Promise<Palette> {
  if (engine === "python") {
    const roles = await extractPaletteColorsViaPythonService(file);
    return buildPaletteFromRoles(roles);
  }

  const { src, cleanup } = await prepareImageSource(file);
  try {
    const roles = await extractPaletteColors(src);
    return buildPaletteFromRoles(roles);
  } catch (err) {
    if (err instanceof ImagePaletteError) throw err;
    throw new ImagePaletteError("That image looks corrupted or is in an unsupported format.");
  } finally {
    cleanup();
  }
}
