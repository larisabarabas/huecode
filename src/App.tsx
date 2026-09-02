import { useState } from "react";
import AppHeader from "./components/AppHeader";
import PreviewPane, { type PreviewTab } from "./components/PreviewPane";
import GeneratorSheet from "./components/GeneratorSheet";
import { DEFAULT_THEME, useGeneratorState } from "./hooks/useGeneratorState";
import { paletteFromThemeText } from "./lib/textToPalette";
import type { PreviewMode } from "./lib/previewTheme";
import type { Palette, PaletteSource } from "./lib/types";

export default function App() {
  const [palette, setPalette] = useState<Palette>(() => paletteFromThemeText(DEFAULT_THEME));
  const [source, setSource] = useState<PaletteSource>({ kind: "text", label: DEFAULT_THEME });
  const [previewTab, setPreviewTab] = useState<PreviewTab>("app");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("light");
  const [sheetOpen, setSheetOpen] = useState(true);
  const [sheetTab, setSheetTab] = useState<"palette" | "export">("palette");

  const gen = useGeneratorState({
    onGenerate: (nextPalette, nextSource) => {
      setPalette(nextPalette);
      setSource(nextSource);
    },
  });

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-shell-bg font-sans text-ink antialiased">
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

      <div className="flex flex-none items-center gap-2.5 px-1 py-2.5 text-[11.5px] font-medium text-muted">
        <span>Exports</span>
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-2">
          <span>Tailwind v4</span>
          <span className="text-line">/</span>
          <span>Tailwind v3</span>
          <span className="text-line">/</span>
          <span>CSS variables</span>
          <span className="text-line">/</span>
          <span>TS tokens</span>
        </div>
        <p className="ml-auto hover:text-ink hover:underline">Built by <a href="https://www.stefaniabarabas.com/" target="_blank">Stefania Barabas</a></p>
      </div>
    </div>
  );
}
