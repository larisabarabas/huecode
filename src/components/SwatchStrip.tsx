import type { ColorRole, Palette, ShadeStep } from "../lib/types";

const STRIP_ROLES: ColorRole[] = ["primary", "secondary", "accent", "neutral"];
const STRIP_STEPS: ShadeStep[] = [200, 400, 600, 800, 950];

interface SwatchStripProps {
  palette: Palette;
  orientation?: "horizontal" | "vertical";
  /** Stretch to fill the remaining space of a flex parent along its main axis (the rail's
   * vertical strip). Explicit rather than left to className cascade order — Tailwind utility
   * precedence is determined by stylesheet definition order, not className string order, so
   * two conflicting flex/height utilities can't be reliably resolved by "append it later". */
  grow?: boolean;
  /** Additional sizing (e.g. a fixed height in the panel header) — safe to combine with `grow`
   * since it only ever sets width/height, never flex-grow/flex-basis. */
  className?: string;
}

/**
 * A continuous decorative ribbon of the current palette — not interactive.
 * The real, copyable swatches live in the palette rows.
 */
export default function SwatchStrip({
  palette,
  orientation = "horizontal",
  grow = false,
  className = "",
}: SwatchStripProps) {
  const vertical = orientation === "vertical";
  return (
    <div
      aria-hidden="true"
      className={`flex overflow-hidden rounded-[10px] shadow-[0_1px_2px_rgba(23,22,31,0.08)] ${
        vertical ? "flex-col" : "flex-row"
      } ${grow ? "min-h-0 min-w-0 flex-1" : "w-full"} ${className}`.trim()}
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
