import { useState } from "react";
import { CircleHelp } from "lucide-react";
import IconButton from "./ui/IconButton";
import Switch from "./ui/Switch";

interface AiToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** True when an AiNote (provider and/or demo caption) is rendered alongside, so the switch announces it. */
  hasNote?: boolean;
  /** Provider is out of credit/quota: switch is disabled and described by the paused note. */
  paused?: boolean;
}

const TOOLTIP_ID = "ai-toggle-tip";
export const NOTE_ID = "ai-note";
export const PAUSED_NOTE_ID = "ai-paused-note";

/** Display names for the provider ids the server reports; an unknown id is simply not named. */
const PROVIDER_LABELS: Record<string, string> = {
  anthropic: "Anthropic",
  openai: "OpenAI",
  gemini: "Google Gemini",
};

/** Whether AiNote has anything to say; the toggle only references the note's id when it does. */
export function hasAiNote(provider: string | null, demo: boolean): boolean {
  return demo || Boolean(provider && PROVIDER_LABELS[provider]);
}

/**
 * Caption below the toggle: names the provider that receives the theme text and, on the
 * hosted demo, says the AI runs on a shared key with a monthly spend cap. Rendered by the
 * caller below the toggle row (not inside it) so it can wrap full-width without distorting
 * the row's alignment. Renders nothing when there is neither a known provider nor a demo notice.
 */
export function AiNote({ provider, demo }: { provider: string | null; demo: boolean }) {
  if (!hasAiNote(provider, demo)) return null;
  const label = provider ? PROVIDER_LABELS[provider] : undefined;
  return (
    <p id={NOTE_ID} className="text-[11px] leading-snug text-muted-2">
      {label && <>Powered by {label}. </>}
      {demo && "Demo AI uses a shared key with a monthly cap. If it runs out, the standard generator still works."}
    </p>
  );
}

/** Persistent state line shown while AI is paused; replaces the demo caption. */
export function AiPausedNote({ demo }: { demo: boolean }) {
  return (
    <p id={PAUSED_NOTE_ID} className="text-[11px] leading-snug text-muted-2">
      {demo
        ? "AI is paused: the demo's shared budget is used up for this month. The standard generator still works."
        : "AI is paused: the provider reports no credit or quota left. The standard generator still works."}
    </p>
  );
}

/**
 * "Enhance with AI" switch. On: the model proposes all 8 color roles for the
 * theme. Off: roles come from the built-in keyword dictionary.
 */
export default function AiToggle({ checked, onChange, hasNote = false, paused = false }: AiToggleProps) {
  const [tipOpen, setTipOpen] = useState(false);

  return (
    <div
      className="relative flex items-center gap-2 text-xs text-muted-2"
      onMouseLeave={() => setTipOpen(false)}
    >
      <Switch
        label="Enhance with AI"
        showLabel
        checked={checked}
        onChange={onChange}
        disabled={paused}
        describedBy={paused ? PAUSED_NOTE_ID : hasNote ? NOTE_ID : undefined}
      />

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
