// prepare-data.mjs: build-time step (npm "predev"/"prebuild").
//
// Produces the slim client search payload consumed by the Browse page, the
// command palette, and the export menu. It is the Node port of the slim-field
// selection + deep-analysis merge in ../scripts/build_dashboard.py, so the
// website stays in lockstep with the Python pipeline without duplicating the
// dataset. The Python masters in ../data remain the single source of truth;
// this script never mutates them.
//
// Output: web/public/data/plans.slim.json  (regenerated; git-ignored)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = resolve(__dirname, "..");

// Resolve the canonical data dir. On local dev and on Vercel (Root Directory =
// "web"), ../data is the monorepo data folder; fall back to a couple of spots.
function findDataDir() {
  const candidates = [
    resolve(WEB_ROOT, "..", "data"),
    resolve(process.cwd(), "..", "data"),
    resolve(process.cwd(), "data"),
  ];
  for (const c of candidates) {
    if (existsSync(join(c, "plans.json"))) return c;
  }
  throw new Error(
    "prepare-data: could not locate data/plans.json. Looked in:\n  " +
      candidates.join("\n  ")
  );
}

const DATA_DIR = findDataDir();
const readJson = (name) => JSON.parse(readFileSync(join(DATA_DIR, name), "utf-8"));

// The fields the UI needs (SlimPlan in src/lib/types.ts).
const KEEP = [
  "plan_id", "institution_name", "state", "city", "control", "institution_type",
  "system_affiliation", "plan_type", "source_url", "landing_page_url",
  "file_format", "published_revised", "version", "framework_alignment",
  "organizing_structure", "document_type", "recency_year", "evidence_quote",
  "verification", "catalog_notes", "flags_present_count",
];

const plans = readJson("plans.json");
const slim = plans.map((p) => {
  const r = {};
  for (const k of KEEP) r[k] = p[k] ?? null;
  return r;
});

// Merge the deep-analysis layer where present (benchmark score + notable decisions
// + the deep scalars the compare view reads).
let deepCount = 0;
const deepPath = join(DATA_DIR, "deep_analysis.json");
if (existsSync(deepPath)) {
  const deep = new Map();
  for (const d of readJson("deep_analysis.json")) deep.set(d.plan_id, d);
  for (const r of slim) {
    const d = deep.get(r.plan_id);
    if (d) {
      r.benchmark_present = d.benchmark_present ?? null;
      r.benchmark_missing = d.benchmark_missing ?? [];
      r.benchmark_band = d.benchmark_band ?? null;
      r.unusual = d.unusual_decisions ?? [];
      r.coop_treatment = d.coop_treatment ?? null;
      r.alternate_facility_model = d.alternate_facility_model ?? null;
      r.essential_functions = d.essential_functions ?? [];
      if (d.organizing_structure_confirmed) {
        r.organizing_structure = d.organizing_structure_confirmed;
      }
      deepCount += 1;
    } else {
      r.benchmark_present = null;
      r.benchmark_missing = [];
      r.benchmark_band = null;
    }
  }
} else {
  for (const r of slim) {
    r.benchmark_present = null;
    r.benchmark_missing = [];
    r.benchmark_band = null;
  }
}

const OUT_DIR = join(WEB_ROOT, "public", "data");
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "plans.slim.json"), JSON.stringify(slim));

console.log(
  `prepare-data: wrote public/data/plans.slim.json: ${slim.length} plans, ` +
    `${deepCount} deep-coded (source: ${DATA_DIR})`
);
