import { useCallback, useRef, useState } from "react";

type CopyStatus = "copied" | "error";

interface CopyState {
  key: string;
  value: string;
  status: CopyStatus;
}

/** Last-ditch copy for insecure contexts / denied permission. */
function fallbackCopy(text: string): boolean {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function useCopyToClipboard(resetDelayMs = 1500) {
  const [state, setState] = useState<CopyState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const copy = useCallback(
    async (text: string, key: string) => {
      let ok = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          ok = true;
        }
      } catch {
        ok = false;
      }
      if (!ok) ok = fallbackCopy(text);

      setState({ key, value: text, status: ok ? "copied" : "error" });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setState(null), resetDelayMs);
    },
    [resetDelayMs],
  );

  return {
    copiedKey: state?.status === "copied" ? state.key : null,
    copiedValue: state?.status === "copied" ? state.value : null,
    failedKey: state?.status === "error" ? state.key : null,
    failedValue: state?.status === "error" ? state.value : null,
    copy,
  };
}
