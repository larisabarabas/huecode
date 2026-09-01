import logo from "../assets/logo.png";
import type { PreviewMode } from "../lib/previewTheme";
import type { PreviewTab } from "./PreviewPane";

const PREVIEW_TABS: { id: PreviewTab; label: string }[] = [
  { id: "app", label: "App" },
  { id: "components", label: "Components" },
  { id: "marketing", label: "Marketing" },
];

interface AppHeaderProps {
  previewTab: PreviewTab;
  onPreviewTab: (tab: PreviewTab) => void;
  previewMode: PreviewMode;
  onPreviewMode: (mode: PreviewMode) => void;
}

export default function AppHeader({ previewTab, onPreviewTab, previewMode, onPreviewMode }: AppHeaderProps) {
  const dark = previewMode === "dark";

  return (
    <div className="flex items-center justify-between px-3.5 pb-3 pt-3.5">
      <div className="flex items-center gap-2.5">
        <img src={logo} alt="Huecode" className="h-9 w-9 rounded-md" />
        <div className="flex flex-col gap-px">
          <span className="text-[26px] font-semibold tracking-tight text-ink">Huecode</span>
        </div>
        <span className="ml-1 h-5 w-px bg-line" />
        <span className="text-xs font-medium text-muted">Text or an image to a full Tailwind palette with live preview</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-0.5 rounded-[9px] bg-chrome p-0.5">
          {PREVIEW_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onPreviewTab(t.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                previewTab === t.id ? "bg-tab-blue text-shell-bg" : "text-muted-2"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onPreviewMode(dark ? "light" : "dark")}
          className="rounded-lg bg-chrome px-3 py-2 text-xs font-medium text-muted hover:text-ink"
        >
          {dark ? "Dark" : "Light"}
        </button>
      </div>
    </div>
  );
}
