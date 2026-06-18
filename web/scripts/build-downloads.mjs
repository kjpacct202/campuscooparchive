// build-downloads.mjs — build-time step (npm "predev"/"prebuild"), runs after
// prepare-data.mjs. Emits the free, AI-ready downloadable dataset into
// web/public/downloads/ (git-ignored, regenerated each build). The Python masters
// in ../data remain the single source of truth; this only re-shapes them.

import {
  readFileSync,
  writeFileSync,
  copyFileSync,
  mkdirSync,
  existsSync,
  statSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { toCSV, toExcelXml } from "../src/lib/serialize.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(__dirname, "..");
const SITE_URL = "https://campuscooparchive.vercel.app";

function findDataDir() {
  for (const c of [
    resolve(WEB_ROOT, "..", "data"),
    resolve(process.cwd(), "..", "data"),
    resolve(process.cwd(), "data"),
  ]) {
    if (existsSync(join(c, "plans.json"))) return c;
  }
  throw new Error("build-downloads: could not locate data/plans.json");
}

const DATA_DIR = findDataDir();
const REPO_ROOT = resolve(DATA_DIR, "..");
const OUT_DIR = join(WEB_ROOT, "public", "downloads");
mkdirSync(OUT_DIR, { recursive: true });

const readJson = (p) => JSON.parse(readFileSync(p, "utf-8"));
const plans = readJson(join(DATA_DIR, "plans.json"));
const institutions = readJson(join(DATA_DIR, "institutions.json"));
const stats = readJson(join(DATA_DIR, "stats.json"));
const deep = existsSync(join(DATA_DIR, "deep_analysis.json"))
  ? readJson(join(DATA_DIR, "deep_analysis.json"))
  : [];

const PLAN_COLUMNS = [
  "plan_id", "institution_name", "state", "city", "control", "institution_type",
  "system_affiliation", "enrollment", "plan_type", "document_type",
  "organizing_structure", "framework_alignment", "published_revised",
  "recency_year", "file_format", "source_url", "landing_page_url", "verification",
  "date_accessed", "evidence_quote", "catalog_notes",
];
const DEEP_COLUMNS = [
  "plan_id", "read_confidence", "organizing_structure_confirmed", "coop_treatment",
  "benchmark_present", "benchmark_band", "benchmark_missing", "essential_functions",
  "rto_tiers", "succession_depth", "alternate_facility_model",
  "vital_records_approach", "tte_cadence", "devolution_treatment",
  "reconstitution_treatment", "academic_continuity_treatment",
  "it_continuity_treatment", "interdependencies_treatment", "analyst_notes",
  "date_coded",
];

function write(name, text) {
  writeFileSync(join(OUT_DIR, name), text);
}
function copyOrGenerate(srcName, outName, rows, columns) {
  const src = join(DATA_DIR, srcName);
  if (existsSync(src)) copyFileSync(src, join(OUT_DIR, outName));
  else write(outName, toCSV(rows, columns));
}

// --- JSON copies ---
write("plans.json", JSON.stringify(plans));
write("institutions.json", JSON.stringify(institutions));
write("deep_analysis.json", JSON.stringify(deep));

// --- CSV (copy canonical Python CSVs where present, else generate) ---
copyOrGenerate("plans.csv", "plans.csv", plans, PLAN_COLUMNS);
copyOrGenerate("institutions.csv", "institutions.csv", institutions, [
  "institution_id", "institution_name", "state", "city", "control",
  "institution_type", "system_affiliation", "enrollment", "plan_count",
  "plan_ids", "best_verification", "most_recent_year",
]);
write("deep_analysis.csv", toCSV(deep, DEEP_COLUMNS));

// --- Excel (.xls SpreadsheetML, dependency-free) ---
write("plans.xls", toExcelXml(plans, PLAN_COLUMNS, "Plans"));
write("deep_analysis.xls", toExcelXml(deep, DEEP_COLUMNS, "Deep analysis"));

// --- One-file "everything" bundle for single-upload AI ingestion ---
write(
  "campus-coop-archive-everything.json",
  JSON.stringify({
    dataset: "Campus COOP Archive",
    source: SITE_URL,
    generated_from: stats.generated_from,
    note: "Publicly published US campus continuity plans (COOP / BCP / academic-continuity / IT-DR), fully sourced. Every plan carries source_url + date_accessed + a verbatim evidence_quote. See DATA_DICTIONARY for field meanings.",
    counts: {
      plans: plans.length,
      institutions: institutions.length,
      deep_coded: deep.length,
    },
    stats,
    plans,
    deep_analysis: deep,
    institutions,
  })
);

// --- Data dictionary (field guide for humans + AI) ---
const readDoc = (rel) => {
  const p = join(REPO_ROOT, rel);
  return existsSync(p) ? readFileSync(p, "utf-8") : "";
};
const BENCHMARK_KEYS = [
  ["continuity_policy_promulgation", "Continuity policy & promulgation"],
  ["concept_of_operations", "Concept of operations"],
  ["standards_alignment", "Standards alignment"],
  ["budgeting_resources", "Budgeting & resources"],
  ["plan_maintenance", "Plan maintenance"],
  ["essential_functions", "Essential functions"],
  ["business_impact_analysis", "Business impact analysis"],
  ["recovery_time_objectives", "Recovery time objectives"],
  ["risk_threat_assessment", "Risk & threat assessment"],
  ["interdependencies", "Interdependencies"],
  ["orders_of_succession", "Orders of succession"],
  ["delegations_of_authority", "Delegations of authority"],
  ["continuity_facilities", "Continuity facilities"],
  ["continuity_communications", "Continuity communications"],
  ["vital_records_management", "Vital records management"],
  ["continuity_personnel", "Continuity personnel / human capital"],
  ["activation_triggers", "Activation triggers"],
  ["devolution", "Devolution"],
  ["reconstitution", "Reconstitution"],
  ["it_disaster_recovery", "IT disaster recovery"],
  ["academic_instructional_continuity", "Academic / instructional continuity"],
  ["tests_training_exercises", "Tests, training & exercises"],
];
const dictionary = `# Campus COOP Archive — Data Dictionary

This download is a fully sourced catalog of publicly published US college & university
continuity plans — Continuity of Operations Plans (COOP), Business Continuity Plans/Programs
(BCP), academic-continuity plans, and IT disaster-recovery plans. **Every plan record is
traceable to a primary source:** it carries a direct \`source_url\`, the \`date_accessed\`, and a
verbatim \`evidence_quote\`. Source documents remain the work of their institutions and are
linked, not redistributed.

## Files

- \`plans.{json,csv,xls}\` — master catalog, one row per plan (210 plans).
- \`deep_analysis.{json,csv,xls}\` — the subset read in full and scored against the
  22-component continuity benchmark (40 plans), keyed by \`plan_id\`.
- \`institutions.{json,csv}\` — one row per institution (207 institutions).
- \`campus-coop-archive-everything.json\` — all of the above plus aggregate stats in one file
  (best for uploading to an AI tool).
- \`DATA_DICTIONARY.md\` — this file.

Join key: \`plan_id\` is a slug of the institution name (optionally suffixed for multiple plans)
and links \`plans\`, \`deep_analysis\`, and \`institutions\` (via \`institution_id\` / \`plan_ids\`).

---

## Plan fields (plans.json / plans.csv)

${readDoc("schema/field_dictionary.md") || "(field dictionary unavailable)"}

---

## Controlled vocabularies

${readDoc("schema/taxonomies.md") || "(taxonomies unavailable)"}

---

## Deep-analysis fields (deep_analysis.json)

- \`benchmark_present\` (0–22): count of continuity benchmark components clearly present.
- \`benchmark_band\`: score band (0-4 / 5-9 / 10-14 / 15-19 / 20-22).
- \`benchmark_missing\`: array of component keys NOT present (see list below).
- \`read_confidence\`: analyst confidence (high / medium / low).
- \`organizing_structure_confirmed\`: full-text-verified structure (essential-functions-based / FCD-element-based / phase-based / departmental / unclear).
- \`coop_treatment\`: integrated / separate / program / na.
- \`alternate_facility_model\`: physical-alternate-site / telework-distributed / reciprocal-mutual-aid / cloud-hosted / multiple / none-stated.
- \`essential_functions\`: array of identified essential/critical functions.
- \`rto_tiers\`, \`succession_depth\`, \`vital_records_approach\`, \`tte_cadence\`, \`devolution_treatment\`, \`reconstitution_treatment\`, \`academic_continuity_treatment\`, \`it_continuity_treatment\`, \`interdependencies_treatment\`: prose summaries of how each is handled.
- \`unusual_decisions\`: array of { decision, quote } — notable design choices, each with a verbatim quote.
- \`analyst_notes\`: human-readable summary of the full-text reading.

### The 22-component continuity benchmark (keys used in benchmark_missing)

${BENCHMARK_KEYS.map(([k, l], i) => `${i + 1}. \`${k}\` — ${l}`).join("\n")}
`;
write("DATA_DICTIONARY.md", dictionary);

// --- Manifest (drives the /downloads page; real file sizes) ---
const MANIFEST = [
  { file: "campus-coop-archive-everything.json", label: "Everything, one file", format: "JSON", group: "Everything" },
  { file: "plans.csv", label: "All plans", format: "CSV", group: "Catalog" },
  { file: "plans.json", label: "All plans", format: "JSON", group: "Catalog" },
  { file: "plans.xls", label: "All plans", format: "Excel", group: "Catalog" },
  { file: "institutions.csv", label: "Institutions", format: "CSV", group: "Catalog" },
  { file: "institutions.json", label: "Institutions", format: "JSON", group: "Catalog" },
  { file: "deep_analysis.json", label: "Deep analysis (40 plans)", format: "JSON", group: "Deep analysis" },
  { file: "deep_analysis.csv", label: "Deep analysis (40 plans)", format: "CSV", group: "Deep analysis" },
  { file: "deep_analysis.xls", label: "Deep analysis (40 plans)", format: "Excel", group: "Deep analysis" },
  { file: "DATA_DICTIONARY.md", label: "Data dictionary", format: "Markdown", group: "Reference" },
].map((m) => ({ ...m, bytes: statSync(join(OUT_DIR, m.file)).size }));
write("downloads-manifest.json", JSON.stringify(MANIFEST, null, 2));

const total = MANIFEST.reduce((s, m) => s + m.bytes, 0);
console.log(
  `build-downloads: wrote ${MANIFEST.length} files to public/downloads/ ` +
    `(${(total / 1024).toFixed(0)} KB total; ${plans.length} plans, ${deep.length} deep-coded)`
);
