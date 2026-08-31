import { useCallback, useRef, useState } from "react";

export function useCopyToClipboard(resetDelayMs = 1500) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const copy = useCallback(
    async (text: string, key: string) => {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopiedKey(null), resetDelayMs);
    },
    [resetDelayMs],
  );

  return { copiedKey, copy };
}
