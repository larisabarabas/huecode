import type { ButtonHTMLAttributes, Ref } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  ref?: Ref<HTMLButtonElement>;
}

const BASE =
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors " +
  "motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-40";

const SIZES: Record<Size, string> = {
  sm: "rounded-control-sm px-2.5 py-1.5 text-control-sm",
  md: "rounded-control px-3.5 py-2 text-control-lg",
};

const VARIANTS: Record<Variant, string> = {
  primary: "bg-coral font-bold text-white hover:brightness-95",
  secondary: "border border-line text-muted hover:text-ink",
  ghost: "text-muted hover:bg-chrome-2 hover:text-ink",
  danger: "bg-danger text-danger-fg hover:brightness-95",
};

/**
 * The one button. Focus ring comes from the global `:focus-visible` rule in
 * index.css; hover, disabled and reduced-motion are handled here. Layout
 * concerns (flex-1, min-h, self-start…) are passed through `className`.
 */
export default function Button({
  variant = "secondary",
  size = "md",
  className = "",
  ref,
  ...rest
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type="button"
      className={`${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`.trim()}
      {...rest}
    />
  );
}
