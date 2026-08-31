import { useState } from "react";
import ThemeInput from "./components/ThemeInput";
import PaletteDisplay from "./components/PaletteDisplay";
import ExportPanel from "./components/ExportPanel";
import AiProposedSwatches from "./components/AiProposedSwatches";
import type { Palette, PaletteSource } from "./lib/types";

export default function App() {
  const [palette, setPalette] = useState<Palette | null>(null);
  const [source, setSource] = useState<PaletteSource | null>(null);

  function handleGenerate(nextPalette: Palette, nextSource: PaletteSource) {
    setPalette(nextPalette);
    setSource(nextSource);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
        <header>
          <h1 className="text-2xl font-bold text-slate-900">Text or image to TailwindCSS Color Palette</h1>
          <p className="mt-1 text-sm text-slate-500">
            Turn a written theme or an image into a color palette, ready to drop into Tailwind or React.
          </p>
        </header>

        <ThemeInput
          onGenerate={handleGenerate}
          onClear={() => {
            setPalette(null);
            setSource(null);
          }}
        />

        {palette && (
          <>
            {source?.proposedColors && <AiProposedSwatches colors={source.proposedColors} />}

            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <h2 className="text-sm font-semibold text-slate-700">Palette</h2>
                {source && (
                  <span className="text-xs text-slate-400">
                    from {source.kind === "text" ? `"${source.label}"` : source.label}
                  </span>
                )}
              </div>
              {source?.note && (
                <p className="mb-3 rounded-md bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
                  {source.note}
                </p>
              )}
              <PaletteDisplay palette={palette} />
            </div>

            <div>
              <h2 className="mb-2 text-sm font-semibold text-slate-700">Export</h2>
              <ExportPanel palette={palette} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
