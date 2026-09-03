import { useMemo, type CSSProperties } from "react";
import { paletteToCssVars, type PreviewMode } from "../lib/previewTheme";
import type { Palette } from "../lib/types";
import AppPreview from "./previews/AppPreview";
import ComponentsKitPreview from "./previews/ComponentsKitPreview";
import MarketingPreview from "./previews/MarketingPreview";

export type PreviewTab = "app" | "components" | "marketing";

interface PreviewPaneProps {
  palette: Palette;
  mode: PreviewMode;
  tab: PreviewTab;
}

export default function PreviewPane({ palette, mode, tab }: PreviewPaneProps) {
  const vars = useMemo(() => paletteToCssVars(palette, mode), [palette, mode]);

  return (
    <div className="flex min-h-[200px] flex-1 flex-col px-3.5 pt-0 lg:min-h-0">
      <div
        className="min-h-0 flex-1 overflow-hidden rounded-t-2xl border border-b-0 border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
        style={vars as CSSProperties}
      >
        <div className="h-full overflow-auto">
          {tab === "app" && <AppPreview />}
          {tab === "components" && <ComponentsKitPreview />}
          {tab === "marketing" && <MarketingPreview />}
        </div>
      </div>
    </div>
  );
}
