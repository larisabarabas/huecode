import { Coffee } from "lucide-react";
import { SUPPORT_URL } from "../lib/siteConfig";

/**
 * Plain "Buy me a coffee" link — deliberately not the branded widget (no third-party JS, and a
 * yellow button would clash with whatever palette is on screen). Renders nothing when
 * VITE_SUPPORT_URL is empty. The padding/negative-margin pair grows the tap target to
 * ≥24px tall (WCAG 2.5.8) without moving surrounding layout.
 */
export default function SupportLink({ className = "" }: { className?: string }) {
  if (!SUPPORT_URL) return null;
  return (
    <a
      href={SUPPORT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`-my-1.5 inline-flex items-center gap-1 rounded py-1.5 underline decoration-current/40 underline-offset-2 hover:decoration-current ${className}`}
    >
      <Coffee size={12} aria-hidden="true" />
      Buy me a coffee
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
