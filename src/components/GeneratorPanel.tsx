import { useEffect, useRef, useState, type DragEvent } from "react";
import { ChevronDown, ChevronLeft, RotateCcw, Sparkles, X } from "lucide-react";
import type { useGeneratorState } from "../hooks/useGeneratorState";
import type { Palette, PaletteSource } from "../lib/types";
import AiToggle from "./AiToggle";
import PaletteRows from "./PaletteRows";
import SwatchStrip from "./SwatchStrip";
import Button from "./ui/Button";
import IconButton from "./ui/IconButton";
import SegmentedControl from "./ui/SegmentedControl";

const EXAMPLE_THEMES = ["sunset desert", "corporate fintech trustworthy", "cyberpunk neon", "midnight jazz mysterious"];

const INPUT_MODES: { value: "text" | "image"; label: string }[] = [
  { value: "text", label: "Written theme" },
  { value: "image", label: "Image" },
];

// Deliberately not the shared Button component: these chips need a 9px radius (the exact
// v15 spec value) and a bg-white/hover:bg-panel-inset treatment Button's `secondary` variant
// doesn't have. Composing them via Button's `className` prop was considered and rejected —
// Tailwind's utility precedence is decided by the generated stylesheet's own rule order, not
// by where a class appears in a given element's className string, so a trailing override
// class isn't guaranteed to beat Button's built-in ones (this exact footgun already caused a
// real bug earlier in this project's CSS). A dedicated Button variant would work but touches
// a widely-shared component for one call site; hand-rolling here is the smaller, safer
// footprint until more call sites need it.
const CHIP_CLASS =
  "rounded-[9px] border border-line bg-white px-2.5 py-1.5 text-[11.5px] font-semibold text-muted-3 transition-colors hover:bg-panel-inset hover:text-ink";

interface GeneratorPanelProps {
  gen: ReturnType<typeof useGeneratorState>;
  source: PaletteSource;
  palette: Palette;
  wide: boolean;
  showStrip: boolean;
  panelOpen: boolean;
  onTogglePanel: () => void;
  /** Focus the collapse button on mount — only when this mount is the result of the user just
   * expanding the panel, never on the page's initial load (see the comment at the call site
   * in App.tsx). */
  autoFocus?: boolean;
}

export default function GeneratorPanel({
  gen,
  source,
  palette,
  wide,
  showStrip,
  panelOpen,
  onTogglePanel,
  autoFocus = false,
}: GeneratorPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Panel is conditionally mounted (not just hidden), so a plain mount-only effect correctly
  // fires exactly once per expand.
  useEffect(() => {
    if (autoFocus) toggleButtonRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) gen.selectImage(file);
  }

  const canGenerate = gen.inputMode === "text" ? gen.text.trim().length > 0 : Boolean(gen.imagePreview);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <div className="flex flex-none flex-col gap-3 p-4.5 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
            Generator
          </span>
          <button
            ref={toggleButtonRef}
            type="button"
            onClick={onTogglePanel}
            aria-label={wide ? "Collapse generator" : "Toggle generator"}
            aria-expanded={panelOpen}
            aria-controls="generator-panel-body"
            className="ml-auto flex h-6.5 w-6.5 flex-none items-center justify-center rounded-[8px] bg-chrome text-muted-2 transition-colors hover:bg-chrome-2 hover:text-ink"
          >
            {wide ? (
              <ChevronLeft size={14} aria-hidden="true" />
            ) : (
              <ChevronDown
                size={14}
                aria-hidden="true"
                className={`transition-transform motion-reduce:transition-none ${panelOpen ? "rotate-180" : ""}`}
              />
            )}
          </button>
        </div>
        <div className="flex min-w-0 items-baseline gap-1.5">
          <span className="flex-none text-[11px] font-medium text-muted">from</span>
          <span className="truncate text-[12.5px] font-semibold text-ink">&ldquo;{source.label}&rdquo;</span>
        </div>
        {showStrip && <SwatchStrip palette={palette} className="h-9" />}
      </div>

      {panelOpen && (
        <div id="generator-panel-body" className="flex flex-none flex-col gap-6 px-4.5 pb-7 pt-1">
          <div className="flex flex-col gap-3.5 rounded-2xl bg-panel-inset p-4">
            <SegmentedControl
              label="Input mode"
              options={INPUT_MODES}
              value={gen.inputMode}
              onChange={gen.setInputMode}
              size="sm"
              className="self-start"
            />

            {gen.inputMode === "text" ? (
              <div className="flex flex-col gap-3.5">
                <textarea
                  ref={textareaRef}
                  rows={3}
                  value={gen.text}
                  onChange={(e) => gen.setText(e.target.value)}
                  placeholder="e.g. sunset over the desert, or corporate fintech, trustworthy"
                  className="box-border w-full resize-none rounded-xl border border-line bg-white p-2.5 font-sans text-[13.5px] leading-snug text-ink shadow-[0_1px_2px_rgba(23,22,31,0.05)]"
                />
                {gen.text.trim().length > 0 ? (
                  <button
                    type="button"
                    className={`self-start ${CHIP_CLASS}`}
                    onClick={() => {
                      gen.setText("");
                      textareaRef.current?.focus();
                    }}
                  >
                    Clear text
                  </button>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {EXAMPLE_THEMES.map((example) => (
                      <button
                        key={example}
                        type="button"
                        className={CHIP_CLASS}
                        onClick={() => gen.setText(example)}
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                )}
                {gen.aiAvailable && (
                  <div className="flex items-center gap-2.5">
                    <AiToggle checked={gen.useAi} onChange={gen.setUseAi} />
                    <span className="ml-auto font-mono text-[10.5px] text-muted">8 roles · 11 steps</span>
                  </div>
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
                className={`box-border flex h-41 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-1.5 text-center transition-colors ${
                  isDragging ? "border-muted-2 bg-white" : "border-line bg-white"
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
                    <img src={gen.imagePreview} alt="Preview" className="max-h-32 w-full rounded-lg object-contain" />
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
          </div>

          {source.note && gen.inputMode === "text" && (
            <p className="rounded-md bg-chrome px-2.5 py-2 text-[11.5px] leading-relaxed text-muted-2">{source.note}</p>
          )}
          {gen.variationIndex > 0 && gen.inputMode === "text" && !source.proposedColors && (
            <p className="text-[11px] text-muted-2">Variation {gen.variationIndex}</p>
          )}
          {gen.error && <p className="text-xs text-red-600">{gen.error}</p>}

          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={() => void gen.generate()}
              disabled={!canGenerate || gen.isProcessing}
              className="min-h-[44px] flex-1"
            >
              {gen.useAi && <Sparkles size={15} aria-hidden="true" />}
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
                className="min-h-[44px]"
              >
                Shuffle
              </Button>
            )}
            <button
              type="button"
              onClick={gen.reset}
              disabled={gen.canUndo}
              aria-label="Reset"
              title={gen.canUndo ? "Already reset — use the undo toast to restore the previous palette" : "Reset"}
              className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-xl border border-line bg-white text-muted-2 transition-colors hover:bg-panel-inset hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw size={15} aria-hidden="true" />
            </button>
          </div>

          <PaletteRows palette={palette} />
        </div>
      )}
    </div>
  );
}
