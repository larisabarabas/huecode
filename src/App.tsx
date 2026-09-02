import { useCallback, useEffect, useState } from "react";
import AppHeader from "./components/AppHeader";
import PreviewPane, { type PreviewTab } from "./components/PreviewPane";
import GeneratorSheet from "./components/GeneratorSheet";
import ResetConfirmModal from "./components/ResetConfirmModal";
import UndoToast from "./components/UndoToast";
import { DEFAULT_THEME, useGeneratorState } from "./hooks/useGeneratorState";
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
  const [sheetOpen, setSheetOpen] = useState(() => window.innerWidth >= 1024);
  const [sheetTab, setSheetTab] = useState<"palette" | "export">("palette");

  // Persist on every change so a render crash never loses the current palette.
  useEffect(() => {
    saveStoredPalette({ palette, source });
  }, [palette, source]);

  const handleGenerated = useCallback((nextPalette: Palette, nextSource: PaletteSource) => {
    setPalette(nextPalette);
    setSource(nextSource);
  }, []);

  const gen = useGeneratorState({ onGenerate: handleGenerated, current: { palette, source } });

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-shell-bg font-sans text-ink antialiased">
      <AppHeader
        previewTab={previewTab}
        onPreviewTab={setPreviewTab}
        previewMode={previewMode}
        onPreviewMode={setPreviewMode}
      />

      <PreviewPane palette={palette} mode={previewMode} tab={previewTab} />

      <GeneratorSheet
        palette={palette}
        source={source}
        gen={gen}
        open={sheetOpen}
        onToggle={() => setSheetOpen((v) => !v)}
        tab={sheetTab}
        onTab={setSheetTab}
        onExportClick={() => {
          setSheetOpen(true);
          setSheetTab("export");
        }}
      />

      <div className="flex flex-none flex-wrap items-center gap-2.5 px-2.5 py-2.5 text-[11.5px] font-medium text-muted lg:px-1">
        <span className="hidden lg:flex">Exports</span>
        <div className="hidden items-center gap-2 font-mono text-[11px] text-muted-2 lg:flex">
          <span>Tailwind v4</span>
          <span className="text-line">/</span>
          <span>Tailwind v3</span>
          <span className="text-line">/</span>
          <span>CSS variables</span>
          <span className="text-line">/</span>
          <span>TS tokens</span>
        </div>
        <p className="ml-auto">Built by <a href="https://www.stefaniabarabas.com/" target="_blank" className="hover:text-ink hover:underline">Stefania Barabas</a></p>
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
    </div>
  );
}
