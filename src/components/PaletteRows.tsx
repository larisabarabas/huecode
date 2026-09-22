import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
  failedKey,
  onCopy,
}: {
  role: ColorRole;
  palette: Palette;
  size: "row" | "short";
  copiedKey: string | null;
  failedKey: string | null;
  onCopy: (hex: string, key: string) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline gap-2">
        <span className="text-[12.5px] font-semibold capitalize text-ink">{role}</span>
        <span className="font-mono text-[11px] text-muted">{palette[role][500]}</span>
      </div>
      <div
        role="group"
        aria-label={`${role} shade scale`}
        className="flex overflow-hidden rounded-[10px] shadow-[0_1px_2px_rgba(23,22,31,0.08)]"
      >
        {SHADE_STEPS.map((step) => {
          const hex = palette[role][step];
          const key = `${role}-${step}`;
          return (
            <ColorSwatch
              key={key}
              hex={hex}
              name={role}
              label={String(step)}
              size={size}
              copied={copiedKey === key}
              failed={failedKey === key}
              onCopy={() => onCopy(hex, key)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function PaletteRows({ palette }: PaletteRowsProps) {
  const { copiedKey, copiedValue, failedKey, failedValue, copy } = useCopyToClipboard();
  const [semanticsOpen, setSemanticsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4.5">
      <div role="status" aria-live="polite" className="sr-only">
        {copiedValue
          ? `Copied ${copiedValue}`
          : failedValue
            ? `Couldn't copy ${failedValue} — select and copy it manually`
            : ""}
      </div>
      {CORE_ROLES.map((role) => (
        <RoleRow
          key={role}
          role={role}
          palette={palette}
          size="row"
          copiedKey={copiedKey}
          failedKey={failedKey}
          onCopy={copy}
        />
      ))}

      <button
        type="button"
        aria-expanded={semanticsOpen}
        aria-controls="semantic-colors-body"
        onClick={() => setSemanticsOpen((v) => !v)}
        className="flex w-full items-center gap-2 border-0 border-b border-line px-0.5 py-2.5 text-left transition-colors hover:bg-panel-inset"
      >
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`flex-none text-muted transition-transform motion-reduce:transition-none ${semanticsOpen ? "rotate-180" : ""}`}
        />
        <span className="text-[12.5px] font-semibold text-ink">Semantic colors</span>
        <span className="ml-auto font-mono text-[10.5px] text-muted">success · warning · error · info</span>
      </button>

      {semanticsOpen && (
        <div id="semantic-colors-body" className="flex flex-col gap-4.5">
          {SEMANTIC_ROLES.map((role) => (
            <RoleRow
              key={role}
              role={role}
              palette={palette}
              size="short"
              copiedKey={copiedKey}
              failedKey={failedKey}
              onCopy={copy}
            />
          ))}
        </div>
      )}
    </div>
  );
}
