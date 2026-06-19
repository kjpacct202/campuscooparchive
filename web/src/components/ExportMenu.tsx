"use client";

import { useState } from "react";
import type { SlimPlan } from "@/lib/types";
import { buildExport, triggerDownload, formatBytes, type ExportFormat } from "@/lib/export";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Download, FileSpreadsheet, FileJson, FileText, Table, Loader2 } from "lucide-react";

const FORMATS: { format: ExportFormat; label: string; Icon: typeof Table; hint: string }[] = [
  { format: "csv", label: "CSV", Icon: Table, hint: "spreadsheet" },
  { format: "xlsx", label: "Excel", Icon: FileSpreadsheet, hint: ".xlsx" },
  { format: "json", label: "JSON", Icon: FileJson, hint: "for AI / code" },
  { format: "pdf", label: "PDF", Icon: FileText, hint: "printable" },
];

export default function ExportMenu({
  rows,
  baseName,
  label = "Export",
}: {
  rows: SlimPlan[];
  baseName: string;
  label?: string;
}) {
  const [pending, setPending] = useState<{ blob: Blob; filename: string } | null>(null);
  const [loading, setLoading] = useState<ExportFormat | null>(null);

  async function choose(format: ExportFormat) {
    setLoading(format);
    try {
      const built = await buildExport(rows, format, baseName);
      setPending(built);
    } finally {
      setLoading(null);
    }
  }

  function confirmDownload() {
    if (pending) {
      triggerDownload(pending.blob, pending.filename);
      window.dispatchEvent(new Event("coop-confetti"));
    }
    setPending(null);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="btn" aria-label="Export the current results">
            <Download className="mr-1.5 inline h-4 w-4 align-text-bottom" aria-hidden="true" />
            {label}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Export {rows.length.toLocaleString()} plan{rows.length === 1 ? "" : "s"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {FORMATS.map((f) => (
            <DropdownMenuItem
              key={f.format}
              onSelect={(e) => {
                e.preventDefault();
                choose(f.format);
              }}
            >
              {loading === f.format ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <f.Icon className="h-4 w-4" style={{ color: "var(--accent)" }} aria-hidden="true" />
              )}
              <span className="font-medium">{f.label}</span>
              <span className="ml-auto font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
                {f.hint}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <DialogContent>
          <DialogTitle>Your download is ready</DialogTitle>
          <DialogDescription>
            {pending && (
              <>
                <span className="font-mono" style={{ color: "var(--text-primary)" }}>{pending.filename}</span>
                <br />
                {rows.length.toLocaleString()} plan{rows.length === 1 ? "" : "s"} · {formatBytes(pending.blob.size)}.
                Every row carries its source link and verbatim quote.
              </>
            )}
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <button className="btn">Cancel</button>
            </DialogClose>
            <button className="btn btn-primary" onClick={confirmDownload}>
              Download
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
