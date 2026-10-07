"""Perceptually-accurate dominant-color extraction.

Pipeline: decode -> downscale (anti-aliased) -> drop transparent pixels ->
convert to CIELAB (perceptually uniform, so Euclidean distance in this space
tracks perceived color difference) -> k-means cluster in Lab space -> score
each cluster against six target lightness/saturation profiles (vibrant/muted
x light/normal/dark) -> return the best-matching cluster per target as a hex
swatch.

Clustering in Lab instead of raw RGB/HSL is the main accuracy win over JS
quantizers (node-vibrant, color-thief): those cluster in RGB or HSL, where
equal numeric distance does not mean equal perceived distance, so their
clusters can merge colors a human sees as distinct or split one perceived
color across several clusters.

The six target profiles and their weighting are ported from the Android
Palette API's Target class (the same lineage node-vibrant's JS port draws
from), a well-tested definition of what "vibrant"/"muted" and
"light"/"dark" mean for UI swatches.
"""

from __future__ import annotations

import io
from dataclasses import dataclass

import numpy as np
from PIL import Image, ImageOps
from skimage.color import lab2rgb, rgb2lab
from skimage.transform import resize
from sklearn.cluster import KMeans


class ExtractionError(Exception):
    pass


# Longest edge (px) we downscale to before clustering. Large enough that
# small color regions survive, small enough that k-means over every pixel
# stays fast for a single-image request.
MAX_DIM = 300

# Alpha below this (of 255) is treated as fully transparent and excluded,
# rather than blended against an assumed background.
ALPHA_CUTOFF = 16

N_CLUSTERS = 16
MIN_PIXELS_FOR_CLUSTERING = N_CLUSTERS * 4

WEIGHT_SATURATION = 3.0
WEIGHT_LIGHTNESS = 6.5
WEIGHT_POPULATION = 0.5


@dataclass(frozen=True)
class Target:
    name: str
    min_lightness: float
    target_lightness: float
    max_lightness: float
    min_saturation: float
    target_saturation: float
    max_saturation: float


TARGETS = [
    Target("Vibrant", 0.30, 0.50, 0.70, 0.35, 1.00, 1.00),
    Target("LightVibrant", 0.55, 0.74, 1.00, 0.35, 1.00, 1.00),
    Target("DarkVibrant", 0.00, 0.26, 0.45, 0.35, 1.00, 1.00),
    Target("Muted", 0.30, 0.50, 0.70, 0.00, 0.30, 0.40),
    Target("LightMuted", 0.55, 0.74, 1.00, 0.00, 0.30, 0.40),
    Target("DarkMuted", 0.00, 0.26, 0.45, 0.00, 0.30, 0.40),
]


def _load_rgb_pixels(data: bytes) -> np.ndarray:
    try:
        image = Image.open(io.BytesIO(data))
        image.load()
    except Exception as err:
        raise ExtractionError("Could not decode image.") from err

    image = ImageOps.exif_transpose(image)  # honor camera-rotation EXIF before we lose it to resize

    has_alpha = image.mode in ("RGBA", "LA") or (image.mode == "P" and "transparency" in image.info)
    image = image.convert("RGBA") if has_alpha else image.convert("RGB")

    arr = np.asarray(image)
    scale = min(1.0, MAX_DIM / max(arr.shape[0], arr.shape[1]))
    if scale < 1.0:
        new_shape = (max(1, round(arr.shape[0] * scale)), max(1, round(arr.shape[1] * scale)))
        arr = resize(arr, new_shape, anti_aliasing=True, preserve_range=True).astype(np.uint8)

    if has_alpha:
        rgb = arr[..., :3].reshape(-1, 3)
        alpha = arr[..., 3].reshape(-1)
        rgb = rgb[alpha >= ALPHA_CUTOFF]
    else:
        rgb = arr.reshape(-1, 3)

    if rgb.shape[0] < MIN_PIXELS_FOR_CLUSTERING:
        raise ExtractionError("Image has too few opaque pixels to extract colors from.")

    return rgb


def _rgb_to_l_s(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Vectorized RGB[0,255] -> HSL lightness/saturation, for target scoring only."""
    r, g, b = rgb[..., 0] / 255.0, rgb[..., 1] / 255.0, rgb[..., 2] / 255.0
    maxc = np.maximum(np.maximum(r, g), b)
    minc = np.minimum(np.minimum(r, g), b)
    l = (maxc + minc) / 2.0
    d = maxc - minc
    s = np.where(d == 0, 0.0, d / (1 - np.abs(2 * l - 1) + 1e-9))
    return l, s


def _score(l: float, s: float, population: int, max_population: int, target: Target) -> float | None:
    if not (target.min_lightness <= l <= target.max_lightness):
        return None
    if not (target.min_saturation <= s <= target.max_saturation):
        return None
    l_score = 1 - abs(l - target.target_lightness)
    s_score = 1 - abs(s - target.target_saturation)
    pop_score = population / max_population if max_population else 0.0
    return WEIGHT_LIGHTNESS * l_score + WEIGHT_SATURATION * s_score + WEIGHT_POPULATION * pop_score


def extract_swatches(data: bytes) -> dict[str, dict | None]:
    rgb = _load_rgb_pixels(data)

    # rgb2lab/lab2rgb operate on image-shaped arrays; treat the pixel list as a 1-row image.
    lab = rgb2lab(rgb.reshape(1, -1, 3) / 255.0).reshape(-1, 3)

    n_clusters = min(N_CLUSTERS, rgb.shape[0] // 4)
    kmeans = KMeans(n_clusters=n_clusters, n_init=10, random_state=0)
    labels = kmeans.fit_predict(lab)

    populations = np.bincount(labels, minlength=n_clusters)
    centers_rgb = np.clip(lab2rgb(kmeans.cluster_centers_.reshape(1, -1, 3)).reshape(-1, 3), 0, 1) * 255
    ls, ss = _rgb_to_l_s(centers_rgb)
    max_population = int(populations.max()) if populations.size else 0

    used: set[int] = set()
    swatches: dict[str, dict | None] = {}
    for target in TARGETS:
        best_idx, best_score = None, -1.0
        for i in range(n_clusters):
            if i in used:
                continue
            score = _score(float(ls[i]), float(ss[i]), int(populations[i]), max_population, target)
            if score is not None and score > best_score:
                best_idx, best_score = i, score
        if best_idx is None:
            swatches[target.name] = None
            continue
        used.add(best_idx)
        r, g, b = centers_rgb[best_idx].round().astype(int)
        swatches[target.name] = {
            "hex": f"#{r:02x}{g:02x}{b:02x}",
            "population": int(populations[best_idx]),
        }

    return swatches
