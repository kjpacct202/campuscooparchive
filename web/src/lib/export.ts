// Client-side export helpers for Browse + Downloads. CSV/JSON are dependency-free;
// XLSX (xlsx) and PDF (jspdf + jspdf-autotable) are dynamically imported so they
// only load when a reader actually exports. Serialization for CSV is shared with
// the Node download build step via serialize.mjs.

import type { SlimPlan } from "./types";
import { toCSV } from "./serialize.mjs";

export const EXPORT_COLUMNS: (keyof SlimPlan)[] = [
  "plan_id",
  "institution_name",
  "state",
  "control",
  "institution_type",
  "plan_type",
  "document_type",
  "organizing_structure",
  "recency_year",
  "verification",
  "benchmark_present",
  "source_url",
  "landing_page_url",
  "evidence_quote",
];

export type ExportFormat = "csv" | "json" | "xlsx" | "pdf";

const LABEL: Record<string, string> = {
  plan_id: "Plan ID",
  institution_name: "Institution",
  state: "State",
  control: "Control",
  institution_type: "Institution type",
  plan_type: "Plan type",
  document_type: "Document type",
  organizing_structure: "Organizing structure",
  recency_year: "Recency year",
  verification: "Verification",
  benchmark_present: "Benchmark (/22)",
  source_url: "Source URL",
  landing_page_url: "Landing page",
  evidence_quote: "Evidence quote",
};

const cols = EXPORT_COLUMNS as unknown as string[];
const asRows = (rows: SlimPlan[]) => rows as unknown as Record<string, unknown>[];

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

/** Build the export blob + filename for the chosen format. Heavy libs are lazy. */
export async function buildExport(
  rows: SlimPlan[],
  format: ExportFormat,
  baseName: string
): Promise<{ blob: Blob; filename: string }> {
  if (format === "json") {
    return {
      blob: new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" }),
      filename: `${baseName}.json`,
    };
  }
  if (format === "csv") {
    return {
      blob: new Blob([toCSV(asRows(rows), cols)], { type: "text/csv;charset=utf-8" }),
      filename: `${baseName}.csv`,
    };
  }
  if (format === "xlsx") {
    const XLSX = await import("xlsx");
    const labeled = rows.map((r) => {
      const o: Record<string, unknown> = {};
      for (const c of cols) o[LABEL[c] || c] = (r as unknown as Record<string, unknown>)[c] ?? "";
      return o;
    });
    const ws = XLSX.utils.json_to_sheet(labeled);
    ws["!cols"] = cols.map((c) => ({ wch: c === "evidence_quote" ? 70 : c === "source_url" || c === "landing_page_url" ? 48 : c === "institution_name" ? 34 : 18 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Campus COOP Archive");
    const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    return {
      blob: new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      filename: `${baseName}.xlsx`,
    };
  }
  // pdf
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, W, 54, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("Campus COOP Archive", 40, 26);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`${rows.length} continuity plan${rows.length === 1 ? "" : "s"} · campuscooparchive.vercel.app`, 40, 42);
  const pdfCols = ["institution_name", "state", "plan_type", "document_type", "benchmark_present", "verification", "source_url"];
  autoTable(doc, {
    startY: 66,
    head: [pdfCols.map((c) => LABEL[c] || c)],
    body: rows.map((r) => pdfCols.map((c) => String((r as unknown as Record<string, unknown>)[c] ?? ""))),
    styles: { fontSize: 7.5, cellPadding: 3, overflow: "linebreak" },
    headStyles: { fillColor: [20, 184, 166], textColor: 255 },
    columnStyles: { 0: { cellWidth: 150 }, 6: { cellWidth: 200 } },
    margin: { left: 40, right: 40 },
  });
  return { blob: doc.output("blob"), filename: `${baseName}.pdf` };
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
