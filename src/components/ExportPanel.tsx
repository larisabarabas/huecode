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
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 p-2">
        {EXPORT_FORMATS.map((format) => (
          <button
            key={format.id}
            type="button"
            onClick={() => setActiveId(format.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              format.id === activeId
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {format.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <pre className="max-h-96 overflow-auto rounded-b-lg bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
          <code>{code}</code>
        </pre>
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            type="button"
            onClick={() => copy(code, active.id)}
            className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-100 hover:bg-slate-700"
          >
            {copiedKey === active.id ? "Copied!" : "Copy"}
          </button>
          <button
            type="button"
            onClick={() => downloadTextFile(active.filename, code)}
            className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-100 hover:bg-slate-700"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
