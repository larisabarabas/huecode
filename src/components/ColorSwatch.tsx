import { readableTextColor } from "../lib/color";

interface ColorSwatchProps {
  hex: string;
  label?: string;
  copied: boolean;
  onCopy: () => void;
  /** "row" = 52px, step + short hex labels (palette rows). "short" = 38px, no labels (semantic rows). */
  size?: "row" | "short";
}

export default function ColorSwatch({ hex, label, copied, onCopy, size = "row" }: ColorSwatchProps) {
  const textColor = readableTextColor(hex);
  const isRow = size === "row";

  return (
    <button
      type="button"
      onClick={onCopy}
      className={`group flex flex-1 flex-col justify-between overflow-hidden rounded-md text-left transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
        isRow ? "h-13 p-1.5" : "h-9.5"
      }`}
      style={{ backgroundColor: hex, color: textColor }}
      title={`Copy ${hex}`}
    >
      {isRow && (
        <>
          <span className="text-[10px] font-semibold opacity-75">{label}</span>
          <span className="font-mono text-[9.5px] opacity-90">
            {copied ? "Copied!" : hex.replace("#", "")}
          </span>
        </>
      )}
    </button>
  );
}
