import { useEffect, type RefObject } from "react";

interface UseFocusTrapArgs {
  active: boolean;
  /** Tab/Shift+Tab cycles among the <button> elements inside this container. */
  containerRef: RefObject<HTMLElement | null>;
  /** Focused when the trap activates. */
  initialFocusRef: RefObject<HTMLElement | null>;
  /** Focused when the trap deactivates. Falls back to whatever had focus right before
   * activation (e.g. a trigger that can vary by call site) if omitted. */
  returnFocusRef?: RefObject<HTMLElement | null>;
  onClose: () => void;
}

/**
 * Shared Tab-cycling focus trap + Escape-to-close + focus restore, used by both
 * ResetConfirmModal (a true page-blocking modal — pairs this with `inert`/a backdrop) and
 * CodeDrawer (an intentionally non-modal dialog — the format chips in the header must stay
 * reachable while it's open, so it does *not* inert the rest of the page; see the comment on
 * CodeDrawer's `role="dialog"` for why it doesn't set `aria-modal`). This hook only owns the
 * keyboard behavior common to both, not the modal-vs-non-modal distinction.
 */
export function useFocusTrap({ active, containerRef, initialFocusRef, returnFocusRef, onClose }: UseFocusTrapArgs) {
  useEffect(() => {
    if (!active) return;

    const opener = (returnFocusRef?.current ?? document.activeElement) as HTMLElement | null;
    initialFocusRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = containerRef.current?.querySelectorAll<HTMLElement>("button");
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
      (returnFocusRef?.current ?? opener)?.focus?.();
    };
  }, [active, containerRef, initialFocusRef, returnFocusRef, onClose]);
}
