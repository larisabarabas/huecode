import { useMemo, type CSSProperties } from "react";
import { paletteToCssVars, type PreviewMode } from "../lib/previewTheme";
import type { Palette } from "../lib/types";
import AppPreview from "./previews/AppPreview";
import ComponentsKitPreview from "./previews/ComponentsKitPreview";
import MarketingPreview from "./previews/MarketingPreview";
import SegmentedControl from "./ui/SegmentedControl";

export type PreviewTab = "app" | "components" | "marketing";

const PREVIEW_TABS: { value: PreviewTab; label: string }[] = [
  { value: "app", label: "App" },
  { value: "components", label: "Components" },
  { value: "marketing", label: "Marketing" },
];

interface PreviewPaneProps {
  palette: Palette;
  mode: PreviewMode;
  radius: "soft" | "sharp";
  tab: PreviewTab;
  onTab: (tab: PreviewTab) => void;
}

export default function PreviewPane({ palette, mode, radius, tab, onTab }: PreviewPaneProps) {
  const vars = useMemo(() => paletteToCssVars(palette, mode), [palette, mode]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none items-center gap-2.5 border-b border-line px-4 py-3">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
          Live preview
        </span>
        <SegmentedControl
          label="Preview surface"
          options={PREVIEW_TABS}
          value={tab}
          onChange={onTab}
          size="sm"
          className="ml-auto"
        />
      </div>
      <div
        data-mode={mode}
        data-radius={radius}
        className="min-h-0 flex-1 overflow-auto bg-[var(--bg)] text-[var(--text)]"
        style={vars as CSSProperties}
      >
        {tab === "app" && <AppPreview />}
        {tab === "components" && <ComponentsKitPreview />}
        {tab === "marketing" && <MarketingPreview />}
      </div>
    </div>
  );
}
