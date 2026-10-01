import { useCallback, useEffect, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import AppHeader from "./components/AppHeader";
import CodeDrawer from "./components/CodeDrawer";
import PreviewPane, { type PreviewTab } from "./components/PreviewPane";
import GeneratorPanel from "./components/GeneratorPanel";
import GeneratorRail from "./components/GeneratorRail";
import ResetConfirmModal from "./components/ResetConfirmModal";
import UndoToast from "./components/UndoToast";
import { useShellLayout, isWideViewport, WIDE_QUERY } from "./hooks/useShellLayout";
import { DEFAULT_THEME, useGeneratorState } from "./hooks/useGeneratorState";
import type { ExportFormatId } from "./lib/exportFormats";
import { paletteFromThemeText } from "./lib/textToPalette";
import { loadStoredPalette, saveStoredPalette } from "./lib/paletteStorage";
import type { PreviewMode } from "./lib/previewTheme";
import type { Palette, PaletteSource } from "./lib/types";

export default function App() {
  const [stored] = useState(loadStoredPalette);
  const [palette, setPalette] = useState<Palette>(() => stored?.palette ?? paletteFromThemeText(DEFAULT_THEME));
  const [source, setSource] = useState<PaletteSource>(
    () => stored?.source ?? { kind: "text", label: DEFAULT_THEME },
  );
  const [previewTab, setPreviewTab] = useState<PreviewTab>("app");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("light");
  const [previewRadius, setPreviewRadius] = useState<"soft" | "sharp">("soft");
  const [format, setFormat] = useState<ExportFormatId>("tailwind-v4");
  const [codeOpen, setCodeOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(isWideViewport);
  // Once the user manually toggles the panel, stop overriding their choice on resize.
  const panelOpenTouchedRef = useRef(false);
  // CodeDrawer's focus-trap effect keys off this by reference — it must stay stable across
  // renders (an inline arrow function would re-fire the effect, and steal focus back to the
  // drawer's close button, on every unrelated App re-render while the drawer is open).
  const codeButtonRef = useRef<HTMLButtonElement>(null);
  const toggleCode = useCallback(() => setCodeOpen((v) => !v), []);
  const closeCode = useCallback(() => setCodeOpen(false), []);

  const { wide, showRail, showPanel, showStrip } = useShellLayout(panelOpen);

  // Keep the default (open on desktop, collapsed on mobile) in sync with the viewport,
  // matching the `lg:` breakpoint every other layout decision already reacts to live.
  useEffect(() => {
    const query = window.matchMedia(WIDE_QUERY);
    function handleChange(e: MediaQueryListEvent) {
      if (!panelOpenTouchedRef.current) setPanelOpen(e.matches);
    }
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  // Persist on every change so a render crash never loses the current palette.
  // Skip the very first run when we just loaded this exact data from storage —
  // writing it straight back would be a wasted, identical serialize.
  const skippedInitialSaveRef = useRef(false);
  useEffect(() => {
    if (!skippedInitialSaveRef.current && stored) {
      skippedInitialSaveRef.current = true;
      return;
    }
    skippedInitialSaveRef.current = true;
    saveStoredPalette({ palette, source });
  }, [palette, source, stored]);

  const handleGenerated = useCallback((nextPalette: Palette, nextSource: PaletteSource) => {
    setPalette(nextPalette);
    setSource(nextSource);
  }, []);

  const gen = useGeneratorState({ onGenerate: handleGenerated, current: { palette, source } });

  function togglePanel() {
    panelOpenTouchedRef.current = true;
    setPanelOpen((v) => !v);
  }

  return (
    <div className="flex min-h-screen flex-col bg-shell-bg p-5.5 font-sans text-ink antialiased lg:h-screen">
      <AppHeader
        previewMode={previewMode}
        onPreviewMode={setPreviewMode}
        previewRadius={previewRadius}
        onPreviewRadius={setPreviewRadius}
        format={format}
        onFormat={setFormat}
        codeOpen={codeOpen}
        onToggleCode={toggleCode}
        codeButtonRef={codeButtonRef}
      />

      {/* No magic-number header-height subtraction: the outer page is `min-h-screen` on
          narrow (lets it grow/scroll normally) but a genuinely fixed `lg:h-screen` at the wide
          breakpoint, so this row's plain `flex-1` fills exactly "viewport minus whatever the
          header and footer actually render at" — no guess about the header's height needed, and
          nothing to silently desync if the header's content ever changes. `lg:min-h-0` overrides
          the flex default (min-height:auto, "never shrink below content"): without it, the
          panel's content (e.g. every semantic row expanded) would force this row taller than the
          fixed outer container, reintroducing page-level scroll — with it, the panel's own
          `overflow-y-auto` scrolls internally instead. Both pieces (lg:h-screen on the outer
          container + lg:min-h-0 here) are required together. */}
      <div className="flex flex-1 flex-col gap-3.5 lg:min-h-0 lg:flex-row lg:gap-4.5">
        {/* autoFocus only true once the user has actually toggled at least once — the very
            first mount (initial page load) must never steal focus from the page. Rail and
            panel are conditionally mounted, not just hidden, so swapping between them
            otherwise silently drops keyboard focus to <body> (nothing else moves focus into
            whichever one just mounted). */}
        {showRail && (
          <GeneratorRail palette={palette} onOpen={togglePanel} autoFocus={panelOpenTouchedRef.current} />
        )}

        {showPanel && (
          <div className="order-1 w-full flex-none overflow-visible rounded-card bg-white shadow-card lg:w-101 lg:min-h-0 lg:overflow-x-hidden lg:overflow-y-auto">
            <GeneratorPanel
              gen={gen}
              source={source}
              palette={palette}
              wide={wide}
              showStrip={showStrip}
              panelOpen={panelOpen}
              onTogglePanel={togglePanel}
              autoFocus={panelOpenTouchedRef.current}
            />
          </div>
        )}

        <div className="relative order-2 h-[min(72dvh,620px)] flex-none overflow-hidden rounded-card bg-white shadow-card lg:h-auto lg:min-h-105 lg:flex-1">
          <PreviewPane
            palette={palette}
            mode={previewMode}
            radius={previewRadius}
            tab={previewTab}
            onTab={setPreviewTab}
          />
          <CodeDrawer
            open={codeOpen}
            format={format}
            palette={palette}
            onClose={closeCode}
            triggerRef={codeButtonRef}
          />
        </div>
      </div>

      <div className="flex flex-none items-center px-2.5 py-2.5 text-[11.5px] font-medium text-muted lg:px-1">
        <p className="ml-auto">
          Built by{" "}
          <a
            href="https://www.stefaniabarabas.com/"
            target="_blank"
            className="hover:text-ink hover:underline"
          >
            Stefania Barabas
          </a>
        </p>
      </div>

      <ResetConfirmModal
        open={gen.resetConfirmOpen}
        themeLabel={gen.resetLabel}
        onConfirm={gen.confirmReset}
        onCancel={gen.cancelReset}
      />

      <UndoToast
        open={gen.canUndo}
        themeLabel={DEFAULT_THEME}
        onUndo={gen.undoReset}
        onDismiss={gen.dismissUndo}
      />
      <Analytics />
    </div>
  );
}
