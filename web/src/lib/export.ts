// Client-side export helpers for the Browse export menu (filtered result set).
// Serialization is shared with the Node download build step via serialize.mjs.

import type { SlimPlan } from "./types";
import { toCSV, toExcelXml } from "./serialize.mjs";

// Mirrors the offline prototype (site/index.html) CSV column set.
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

function download(filename: string, text: string, mime: string): void {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const asRows = (rows: SlimPlan[]) => rows as unknown as Record<string, unknown>[];
const cols = EXPORT_COLUMNS as unknown as string[];

export function exportJSON(rows: SlimPlan[]): void {
  download(
    "campus-coop-archive-filtered.json",
    JSON.stringify(rows, null, 2),
    "application/json"
  );
}

export function exportCSV(rows: SlimPlan[]): void {
  download(
    "campus-coop-archive-filtered.csv",
    toCSV(asRows(rows), cols),
    "text/csv;charset=utf-8"
  );
}

export function exportExcel(rows: SlimPlan[]): void {
  download(
    "campus-coop-archive-filtered.xls",
    toExcelXml(asRows(rows), cols, "Campus COOP Archive"),
    "application/vnd.ms-excel"
  );
}
