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
  const { copiedKey, copy } = useCopyToClipboard();

  const active = EXPORT_FORMATS.find((f) => f.id === activeId)!;
  const code = useMemo(() => active.generate(palette), [active, palette]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-2.5 px-4.5 pb-4.5 pt-3.5">
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
        <div className="ml-auto flex gap-1.5">
          <button
            type="button"
            onClick={() => copy(code, active.id)}
            className="rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-semibold text-muted hover:text-ink"
          >
            {copiedKey === active.id ? "Copied!" : "Copy"}
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

      <pre className="m-0 min-h-0 flex-1 overflow-auto rounded-[10px] border border-line bg-code-bg p-3.5 font-mono text-[11.5px] leading-relaxed text-[#e7e5f0]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
