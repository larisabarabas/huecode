import type { RefObject } from "react";
import { Code, Moon, Square, Squircle, Sun } from "lucide-react";
import logo from "../assets/logo.png";
import { HOME_URL } from "../lib/siteConfig";
import { EXPORT_FORMATS, type ExportFormatId } from "../lib/exportFormats";
import type { PreviewMode } from "../lib/previewTheme";
import SegmentedControl from "./ui/SegmentedControl";
import Switch from "./ui/Switch";

/** Short chip labels — EXPORT_FORMATS.label is the longer form used elsewhere (e.g. a select). */
const FORMAT_CHIPS: { value: ExportFormatId; label: string }[] = [
  { value: "tailwind-v4", label: "Tailwind v4" },
  { value: "tailwind-v3", label: "Tailwind v3" },
  { value: "css-vars", label: "CSS vars" },
  { value: "ts-tokens", label: "TS tokens" },
];

const RADIUS_OPTIONS: { value: "soft" | "sharp"; label: string; icon: typeof Square }[] = [
  { value: "soft", label: "Soft corners", icon: Squircle },
  { value: "sharp", label: "Sharp corners", icon: Square },
];

interface AppHeaderProps {
  previewMode: PreviewMode;
  onPreviewMode: (mode: PreviewMode) => void;
  previewRadius: "soft" | "sharp";
  onPreviewRadius: (radius: "soft" | "sharp") => void;
  format: ExportFormatId;
  onFormat: (format: ExportFormatId) => void;
  codeOpen: boolean;
  onToggleCode: () => void;
  /** CodeDrawer returns focus here on close — see the comment in App.tsx. */
  codeButtonRef: RefObject<HTMLButtonElement | null>;
}

export default function AppHeader({
  previewMode,
  onPreviewMode,
  previewRadius,
  onPreviewRadius,
  format,
  onFormat,
  codeOpen,
  onToggleCode,
  codeButtonRef,
}: AppHeaderProps) {
  const fileName = EXPORT_FORMATS.find((f) => f.id === format)?.filename ?? "theme.css";

  return (
    <div className="flex flex-wrap items-center gap-3 px-1.5 pb-4">
      <a
        href={HOME_URL}
        className="flex items-center gap-3 rounded-md"
        aria-label="Huecode home"
      >
        <img src={logo} alt="" className="h-7 w-7 flex-none rounded-[7px]" />
        <span className="text-[17px] font-semibold tracking-tight text-ink">Huecode</span>
      </a>
      <span className="hidden text-[12.5px] font-medium text-muted xl:inline">
        Text or an image to a full TailwindCSS palette with live preview
      </span>

      <SegmentedControl
        label="Export format"
        role="radiogroup"
        options={FORMAT_CHIPS}
        value={format}
        onChange={onFormat}
        size="sm"
        className="order-3 w-full lg:order-none lg:w-auto lg:ml-auto"
      />

      <div className="order-4 flex flex-1 items-center gap-2 min-[700px]:order-2 min-[700px]:ml-auto min-[700px]:flex-none lg:order-none lg:ml-0">
        <button
          ref={codeButtonRef}
          type="button"
          onClick={onToggleCode}
          aria-expanded={codeOpen}
          aria-controls="code-drawer"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-control border border-line bg-white px-2.5 py-2 text-muted-3 shadow-[0_1px_2px_rgba(23,22,31,0.05)] transition-colors hover:bg-panel-inset hover:text-ink min-[700px]:flex-none"
        >
          <Code size={14} aria-hidden="true" />
          <span className="font-mono text-[11px] font-medium">{fileName}</span>
        </button>

        <div role="radiogroup" aria-label="Preview corner radius" className="inline-flex flex-none gap-0.5 rounded-control bg-track p-0.5">
          {RADIUS_OPTIONS.map(({ value, label, icon: Icon }) => {
            const selected = previewRadius === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={label}
                title={label}
                onClick={() => onPreviewRadius(value)}
                className={`flex h-7 w-7 items-center justify-center rounded-control-sm border transition-colors ${
                  selected
                    ? "border-[rgba(23,22,31,0.06)] bg-selected text-selected-fg shadow-selected"
                    : "border-transparent text-muted-2 hover:text-ink"
                }`}
              >
                <Icon size={14} aria-hidden="true" />
              </button>
            );
          })}
        </div>

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
