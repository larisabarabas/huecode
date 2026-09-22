import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { DEFAULT_THEME, UNDO_WINDOW_MS } from "../hooks/useGeneratorState";
import { useFocusTrap } from "../hooks/useFocusTrap";
import Button from "./ui/Button";

interface ResetConfirmModalProps {
  open: boolean;
  /** Theme name that will be discarded. */
  themeLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ResetConfirmModal({ open, themeLabel, onConfirm, onCancel }: ResetConfirmModalProps) {
  // Focus Cancel, not the destructive button — a reflexive Enter must be safe.
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap({ active: open, containerRef: dialogRef, initialFocusRef: cancelRef, onClose: onCancel });

  // This IS a true page-blocking modal (unlike CodeDrawer) — inert the rest of the page for
  // the duration, on top of the shared Tab-trap/Escape/focus-restore behavior above.
  useEffect(() => {
    if (!open) return;
    const root = document.getElementById("root");
    root?.setAttribute("inert", "");
    root?.setAttribute("aria-hidden", "true");
    return () => {
      root?.removeAttribute("inert");
      root?.removeAttribute("aria-hidden");
    };
  }, [open]);

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
          <Button ref={cancelRef} variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Reset palette
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
