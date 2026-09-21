import { useRef, useState, type DragEvent } from "react";
import { X } from "lucide-react";
import type { useGeneratorState } from "../hooks/useGeneratorState";
import type { PaletteSource } from "../lib/types";
import AiToggle from "./AiToggle";
import Button from "./ui/Button";
import IconButton from "./ui/IconButton";
import SegmentedControl from "./ui/SegmentedControl";

const EXAMPLE_THEMES = ["sunset desert", "corporate fintech trustworthy", "cyberpunk neon", "midnight jazz mysterious"];

const INPUT_MODES: { value: "text" | "image"; label: string }[] = [
  { value: "text", label: "Written theme" },
  { value: "image", label: "Image" },
];

interface GeneratorPanelProps {
  gen: ReturnType<typeof useGeneratorState>;
  source: PaletteSource;
}

export default function GeneratorPanel({ gen, source }: GeneratorPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) gen.selectImage(file);
  }

  const canGenerate = gen.inputMode === "text" ? gen.text.trim().length > 0 : Boolean(gen.imagePreview);

  return (
    <div className="flex w-full flex-col gap-3.5 p-3.5 lg:h-full lg:overflow-y-auto lg:p-4.5">
      <SegmentedControl
        label="Input mode"
        options={INPUT_MODES}
        value={gen.inputMode}
        onChange={gen.setInputMode}
        className="self-start"
      />

      {gen.inputMode === "text" ? (
        <div className="flex flex-col gap-3">
          <textarea
            ref={textareaRef}
            rows={3}
            value={gen.text}
            onChange={(e) => gen.setText(e.target.value)}
            placeholder="e.g. sunset over the desert, or corporate fintech, trustworthy"
            className="box-border w-full resize-none rounded-[10px] border border-line bg-white p-2.5 font-sans text-[13px] leading-snug text-ink"
          />
          {gen.text.trim().length > 0 ? (
            <Button
              variant="secondary"
              size="sm"
              className="self-start"
              onClick={() => {
                gen.setText("");
                textareaRef.current?.focus();
              }}
            >
              Clear text
            </Button>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLE_THEMES.map((example) => (
                <Button key={example} variant="secondary" size="sm" onClick={() => gen.setText(example)}>
                  {example}
                </Button>
              ))}
            </div>
          )}
          {gen.aiAvailable && <AiToggle checked={gen.useAi} onChange={gen.setUseAi} />}
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
            <div className="relative w-full max-w-55">
              <img src={gen.imagePreview} alt="Preview" className="max-h-40 w-full rounded-md object-contain" />
              <IconButton
                label="Remove image"
                className="absolute -right-2 -top-2 shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  gen.clearImage();
                }}
              >
                <X size={13} aria-hidden="true" />
              </IconButton>
            </div>
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
      {gen.variationIndex > 0 && gen.inputMode === "text" && !source.proposedColors && (
        <p className="text-[11px] text-muted-2">Variation {gen.variationIndex}</p>
      )}
      {gen.error && <p className="text-xs text-red-600">{gen.error}</p>}

      <div className="mt-auto flex flex-wrap gap-2 pt-1">
        <Button
          variant="primary"
          onClick={() => void gen.generate()}
          disabled={!canGenerate || gen.isProcessing}
          className="min-h-[44px] flex-1 lg:min-h-0"
        >
          {gen.isProcessing ? "Generating…" : "Generate palette"}
        </Button>
        {gen.inputMode === "text" && (
          <Button
            variant="secondary"
            onClick={gen.shuffle}
            disabled={!gen.canShuffle}
            title={
              !gen.canShuffle
                ? "Generate a palette for this text first (and turn off AI mode) to shuffle variations"
                : undefined
            }
            className="min-h-[44px] lg:min-h-0"
          >
            Shuffle
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={gen.reset}
          disabled={gen.canUndo}
          className="min-h-[44px] lg:min-h-0"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
