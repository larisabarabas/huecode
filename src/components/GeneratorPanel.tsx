import { useRef, useState, type DragEvent } from "react";
import type { useGeneratorState } from "../hooks/useGeneratorState";
import type { PaletteSource } from "../lib/types";

const EXAMPLE_THEMES = ["sunset desert", "corporate fintech trustworthy", "cyberpunk neon", "midnight jazz mysterious"];

interface GeneratorPanelProps {
  gen: ReturnType<typeof useGeneratorState>;
  source: PaletteSource;
}

export default function GeneratorPanel({ gen, source }: GeneratorPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) gen.selectImage(file);
  }

  const canGenerate = gen.inputMode === "text" ? gen.text.trim().length > 0 : Boolean(gen.imagePreview);

  return (
    <div className="flex h-full w-full flex-col gap-3.5 overflow-y-auto p-4.5">
      <div className="flex w-fit gap-0.5 rounded-[9px] bg-chrome-2 p-0.5">
        <button
          type="button"
          onClick={() => gen.setInputMode("text")}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
            gen.inputMode === "text" ? "bg-chip-purple text-shell-bg" : "text-muted-2"
          }`}
        >
          Written theme
        </button>
        <button
          type="button"
          onClick={() => gen.setInputMode("image")}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
            gen.inputMode === "image" ? "bg-chip-purple text-shell-bg" : "text-muted-2"
          }`}
        >
          Image
        </button>
      </div>

      {gen.inputMode === "text" ? (
        <div className="flex flex-col gap-3">
          <textarea
            rows={3}
            value={gen.text}
            onChange={(e) => gen.setText(e.target.value)}
            placeholder="e.g. sunset over the desert, or corporate fintech, trustworthy"
            className="w-full resize-none rounded-[10px] border border-line bg-white p-2.5 font-sans text-[13px] leading-snug text-ink outline-none"
          />
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLE_THEMES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => gen.setText(example)}
                className="rounded-full border border-line px-2.5 py-1 text-[11.5px] text-muted hover:text-ink"
              >
                {example}
              </button>
            ))}
          </div>
          {gen.aiAvailable && (
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-2">
              <span
                onClick={() => gen.setUseAi(!gen.useAi)}
                className="relative inline-block h-4.5 w-8 rounded-full transition-colors"
                style={{ backgroundColor: gen.useAi ? "var(--color-coral)" : "#dad6e6" }}
              >
                <span
                  className="absolute top-0.5 h-3 w-3 rounded-full bg-white transition-[left]"
                  style={{ left: gen.useAi ? "16px" : "3px" }}
                />
              </span>
              Enhance with AI
            </label>
          )}
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
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-7 text-center transition-colors ${
            isDragging ? "border-muted-2 bg-chrome" : "border-line"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) gen.selectImage(file);
            }}
          />
          {gen.imagePreview ? (
            <img
              src={gen.imagePreview}
              alt="Preview"
              className="max-h-40 w-full max-w-55 rounded-md object-contain"
            />
          ) : (
            <p className="text-[12.5px] leading-relaxed text-muted-2">
              Drag &amp; drop an image
              <br />
              or click to choose one
            </p>
          )}
          {gen.isProcessing && <p className="text-[11px] text-muted">Extracting colors…</p>}
        </div>
      )}

      {source.note && gen.inputMode === "text" && (
        <p className="rounded-md bg-chrome px-2.5 py-2 text-[11.5px] leading-relaxed text-muted-2">{source.note}</p>
      )}
      {gen.error && <p className="text-xs text-red-600">{gen.error}</p>}

      <div className="mt-auto flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => void gen.generate()}
          disabled={!canGenerate || gen.isProcessing}
          className="flex-1 rounded-[9px] bg-coral px-2.5 py-2.5 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {gen.isProcessing ? "Generating…" : "Generate palette"}
        </button>
        <button
          type="button"
          onClick={gen.clear}
          className="rounded-[9px] border border-line px-3.5 py-2.5 text-[13px] font-semibold text-muted hover:text-ink"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
