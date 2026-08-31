import { hslToHex, readableTextColor } from "../lib/color";
import { COLOR_ROLES, type ColorRole, type HSL } from "../lib/types";

interface AiProposedSwatchesProps {
  colors: Record<ColorRole, HSL>;
}

export default function AiProposedSwatches({ colors }: AiProposedSwatchesProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">AI-proposed base colors</h3>
      <p className="mb-3 text-xs text-slate-400">
        The exact colors the AI chose, before they're expanded into the 50–950 shade scale below.
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {COLOR_ROLES.map((role) => {
          const hex = hslToHex(colors[role]);
          const textColor = readableTextColor(hex);
          return (
            <div
              key={role}
              className="flex h-20 flex-col justify-between rounded-md p-2.5"
              style={{ backgroundColor: hex, color: textColor }}
            >
              <span className="text-xs font-medium capitalize opacity-80">{role}</span>
              <span className="font-mono text-xs">{hex}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
