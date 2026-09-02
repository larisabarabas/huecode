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
    <div className="flex flex-wrap items-center gap-2 px-3.5 pb-3 pt-3.5 lg:justify-between">
      <div className="flex min-w-0 items-center gap-2 lg:gap-2.5">
        <img src={logo} alt="Huecode" className="h-7 w-7 rounded-md lg:h-9 lg:w-9" />
        <div className="flex flex-col gap-px">
          <span className="text-xl font-semibold tracking-tight text-ink lg:text-[26px]">Huecode</span>
        </div>
        <span className="ml-1 hidden h-5 w-px bg-line lg:block" />
        <span className="hidden text-xs font-medium text-muted lg:inline">Text or an image to a full TailwindCSS palette with live preview</span>
      </div>

      <div className="flex min-w-0 items-center gap-2">
        <div className="flex min-w-0 gap-0.5 overflow-x-auto rounded-[9px] bg-chrome p-0.5">
          {PREVIEW_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onPreviewTab(t.id)}
              className={`shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition-colors lg:py-1.5 ${
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
          className="shrink-0 rounded-lg bg-chrome px-3 py-2 text-xs font-medium text-muted hover:text-ink"
        >
          {dark ? "Dark Mode" : "Light Mode"}
        </button>
      </div>
    </div>
  );
}
