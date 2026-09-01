import { useState } from "react";
import { SHADE_STEPS, type ColorRole, type Palette } from "../lib/types";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import ColorSwatch from "./ColorSwatch";

const CORE_ROLES: ColorRole[] = ["primary", "secondary", "accent", "neutral"];
const SEMANTIC_ROLES: ColorRole[] = ["success", "warning", "error", "info"];

interface PaletteRowsProps {
  palette: Palette;
}

function RoleRow({
  role,
  palette,
  size,
  copiedKey,
  onCopy,
}: {
  role: ColorRole;
  palette: Palette;
  size: "row" | "short";
  copiedKey: string | null;
  onCopy: (hex: string, key: string) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline gap-2">
        <span className="text-xs font-semibold capitalize text-ink">{role}</span>
        <span className="font-mono text-[11px] text-muted">{palette[role][500]}</span>
      </div>
      <div className="flex gap-0.5">
        {SHADE_STEPS.map((step) => {
          const hex = palette[role][step];
          const key = `${role}-${step}`;
          return (
            <ColorSwatch
              key={key}
              hex={hex}
              label={String(step)}
              size={size}
              copied={copiedKey === key}
              onCopy={() => onCopy(hex, key)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function PaletteRows({ palette }: PaletteRowsProps) {
  const { copiedKey, copy } = useCopyToClipboard();
  const [semanticsOpen, setSemanticsOpen] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4.5 pb-4.5 pt-3.5">
      {CORE_ROLES.map((role) => (
        <RoleRow key={role} role={role} palette={palette} size="row" copiedKey={copiedKey} onCopy={copy} />
      ))}

      <button
        type="button"
        onClick={() => setSemanticsOpen((v) => !v)}
        className="self-start rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-semibold text-muted hover:text-ink"
      >
        {semanticsOpen ? "Hide semantic colors" : "Show semantic colors (success, warning, error, info)"}
      </button>

      {semanticsOpen && (
        <div className="flex flex-col gap-3">
          {SEMANTIC_ROLES.map((role) => (
            <RoleRow key={role} role={role} palette={palette} size="short" copiedKey={copiedKey} onCopy={copy} />
          ))}
        </div>
      )}
    </div>
  );
}
