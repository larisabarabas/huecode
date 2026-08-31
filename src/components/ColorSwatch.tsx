import { readableTextColor } from "../lib/color";

interface ColorSwatchProps {
  hex: string;
  label: string;
  copied: boolean;
  onCopy: () => void;
}

export default function ColorSwatch({ hex, label, copied, onCopy }: ColorSwatchProps) {
  const textColor = readableTextColor(hex);

  return (
    <button
      type="button"
      onClick={onCopy}
      className="group flex h-16 flex-1 flex-col justify-between rounded-md p-2 text-left transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      style={{ backgroundColor: hex, color: textColor }}
      title={`Copy ${hex}`}
    >
      <span className="text-[11px] font-medium opacity-80">{label}</span>
      <span className="font-mono text-xs">
        {copied ? "Copied!" : hex}
      </span>
    </button>
  );
}
