import { useMemo, useRef, type RefObject } from "react";
import { Download, X } from "lucide-react";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { downloadTextFile } from "../lib/download";
import { EXPORT_FORMATS, type ExportFormatId } from "../lib/exportFormats";
import type { Palette } from "../lib/types";

const HEX_RE = /#([0-9a-f]{6})/i;

interface CodeDrawerProps {
  open: boolean;
  format: ExportFormatId;
  palette: Palette;
  onClose: () => void;
  /** The filename button in AppHeader — focus returns here on close. */
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export default function CodeDrawer({ open, format, palette, onClose, triggerRef }: CodeDrawerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { copiedKey, failedKey, copy } = useCopyToClipboard();

  const active = EXPORT_FORMATS.find((f) => f.id === format)!;
  const source = useMemo(() => active.generate(palette), [active, palette]);
  const lines = useMemo(() => source.split("\n"), [source]);
  const copyFailed = failedKey === active.id;

  useFocusTrap({
    active: open,
    containerRef: dialogRef,
    initialFocusRef: closeRef,
    returnFocusRef: triggerRef,
    onClose,
  });

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      id="code-drawer"
      // Intentionally not aria-modal="true": the header's format chips must stay reachable
      // and change this drawer's content live while it's open (a tested requirement),
      // so the rest of the page is deliberately never made inert — this is the WAI-ARIA
      // "non-modal dialog" pattern, not an oversight. ResetConfirmModal.tsx is the true modal
      // (inert + backdrop) for comparison.
      role="dialog"
      aria-label="Generated code"
      className="absolute inset-y-0 right-0 z-10 flex w-full flex-col border-l border-white/[0.09] bg-code-bg shadow-[-30px_0_70px_-34px_rgba(23,22,31,0.55)] sm:w-[min(470px,100%)]"
    >
      <div className="flex flex-none items-center gap-2.5 border-b border-white/[0.08] px-3.5 py-3">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.07] px-2.5 py-1 font-mono text-[11px] text-[#e9e7f4]">
          <span className="h-1.5 w-1.5 flex-none rounded-full bg-coral" />
          {active.filename}
        </span>
        <span className="text-[11.5px] text-[#8b87a3]">
          {active.label} · {lines.length} lines
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close code preview"
          className="ml-auto flex h-6.5 w-6.5 flex-none items-center justify-center rounded-lg bg-white/[0.06] text-[#b6b2c9] transition-colors hover:bg-white/[0.12] hover:text-white"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto py-3">
        {lines.map((text, i) => {
          const hex = HEX_RE.exec(text);
          return (
            <div key={i} className="flex min-h-[19px] items-center gap-3 px-3.5 hover:bg-white/[0.04]">
              <span className="w-6 flex-none select-none text-right font-mono text-[10.5px] leading-[19px] text-[#4e4a63]">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-pre font-mono text-[11.5px] leading-[19px] text-[#d7d4e6]">
                {text}
              </span>
              {hex && (
                <span
                  className="h-2.75 w-2.75 flex-none rounded-[3px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
                  style={{ backgroundColor: hex[0] }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-none items-center gap-2 border-t border-white/[0.08] px-3.5 py-3">
        <span className="text-[11px] text-[#6e6a8a]">
          Paste into <span className="font-mono text-[10.5px] text-[#b6b2c9]">{active.filename}</span>
        </span>
        <button
          type="button"
          onClick={() => copy(source, active.id)}
          aria-live="polite"
          className={`ml-auto inline-flex items-center gap-1.5 rounded-[10px] border px-3 py-2 font-sans text-xs font-semibold transition-colors ${
            copyFailed
              ? "border-red-500 text-red-400"
              : "border-white/[0.14] bg-transparent text-[#e9e7f4] hover:bg-white/[0.08]"
          }`}
        >
          {copiedKey === active.id ? "Copied" : copyFailed ? "Copy failed" : "Copy"}
        </button>
        <button
          type="button"
          onClick={() => downloadTextFile(active.filename, source)}
          className="inline-flex items-center gap-1.5 rounded-[10px] border-0 bg-coral px-3 py-2 font-sans text-xs font-semibold text-white transition-colors hover:brightness-95"
        >
          <Download size={13} aria-hidden="true" />
          Download
        </button>
      </div>
    </div>
  );
}
