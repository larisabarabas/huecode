import type { ReactNode } from "react";

type Size = "sm" | "md";

interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Accessible name. Shown as visible text when `showLabel` is set. */
  label: string;
  showLabel?: boolean;
  size?: Size;
  /** id of an element that describes this switch (read after the name and state). */
  describedBy?: string;
  /** Unavailable: stays focusable and announced as disabled, but ignores clicks. */
  disabled?: boolean;
  /** Optional glyphs rendered inside the sliding knob (e.g. sun / moon). */
  knobIconOn?: ReactNode;
  knobIconOff?: ReactNode;
  className?: string;
}

const SIZES: Record<Size, { track: string; knob: string; on: string; off: string }> = {
  sm: { track: "h-4.5 w-8", knob: "h-3 w-3", on: "16px", off: "3px" },
  md: { track: "h-5 w-9", knob: "h-4 w-4", on: "18px", off: "2px" },
};

/**
 * The one on/off switch (feature toggles, theme toggle). For "pick one of N"
 * use SegmentedControl instead. Focus ring is the global `:focus-visible` rule.
 */
export default function Switch({
  checked,
  onChange,
  label,
  showLabel = false,
  size = "sm",
  describedBy,
  disabled = false,
  knobIconOn,
  knobIconOff,
  className = "",
}: SwitchProps) {
  const s = SIZES[size];
  const hasIcons = knobIconOn != null || knobIconOff != null;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={showLabel ? undefined : label}
      aria-describedby={describedBy}
      aria-disabled={disabled || undefined}
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
      className={`inline-flex items-center gap-2 text-xs font-medium text-muted-2 ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      } ${className}`.trim()}
    >
      <span
        className={`relative inline-block flex-none rounded-full transition-colors motion-reduce:transition-none ${s.track}`}
        style={{ backgroundColor: checked ? "var(--color-chip-purple)" : "#dad6e6" }}
      >
        <span
          className={`absolute top-0.5 flex items-center justify-center rounded-full bg-white text-muted transition-[left] motion-reduce:transition-none ${s.knob}`}
          style={{ left: checked ? s.on : s.off }}
        >
          {hasIcons && (checked ? knobIconOn : knobIconOff)}
        </span>
      </span>
      {showLabel && <span>{label}</span>}
    </button>
  );
}
