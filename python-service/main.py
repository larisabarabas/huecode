"""Standalone color-extraction service.

Run locally:
    cd python-service
    python3 -m venv .venv && source .venv/bin/activate
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8788

Test:
    curl -F "file=@/path/to/image.jpg" http://localhost:8788/extract

Not wired into the Express proxy or deployed anywhere — the frontend
(src/lib/imageToPalette.ts) fetches this service directly at
http://localhost:8788 behind a dev-only "Use Python extraction" toggle,
shown in the Image tab only when this service responds to /health.
"""

from __future__ import annotations

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from color_extraction import ExtractionError, extract_swatches

app = FastAPI(title="Color Extraction Service", version="0.1.0")

# Permissive for standalone local testing (e.g. calling straight from the Vite
# dev server's origin). Tighten this if/when the service is wired into prod.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

MAX_UPLOAD_BYTES = 10 * 1024 * 1024


class Swatch(BaseModel):
    hex: str
    population: int


class ExtractResponse(BaseModel):
    swatches: dict[str, Swatch | None]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/extract", response_model=ExtractResponse)
async def extract(file: UploadFile = File(...)) -> ExtractResponse:
    if not (file.content_type or "").startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail=f"Image exceeds {MAX_UPLOAD_BYTES // (1024 * 1024)} MB limit.")

    try:
        swatches = extract_swatches(data)
    except ExtractionError as err:
        raise HTTPException(status_code=422, detail=str(err)) from err

    return ExtractResponse(swatches=swatches)
