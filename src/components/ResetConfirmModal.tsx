import { useEffect, useRef } from "react";
import { DEFAULT_THEME, UNDO_WINDOW_MS } from "../hooks/useGeneratorState";

interface ResetConfirmModalProps {
  open: boolean;
  /** Theme name that will be discarded. */
  themeLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ResetConfirmModal({ open, themeLabel, onConfirm, onCancel }: ResetConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  const seconds = Math.round(UNDO_WINDOW_MS / 1000);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-dialog-title"
    >
      <div className="absolute inset-0 bg-ink/40" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl border border-line bg-shell-bg p-5 shadow-xl">
        <h2 id="reset-dialog-title" className="text-[15px] font-semibold text-ink">
          Reset the palette?
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          This discards <span className="font-semibold text-ink">{themeLabel}</span> and returns to the{" "}
          <span className="font-semibold text-ink">{DEFAULT_THEME}</span> default. You&rsquo;ll have {seconds}{" "}
          seconds to undo.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[9px] border border-line px-3.5 py-2 text-[13px] font-semibold text-muted hover:text-ink"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className="rounded-[9px] bg-coral px-3.5 py-2 text-[13px] font-bold text-white"
          >
            Reset palette
          </button>
        </div>
      </div>
    </div>
  );
}
