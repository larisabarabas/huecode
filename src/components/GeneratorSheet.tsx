import { ChevronDown } from "lucide-react";
import type { useGeneratorState } from "../hooks/useGeneratorState";
import type { Palette, PaletteSource } from "../lib/types";
import SwatchStrip from "./SwatchStrip";
import GeneratorPanel from "./GeneratorPanel";
import PaletteRows from "./PaletteRows";
import ExportPanel from "./ExportPanel";
import Button from "./ui/Button";
import SegmentedControl from "./ui/SegmentedControl";

type SheetTab = "palette" | "export";

const SHEET_TABS: { value: SheetTab; label: string }[] = [
  { value: "palette", label: "Palette" },
  { value: "export", label: "Export" },
];

interface GeneratorSheetProps {
  palette: Palette;
  source: PaletteSource;
  gen: ReturnType<typeof useGeneratorState>;
  open: boolean;
  onToggle: () => void;
  tab: SheetTab;
  onTab: (tab: SheetTab) => void;
}

export default function GeneratorSheet({
  palette,
  source,
  gen,
  open,
  onToggle,
  tab,
  onTab,
}: GeneratorSheetProps) {
  const themeLabel = `"${source.label}"`;

  return (
    <div className="flex-none border-t border-line bg-shell-bg">
      <div className="flex flex-wrap items-center gap-3.5 px-2.5 py-2.5 lg:px-4.5">
        <Button
          variant="secondary"
          size="sm"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls="generator-sheet-body"
          className="text-ink"
        >
          <ChevronDown
            size={13}
            aria-hidden="true"
            className={`transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          />
          Generator
        </Button>
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex-none text-[11.5px] font-medium text-muted">from</span>
          <span className="truncate text-[12.5px] font-semibold text-ink">{themeLabel}</span>
        </div>
        <SwatchStrip palette={palette} />
      </div>

      {open && (
        <div
          id="generator-sheet-body"
          className="flex max-h-[45dvh] flex-col overflow-y-auto border-t border-line lg:h-94 lg:max-h-none lg:flex-row lg:overflow-hidden"
        >
          <div className="box-border min-h-0 w-full flex-none border-b border-line lg:h-full lg:w-85 lg:border-b-0 lg:border-r">
            <GeneratorPanel gen={gen} source={source} />
          </div>

          <div className="flex min-w-0 flex-none flex-col lg:min-h-0 lg:flex-1">
            <div className="px-4.5 pt-3">
              <SegmentedControl label="Sheet view" options={SHEET_TABS} value={tab} onChange={onTab} />
            </div>

            {tab === "palette" ? <PaletteRows palette={palette} /> : <ExportPanel palette={palette} />}
          </div>
        </div>
      )}
    </div>
  );
}
