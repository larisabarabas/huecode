import { useCallback, useLayoutEffect, useRef, useState } from "react";

/** Preview mocks switch to their sidebar/multi-column layouts on the width they actually have,
 * not the viewport's: with the generator panel open at 1024px the preview is only ~550px wide,
 * and with the panel collapsed at 1024px it is ~860px, so the viewport can't tell the two apart. */
export function useContainerWide(minWidth: number) {
  const nodeRef = useRef<HTMLElement | null>(null);
  const [wide, setWide] = useState(false);

  useLayoutEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    setWide(node.clientWidth >= minWidth);
    const observer = new ResizeObserver(([entry]) => setWide(entry.contentRect.width >= minWidth));
    observer.observe(node);
    return () => observer.disconnect();
  }, [minWidth]);

  const ref = useCallback((node: HTMLElement | null) => {
    nodeRef.current = node;
  }, []);

  return [ref, wide] as const;
}

/** Preview width at which the App/Marketing mocks have room for their sidebar/wide layouts. */
export const PREVIEW_WIDE_MIN = 720;
