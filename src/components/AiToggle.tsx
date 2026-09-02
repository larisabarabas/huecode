import { useState } from "react";

interface AiToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
}

const TOOLTIP_ID = "ai-toggle-tip";

/**
 * "Enhance with AI" switch. On: the model proposes all 8 color roles for the
 * theme. Off: roles come from the built-in keyword dictionary.
 */
export default function AiToggle({ checked, onChange }: AiToggleProps) {
  const [tipOpen, setTipOpen] = useState(false);

  return (
    <div
      className="relative flex items-center gap-2 text-xs text-muted-2"
      onMouseLeave={() => setTipOpen(false)}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="group flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
      >
        <span
          className="relative inline-block h-4.5 w-8 flex-none rounded-full transition-colors"
          style={{ backgroundColor: checked ? "var(--color-coral)" : "#dad6e6" }}
        >
          <span
            className="absolute top-0.5 h-3 w-3 rounded-full bg-white transition-[left]"
            style={{ left: checked ? "16px" : "3px" }}
          />
        </span>
        <span className="font-medium">Enhance with AI</span>
      </button>

      <button
        type="button"
        aria-label="What does Enhance with AI do?"
        aria-expanded={tipOpen}
        aria-describedby={tipOpen ? TOOLTIP_ID : undefined}
        onClick={() => setTipOpen((v) => !v)}
        onMouseEnter={() => setTipOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setTipOpen(false);
        }}
        onBlur={() => setTipOpen(false)}
        className="flex h-4 w-4 items-center justify-center rounded-full border border-line text-[10px] font-bold leading-none text-muted-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
      >
        ?
      </button>

      {tipOpen && (
        <span
          id={TOOLTIP_ID}
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 w-full max-w-xs rounded-lg border border-line bg-shell-bg px-3 py-2 text-[11px] font-medium leading-relaxed text-muted shadow-lg"
        >
          <strong className="font-semibold text-ink">On:</strong> the AI proposes all 8 color roles (primary,
          secondary, accent, neutral, plus success / warning / error / info) for your theme.{" "}
          <strong className="font-semibold text-ink">Off:</strong> the roles are derived from a built-in
          keyword dictionary.
        </span>
      )}
    </div>
  );
}
