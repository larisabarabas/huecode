import { Check, X } from "lucide-react";
import { readableTextColor } from "../lib/color";

interface ColorSwatchProps {
  hex: string;
  /** Shade step, e.g. "500". */
  label?: string;
  /** Role this swatch belongs to, e.g. "primary" — used for the accessible label. */
  name?: string;
  copied: boolean;
  failed?: boolean;
  onCopy: () => void;
  /** "row" = 52px, step + short hex labels (palette rows). "short" = 38px, no labels (semantic rows). */
  size?: "row" | "short";
}

export default function ColorSwatch({
  hex,
  label,
  name,
  copied,
  failed = false,
  onCopy,
  size = "row",
}: ColorSwatchProps) {
  const textColor = readableTextColor(hex);
  const isRow = size === "row";
  const roleName = name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
  const ariaLabel = `${[roleName, label].filter(Boolean).join(" ")}, ${hex}. Activate to copy.`;

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={ariaLabel}
      className={`group relative flex min-w-0 flex-1 flex-col justify-between overflow-hidden rounded-md text-left transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-tab-blue focus-visible:ring-offset-2 focus-visible:ring-offset-shell-bg ${
        isRow ? "h-8.5 p-1.5 lg:h-13" : "h-9.5"
      } ${failed ? "ring-2 ring-red-500" : ""}`}
      style={{ backgroundColor: hex, color: textColor }}
      title={`Copy ${hex}`}
    >
      {isRow && (
        <>
          <span aria-hidden="true" className="text-[10px] font-semibold opacity-75">
            {label}
          </span>
          <span aria-hidden="true" className="hidden font-mono text-[9.5px] opacity-90 lg:block">
            {hex.replace("#", "")}
          </span>
        </>
      )}

      {(copied || failed) && (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: hex, color: textColor }}
        >
          {copied ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
        </span>
      )}
    </button>
  );
}
