// Pure serialization helpers shared by the client export menu (export.ts) and the
// Node download build step (scripts/build-downloads.mjs). No browser- or Node-only
// APIs here, so the same logic produces identical CSV/Excel output in both places.

/** @param {unknown} v @returns {string} */
export function cell(v) {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) {
    // Arrays of scalars → "a; b; c"; arrays of objects → compact JSON.
    if (v.every((x) => x === null || typeof x !== "object")) return v.join("; ");
    return JSON.stringify(v);
  }
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

/**
 * @param {Record<string, unknown>[]} rows
 * @param {string[]} columns
 * @returns {string}
 */
export function toCSV(rows, columns) {
  const q = (/** @type {unknown} */ s) => '"' + cell(s).replace(/"/g, '""') + '"';
  const lines = [columns.map((c) => q(c)).join(",")];
  for (const r of rows) lines.push(columns.map((c) => q(r[c])).join(","));
  return lines.join("\r\n");
}

/** @param {string} s @returns {string} */
function xmlEscape(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Excel-openable SpreadsheetML 2003 (.xls): dependency-free, opens natively in Excel.
 * @param {Record<string, unknown>[]} rows
 * @param {string[]} columns
 * @param {string} [sheetName]
 * @returns {string}
 */
export function toExcelXml(rows, columns, sheetName = "Sheet1") {
  const c = (/** @type {unknown} */ v) => {
    const isNum = typeof v === "number" && Number.isFinite(v);
    const type = isNum ? "Number" : "String";
    const data = isNum ? String(v) : xmlEscape(cell(v));
    return `<Cell><Data ss:Type="${type}">${data}</Data></Cell>`;
  };
  const header = "<Row>" + columns.map((x) => c(x)).join("") + "</Row>";
  const body = rows
    .map((r) => "<Row>" + columns.map((x) => c(r[x])).join("") + "</Row>")
    .join("");
  return (
    '<?xml version="1.0"?>\n' +
    '<?mso-application progid="Excel.Sheet"?>\n' +
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ' +
    'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
    `<Worksheet ss:Name="${xmlEscape(sheetName)}"><Table>` +
    header +
    body +
    "</Table></Worksheet></Workbook>"
  );
}
