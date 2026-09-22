import { useEffect, useState } from "react";

/** Exported so every consumer (including App.tsx's own resize-sync effect) shares one
 * source of truth instead of each hardcoding the same literal and risking drift. */
export const WIDE_QUERY = "(min-width: 1024px)";

export interface ShellLayout {
  /** True at/above the 1024px breakpoint every other layout decision reacts to. */
  wide: boolean;
  /** 60px icon rail — only reachable on wide viewports with the panel collapsed. */
  showRail: boolean;
  /** 404px generator panel — always shown narrow, or wide with the panel open. */
  showPanel: boolean;
  /** The swatch strip inside the panel header (hidden when the rail already shows one). */
  showStrip: boolean;
}

/** The same 1024px breakpoint the whole shell reacts to, for any component (e.g. the App/
 * Marketing preview mocks) that needs to hide/reflow content on its own rather than through
 * a prop passed down from App.tsx. */
export function useWideViewport(): boolean {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE_QUERY).matches);

  useEffect(() => {
    const query = window.matchMedia(WIDE_QUERY);
    function handleChange(e: MediaQueryListEvent) {
      setWide(e.matches);
    }
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return wide;
}

/**
 * Resolves the generator's rail/panel state from the current breakpoint and whether the
 * user has it open. A matrix collapse mode was considered and cut — rail is the only
 * collapsed state, so this is a plain two-way split.
 */
export function useShellLayout(panelOpen: boolean): ShellLayout {
  const wide = useWideViewport();

  return {
    wide,
    showRail: wide && !panelOpen,
    showPanel: !wide || panelOpen,
    showStrip: panelOpen || !wide,
  };
}

/** Exposed separately so App.tsx can seed its initial `panelOpen` state without a second
 * matchMedia listener — mirrors the "open on desktop, collapsed on mobile" default. */
export function isWideViewport(): boolean {
  return window.matchMedia(WIDE_QUERY).matches;
}
