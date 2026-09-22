import { Check, X } from "lucide-react";
import { readableTextColor } from "../lib/color";

interface ColorSwatchProps {
  hex: string;
  /** Shade step, e.g. "500" — used for the accessible label only (v15 dropped the visible
   * per-swatch step/hex text; the row header above the strip already shows the base hex,
   * and the hover title + accessible name still carry the exact value). */
  label?: string;
  /** Role this swatch belongs to, e.g. "primary" — used for the accessible label. */
  name?: string;
  copied: boolean;
  failed?: boolean;
  onCopy: () => void;
  /** "row" = 40px (core rows). "short" = 34px (semantic rows). Neither shows visible text. */
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
  const roleName = name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
  const namedLabel = [roleName, label].filter(Boolean).join(" ");
  const ariaLabel = `${namedLabel}, ${hex}. Activate to copy.`;
  // Sighted mouse users only get this tooltip (no visible per-swatch text, see the note
  // above) — it needs the step/role too, not just the hex, or there's no way to tell which
  // swatch in the row you're looking at without counting position.
  const tooltip = namedLabel ? `${namedLabel} — Copy ${hex}` : `Copy ${hex}`;

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={ariaLabel}
      className={`group relative flex min-w-0 flex-1 flex-col justify-center overflow-hidden text-left transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-tab-blue focus-visible:ring-offset-2 focus-visible:ring-offset-shell-bg ${
        size === "row" ? "h-10" : "h-8.5"
      } ${failed ? "ring-2 ring-red-500" : ""}`}
      style={{ backgroundColor: hex, color: textColor }}
      title={tooltip}
    >
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
