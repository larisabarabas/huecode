import { useEffect, useRef, useState, type DragEvent } from "react";
import { paletteFromThemeText } from "../lib/textToPalette";
import { paletteFromImage } from "../lib/imageToPalette";
import { AiPaletteError, fetchAiAvailability, paletteFromThemeTextAI } from "../lib/aiPalette";
import type { Palette, PaletteSource } from "../lib/types";

const EXAMPLE_THEMES = ["sunset desert", "corporate fintech trustworthy", "cyberpunk neon", "sage botanical minimal"];

interface ThemeInputProps {
  onGenerate: (palette: Palette, source: PaletteSource) => void;
  /** Called when the user clears an input, so the parent can drop any palette generated from it. */
  onClear?: () => void;
}

export default function ThemeInput({ onGenerate, onClear }: ThemeInputProps) {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [useAi, setUseAi] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAiAvailability().then(setAiAvailable);
  }, []);

  async function handleTextSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (!useAi) {
      onGenerate(paletteFromThemeText(trimmed), { kind: "text", label: trimmed });
      return;
    }

    setError(null);
    setIsProcessing(true);
    try {
      const { palette, proposedColors, rationale } = await paletteFromThemeTextAI(trimmed);
      onGenerate(palette, {
        kind: "text",
        label: trimmed,
        note: rationale || "AI-generated",
        proposedColors,
      });
    } catch (err) {
      setError(err instanceof AiPaletteError ? err.message : "AI generation failed. Try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleImageFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError(null);
    setIsProcessing(true);
    setImagePreview(URL.createObjectURL(file));
    try {
      const palette = await paletteFromImage(file);
      onGenerate(palette, { kind: "image", label: file.name });
    } catch {
      setError("Couldn't read colors from that image. Try a different file.");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) void handleImageFile(file);
  }

  function handleClearText() {
    setText("");
    setError(null);
    onClear?.();
  }

  function handleClearImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClear?.();
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex gap-1">
        <button
          type="button"
          onClick={() => setMode("text")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "text" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Written theme
        </button>
        <button
          type="button"
          onClick={() => setMode("image")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "image" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Image
        </button>
      </div>

      {mode === "text" ? (
        <div className="flex flex-col gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. sunset over the desert, or corporate fintech, trustworthy"
            rows={3}
            className="w-full resize-none rounded-md border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none"
          />
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLE_THEMES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setText(example)}
                className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 hover:border-slate-400 hover:text-slate-700"
              >
                {example}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void handleTextSubmit()}
                disabled={!text.trim() || isProcessing}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isProcessing ? "Generating…" : "Generate palette"}
              </button>
              <button
                type="button"
                onClick={handleClearText}
                disabled={!text && !error}
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear
              </button>
            </div>

            {aiAvailable && (
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-500">
                <input
                  type="checkbox"
                  checked={useAi}
                  onChange={(e) => setUseAi(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300"
                />
                Enhance with AI
              </label>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed p-6 text-center transition-colors ${
            isDragging ? "border-slate-500 bg-slate-50" : "border-slate-300"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImageFile(file);
            }}
          />
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 w-full max-w-xs rounded-md object-contain"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearImage();
                }}
                aria-label="Remove image"
                title="Remove image"
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white shadow hover:bg-slate-700"
              >
                ✕
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Drag & drop an image, or click to choose one
            </p>
          )}
          {isProcessing && <p className="text-xs text-slate-400">Extracting colors…</p>}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
