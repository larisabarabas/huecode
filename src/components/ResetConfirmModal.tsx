import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { DEFAULT_THEME, UNDO_WINDOW_MS } from "../hooks/useGeneratorState";

interface ResetConfirmModalProps {
  open: boolean;
  /** Theme name that will be discarded. */
  themeLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ResetConfirmModal({ open, themeLabel, onConfirm, onCancel }: ResetConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const opener = document.activeElement as HTMLElement | null;
    const root = document.getElementById("root");
    root?.setAttribute("inert", "");
    root?.setAttribute("aria-hidden", "true");

    // Focus Cancel, not the destructive button — a reflexive Enter must be safe.
    cancelRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCancel();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("button");
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      root?.removeAttribute("inert");
      root?.removeAttribute("aria-hidden");
      opener?.focus?.();
    };
  }, [open, onCancel]);

  if (!open) return null;

  const seconds = Math.round(UNDO_WINDOW_MS / 1000);

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-dialog-title"
    >
      <div className="absolute inset-0 bg-ink/40" onClick={onCancel} />
      <div
        ref={dialogRef}
        className="relative w-full max-w-sm rounded-2xl border border-line bg-shell-bg p-5 shadow-xl"
      >
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
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="rounded-[9px] border border-line px-3.5 py-2 text-[13px] font-semibold text-muted hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-[9px] bg-danger px-3.5 py-2 text-[13px] font-semibold text-danger-fg hover:brightness-95"
          >
            Reset palette
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
