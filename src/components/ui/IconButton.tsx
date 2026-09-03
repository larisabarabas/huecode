import type { ButtonHTMLAttributes, ReactNode } from "react";

type Size = "sm" | "md";
type Variant = "outline" | "bare";

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
  /** Required accessible name — an icon button has no visible text. */
  label: string;
  size?: Size;
  variant?: Variant;
  children: ReactNode;
}

const SIZES: Record<Size, string> = {
  sm: "h-6 w-6 text-[11px]", // 24px — the minimum comfortable target
  md: "h-9 w-9 text-[13px]", // 36px
};

const VARIANTS: Record<Variant, string> = {
  outline: "border border-line bg-shell-bg text-muted hover:text-ink",
  // No colour of its own — the caller sets it (e.g. a button on a dark surface).
  bare: "",
};

/**
 * The one icon button. Circular, one hit-area scale, accessible name required.
 * Focus ring is the global `:focus-visible` rule.
 */
export default function IconButton({
  label,
  size = "sm",
  variant = "outline",
  className = "",
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex flex-none items-center justify-center rounded-full font-bold leading-none transition-colors motion-reduce:transition-none ${SIZES[size]} ${VARIANTS[variant]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
