import type { useGeneratorState } from "../hooks/useGeneratorState";
import type { Palette, PaletteSource } from "../lib/types";
import SwatchStrip from "./SwatchStrip";
import GeneratorPanel from "./GeneratorPanel";
import PaletteRows from "./PaletteRows";
import ExportPanel from "./ExportPanel";

interface GeneratorSheetProps {
  palette: Palette;
  source: PaletteSource;
  gen: ReturnType<typeof useGeneratorState>;
  open: boolean;
  onToggle: () => void;
  tab: "palette" | "export";
  onTab: (tab: "palette" | "export") => void;
  onExportClick: () => void;
}

export default function GeneratorSheet({
  palette,
  source,
  gen,
  open,
  onToggle,
  tab,
  onTab,
  onExportClick,
}: GeneratorSheetProps) {
  const themeLabel = gen.text.trim() ? `"${gen.text.trim()}"` : source ? `"${source.label}"` : "no theme yet";

  return (
    <div className="flex-none border-t border-line bg-shell-bg">
      <div className="flex items-center gap-3.5 px-4.5 py-2.5">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2 rounded-[9px] bg-chrome-2 px-3 py-2 text-[12.5px] font-semibold text-ink"
        >
          <span
            className={`inline-block text-[11px] text-muted-2 transition-transform ${open ? "rotate-180" : ""}`}
          >
            ▲
          </span>
          Generator
        </button>
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex-none text-[11.5px] font-medium text-muted">from</span>
          <span className="truncate text-[12.5px] font-semibold text-ink">{themeLabel}</span>
        </div>
        <SwatchStrip palette={palette} />
        <button
          type="button"
          onClick={onExportClick}
          className="flex-none rounded-[9px] bg-tab-blue px-3.5 py-2 text-[12.5px] font-semibold text-shell-bg"
        >
          Export
        </button>
      </div>

      {open && (
        <div className="flex h-94 max-h-[60vh] flex-col overflow-hidden border-t border-line lg:h-94 lg:max-h-none lg:flex-row">
          <div className="min-h-0 w-full flex-none border-b border-line lg:h-full lg:w-85 lg:border-b-0 lg:border-r">
            <GeneratorPanel gen={gen} source={source} />
          </div>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex gap-0.5 px-4.5 pt-3">
              <button
                type="button"
                onClick={() => onTab("palette")}
                className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                  tab === "palette" ? "bg-chrome-2 text-ink" : "text-muted-2"
                }`}
              >
                Palette
              </button>
              <button
                type="button"
                onClick={() => onTab("export")}
                className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                  tab === "export" ? "bg-chrome-2 text-ink" : "text-muted-2"
                }`}
              >
                Export
              </button>
            </div>

            {tab === "palette" ? <PaletteRows palette={palette} /> : <ExportPanel palette={palette} />}
          </div>
        </div>
      )}
    </div>
  );
}
