import type { ColorRole, Palette, ShadeStep } from "../lib/types";

const STRIP_ROLES: ColorRole[] = ["primary", "secondary", "accent", "neutral"];
const STRIP_STEPS: ShadeStep[] = [200, 400, 600, 800, 950];

interface SwatchStripProps {
  palette: Palette;
}

/**
 * A continuous decorative ribbon of the current palette — not interactive.
 * The real, copyable swatches live in the Palette tab.
 */
export default function SwatchStrip({ palette }: SwatchStripProps) {
  return (
    <div
      aria-hidden="true"
      className="flex h-6.5 min-w-0 flex-1 overflow-hidden rounded-[6px] border border-line"
    >
      {STRIP_ROLES.flatMap((role) =>
        STRIP_STEPS.map((step) => (
          <div
            key={`${role}-${step}`}
            className="flex-1"
            style={{ backgroundColor: palette[role][step] }}
          />
        )),
      )}
    </div>
  );
}
