import { Moon, Sun } from "lucide-react";
import logo from "../assets/logo.png";
import type { PreviewMode } from "../lib/previewTheme";
import type { PreviewTab } from "./PreviewPane";
import SegmentedControl from "./ui/SegmentedControl";
import Switch from "./ui/Switch";

const PREVIEW_TABS: { value: PreviewTab; label: string }[] = [
  { value: "app", label: "App" },
  { value: "components", label: "Components" },
  { value: "marketing", label: "Marketing" },
];

interface AppHeaderProps {
  previewTab: PreviewTab;
  onPreviewTab: (tab: PreviewTab) => void;
  previewMode: PreviewMode;
  onPreviewMode: (mode: PreviewMode) => void;
}

export default function AppHeader({ previewTab, onPreviewTab, previewMode, onPreviewMode }: AppHeaderProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-3.5 pb-3 pt-3.5 lg:justify-between">
      <div className="flex min-w-0 items-center gap-2 lg:gap-2.5">
        <img src={logo} alt="Huecode" className="h-7 w-7 rounded-md lg:h-9 lg:w-9" />
        <div className="flex flex-col gap-px">
          <span className="text-xl font-semibold tracking-tight text-ink lg:text-[26px]">Huecode</span>
        </div>
        <span className="ml-1 hidden h-5 w-px bg-line lg:block" />
        <span className="hidden text-xs font-medium text-muted lg:inline">
          Text or an image to a full TailwindCSS palette with live preview
        </span>
      </div>

      <div className="flex min-w-0 items-center gap-2">
        <SegmentedControl
          label="Preview surface"
          options={PREVIEW_TABS}
          value={previewTab}
          onChange={onPreviewTab}
          className="min-w-0"
        />
        <Switch
          label="Dark mode"
          size="md"
          knobIconOff={<Sun size={11} strokeWidth={2.25} aria-hidden="true" />}
          knobIconOn={<Moon size={11} strokeWidth={2.25} aria-hidden="true" />}
          checked={previewMode === "dark"}
          onChange={(dark) => onPreviewMode(dark ? "dark" : "light")}
          className="flex-none"
        />
      </div>
    </div>
  );
}
