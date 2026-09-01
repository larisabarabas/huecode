import type { ColorRole, Palette, ShadeStep } from "../lib/types";

const STRIP_ROLES: ColorRole[] = ["primary", "secondary", "accent", "neutral"];
const STRIP_STEPS: ShadeStep[] = [200, 400, 600, 800, 950];

interface SwatchStripProps {
  palette: Palette;
}

export default function SwatchStrip({ palette }: SwatchStripProps) {
  return (
    <div className="flex min-w-0 flex-1 gap-0.5">
      {STRIP_ROLES.flatMap((role) =>
        STRIP_STEPS.map((step) => {
          const hex = palette[role][step];
          return (
            <div
              key={`${role}-${step}`}
              title={hex}
              className="h-6.5 flex-1 rounded-[5px]"
              style={{ backgroundColor: hex }}
            />
          );
        }),
      )}
    </div>
  );
}
