import type { ColorRole, Palette, ShadeStep } from "../lib/types";

const STRIP_ROLES: ColorRole[] = ["primary", "secondary", "accent", "neutral"];
const STRIP_STEPS: ShadeStep[] = [200, 400, 600, 800, 950];

interface SwatchStripProps {
  palette: Palette;
}

export default function SwatchStrip({ palette }: SwatchStripProps) {
  return (
    <div className="order-2 flex min-w-0 flex-1 basis-full gap-0.5 lg:order-none lg:basis-auto">
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
