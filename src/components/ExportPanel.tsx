import { useMemo, useState } from "react";
import { EXPORT_FORMATS, type ExportFormatId } from "../lib/exportFormats";
import { downloadTextFile } from "../lib/download";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import type { Palette } from "../lib/types";
import Button from "./ui/Button";
import SegmentedControl from "./ui/SegmentedControl";

interface ExportPanelProps {
  palette: Palette;
}

const FORMAT_OPTIONS = EXPORT_FORMATS.map((f) => ({ value: f.id, label: f.label }));

export default function ExportPanel({ palette }: ExportPanelProps) {
  const [activeId, setActiveId] = useState<ExportFormatId>("tailwind-v4");
  const { copiedKey, failedKey, copy } = useCopyToClipboard();

  const active = EXPORT_FORMATS.find((f) => f.id === activeId)!;
  const code = useMemo(() => active.generate(palette), [active, palette]);

  const copyFailed = failedKey === active.id;

  return (
    <div className="flex min-w-0 flex-col gap-2.5 px-4.5 pb-4.5 pt-3.5 lg:h-full lg:min-h-0">
      <div className="flex flex-wrap items-start gap-1.5">
        <SegmentedControl
          label="Export format"
          options={FORMAT_OPTIONS}
          value={activeId}
          onChange={setActiveId}
          size="sm"
          wrap
        />
        <div className="ml-auto flex basis-full gap-1.5 lg:basis-auto">
          <Button
            variant="secondary"
            size="sm"
            aria-live="polite"
            className={copyFailed ? "text-danger! border-danger!" : ""}
            onClick={() => copy(code, active.id)}
          >
            {copiedKey === active.id ? "Copied!" : copyFailed ? "Copy failed" : "Copy"}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => downloadTextFile(active.filename, code)}>
            Download
          </Button>
        </div>
      </div>

      <pre className="m-0 min-w-0 overflow-x-auto whitespace-pre-wrap break-words rounded-[10px] border border-line bg-code-bg p-3.5 font-mono text-[11px] leading-relaxed text-[#e7e5f0] lg:min-h-0 lg:flex-1 lg:overflow-auto lg:whitespace-pre lg:break-normal lg:text-[11.5px]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
