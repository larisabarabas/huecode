import { useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import type { Palette } from "../lib/types";
import SwatchStrip from "./SwatchStrip";

interface GeneratorRailProps {
  palette: Palette;
  onOpen: () => void;
  /** Focus the toggle button on mount — only when this mount is the result of the user just
   * collapsing the panel, never on the page's initial load (see the comment at the call site
   * in App.tsx). */
  autoFocus?: boolean;
}

/**
 * The generator collapsed to a 60px icon rail (wide viewports only). The button keeps
 * `aria-label`/`title="Open generator"` as a discoverability fallback (hover tooltip + screen
 * reader name) even without a persistent visible label — the owner's explicit call.
 * Height is the row's default `align-items: stretch` (see App.tsx) — same mechanism as the
 * panel and preview card, deliberately not a per-component override, so toggling collapsed vs.
 * open never changes which height rule is in effect.
 */
export default function GeneratorRail({ palette, onOpen, autoFocus = false }: GeneratorRailProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Rail is conditionally mounted (not just hidden), so a plain mount-only effect correctly
  // fires exactly once per collapse — there's no re-render case where autoFocus could change
  // out from under an already-mounted rail.
  useEffect(() => {
    if (autoFocus) buttonRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside className="order-1 flex w-15 flex-none flex-col gap-3 rounded-card bg-white p-3 shadow-card lg:min-h-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={onOpen}
        aria-label="Open generator"
        title="Open generator"
        className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-chrome text-muted-2 transition-colors hover:bg-chrome-2 hover:text-ink"
      >
        <ChevronRight size={14} aria-hidden="true" />
      </button>
      <SwatchStrip palette={palette} orientation="vertical" grow />
    </aside>
  );
}
