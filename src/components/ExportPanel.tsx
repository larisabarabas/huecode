import { useMemo, useState } from "react";
import { EXPORT_FORMATS, type ExportFormatId } from "../lib/exportFormats";
import { downloadTextFile } from "../lib/download";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import type { Palette } from "../lib/types";

interface ExportPanelProps {
  palette: Palette;
}

export default function ExportPanel({ palette }: ExportPanelProps) {
  const [activeId, setActiveId] = useState<ExportFormatId>("tailwind-v4");
  const { copiedKey, failedKey, copy } = useCopyToClipboard();

  const active = EXPORT_FORMATS.find((f) => f.id === activeId)!;
  const code = useMemo(() => active.generate(palette), [active, palette]);

  return (
    <div className="flex min-w-0 flex-col gap-2.5 px-4.5 pb-4.5 pt-3.5 lg:h-full lg:min-h-0">
      <div className="flex flex-wrap gap-1.5">
        {EXPORT_FORMATS.map((format) => (
          <button
            key={format.id}
            type="button"
            onClick={() => setActiveId(format.id)}
            className={`rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold transition-colors ${
              format.id === activeId ? "bg-chip-purple text-shell-bg" : "bg-chrome-2 text-muted"
            }`}
          >
            {format.label}
          </button>
        ))}
        <div className="ml-auto flex basis-full gap-1.5 lg:basis-auto">
          <button
            type="button"
            onClick={() => copy(code, active.id)}
            aria-live="polite"
            className={`rounded-lg border px-2.5 py-1.5 text-[11.5px] font-semibold hover:text-ink ${
              failedKey === active.id ? "border-red-500 text-red-600" : "border-line text-muted"
            }`}
          >
            {copiedKey === active.id ? "Copied!" : failedKey === active.id ? "Copy failed" : "Copy"}
          </button>
          <button
            type="button"
            onClick={() => downloadTextFile(active.filename, code)}
            className="rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-semibold text-muted hover:text-ink"
          >
            Download
          </button>
        </div>
      </div>

      <pre className="m-0 min-w-0 overflow-x-auto whitespace-pre-wrap break-words rounded-[10px] border border-line bg-code-bg p-3.5 font-mono text-[11px] leading-relaxed text-[#e7e5f0] lg:min-h-0 lg:flex-1 lg:overflow-auto lg:whitespace-pre lg:break-normal lg:text-[11.5px]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
