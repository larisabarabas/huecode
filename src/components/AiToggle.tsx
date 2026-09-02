import { useState } from "react";
import { CircleHelp } from "lucide-react";
import IconButton from "./ui/IconButton";
import Switch from "./ui/Switch";

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
      <Switch label="Enhance with AI" showLabel checked={checked} onChange={onChange} />


      <IconButton
        label="What does Enhance with AI do?"
        aria-expanded={tipOpen}
        aria-describedby={tipOpen ? TOOLTIP_ID : undefined}
        onClick={() => setTipOpen((v) => !v)}
        onMouseEnter={() => setTipOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setTipOpen(false);
        }}
        onBlur={() => setTipOpen(false)}
      >
        <CircleHelp size={14} aria-hidden="true" />
      </IconButton>

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
