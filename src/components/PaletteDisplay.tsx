import { COLOR_ROLES, SHADE_STEPS, type Palette } from "../lib/types";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import ColorSwatch from "./ColorSwatch";

interface PaletteDisplayProps {
  palette: Palette;
}

export default function PaletteDisplay({ palette }: PaletteDisplayProps) {
  const { copiedKey, copy } = useCopyToClipboard();

  return (
    <div className="flex flex-col gap-4">
      {COLOR_ROLES.map((role) => (
        <div key={role}>
          <h3 className="mb-1.5 text-sm font-semibold capitalize text-slate-700">{role}</h3>
          <div className="flex gap-1">
            {SHADE_STEPS.map((step) => {
              const hex = palette[role][step];
              const key = `${role}-${step}`;
              return (
                <ColorSwatch
                  key={key}
                  hex={hex}
                  label={String(step)}
                  copied={copiedKey === key}
                  onCopy={() => copy(hex, key)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
