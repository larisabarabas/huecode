import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { UNDO_SHORTCUT_LABEL, UNDO_WINDOW_MS } from "../hooks/useGeneratorState";
import IconButton from "./ui/IconButton";

interface UndoToastProps {
  open: boolean;
  /** Theme the palette was reset to. */
  themeLabel: string;
  onUndo: () => void;
  onDismiss: () => void;
}

export default function UndoToast({ open, themeLabel, onUndo, onDismiss }: UndoToastProps) {
  const undoRef = useRef<HTMLButtonElement>(null);

  // Reset just wiped the palette — hand the keyboard straight to the way back.
  useEffect(() => {
    if (open) undoRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 lg:bottom-4">
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-auto relative flex max-w-[calc(100%-2rem)] flex-wrap items-center gap-x-3 gap-y-1.5 overflow-hidden rounded-xl border border-line bg-ink px-4 py-2.5 text-[12.5px] font-medium text-shell-bg shadow-lg"
      >
        <span>
          Palette reset to <span className="font-semibold">{themeLabel}</span>
        </span>
        <button
          ref={undoRef}
          type="button"
          onClick={onUndo}
          className="rounded-md bg-white/15 px-2.5 py-1 font-semibold hover:bg-white/25"
        >
          Undo
        </button>
        <span className="text-white/45">{UNDO_SHORTCUT_LABEL}</span>
        <IconButton
          label="Dismiss"
          variant="bare"
          onClick={onDismiss}
          className="ml-auto text-white/45 hover:text-shell-bg"
        >
          <X size={14} aria-hidden="true" />
        </IconButton>
        <span
          aria-hidden="true"
          className="undo-countdown absolute inset-x-0 bottom-0 h-0.5 bg-white/35"
          style={{ animationDuration: `${UNDO_WINDOW_MS}ms` }}
        />
      </div>
    </div>
  );
}
