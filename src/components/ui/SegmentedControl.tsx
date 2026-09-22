import { useRef, type KeyboardEvent } from "react";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  /** Accessible name for the group (e.g. "Preview surface"). */
  label: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  /** Let the segments wrap instead of scroll (used by the export formats). */
  wrap?: boolean;
  /** "tablist" (default) for view-switching groups; "radiogroup" for the header format
   * chips, which pick a setting rather than switch what's on screen. */
  role?: "tablist" | "radiogroup";
  className?: string;
}

const SIZES = {
  sm: "px-2.5 py-1.5 text-control-sm",
  md: "px-3 py-1.5 text-control",
} as const;

/**
 * One "pick one of N" control for every segmented group in the app. Renders a
 * tablist with a roving tabindex and Left/Right/Home/End navigation; the
 * selected segment uses the shared `selected` treatment. Focus ring is the
 * global one from index.css.
 */
export default function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  size = "md",
  wrap = false,
  role = "tablist",
  className = "",
}: SegmentedControlProps<T>) {
  const itemRole = role === "radiogroup" ? "radio" : "tab";
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function move(to: number) {
    const clamped = (to + options.length) % options.length;
    onChange(options[clamped].value);
    refs.current[clamped]?.focus();
  }

  function onKeyDown(e: KeyboardEvent) {
    const current = options.findIndex((o) => o.value === value);
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        move(current + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        move(current - 1);
        break;
      case "Home":
        e.preventDefault();
        move(0);
        break;
      case "End":
        e.preventDefault();
        move(options.length - 1);
        break;
    }
  }

  return (
    <div
      role={role}
      aria-label={label}
      onKeyDown={onKeyDown}
      // `overflow-x-auto` makes this a scroll container, which per spec also computes
      // overflow-y as `auto` — that strips the browser's default content-based min-height
      // protection, so a squeezed flex-column ancestor can crush this down to near-0
      // instead of just scrolling. `shrink-0` keeps it at its natural size no matter what.
      className={`inline-flex shrink-0 gap-0.5 rounded-control bg-track p-0.5 ${wrap ? "flex-wrap" : "overflow-x-auto"} ${className}`.trim()}
    >
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role={itemRole}
            aria-selected={role === "tablist" ? selected : undefined}
            aria-checked={role === "radiogroup" ? selected : undefined}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(opt.value)}
            className={`shrink-0 whitespace-nowrap rounded-control-sm border font-semibold transition-colors motion-reduce:transition-none ${SIZES[size]} ${
              selected
                ? "border-[rgba(23,22,31,0.06)] bg-selected text-selected-fg shadow-selected"
                : "border-transparent text-muted-2 hover:text-ink"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
