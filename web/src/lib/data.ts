// Server-only data loaders. Read the Python-built JSON masters from ../data at
// build time (this module must never be imported by a "use client" component).
// During `next build`/`next dev` and on Vercel (Root Directory = "web"),
// process.cwd() is the web/ dir, so ../data resolves to the monorepo data folder.

import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import type { Plan, Institution, DeepRecord, Stats, SlimPlan } from "./types";

function dataDir(): string {
  const candidates = [
    resolve(process.cwd(), "..", "data"),
    resolve(process.cwd(), "data"),
  ];
  for (const c of candidates) {
    if (existsSync(join(c, "plans.json"))) return c;
  }
  throw new Error(
    "data.ts: could not find data/plans.json relative to " + process.cwd()
  );
}

function read<T>(name: string): T {
  return JSON.parse(readFileSync(join(dataDir(), name), "utf-8")) as T;
}

let _plans: Plan[] | null = null;
let _institutions: Institution[] | null = null;
let _deep: Map<string, DeepRecord> | null = null;
let _stats: Stats | null = null;

export function getPlans(): Plan[] {
  return (_plans ??= read<Plan[]>("plans.json"));
}

export function getInstitutions(): Institution[] {
  return (_institutions ??= read<Institution[]>("institutions.json"));
}

export function getDeepMap(): Map<string, DeepRecord> {
  if (_deep) return _deep;
  const m = new Map<string, DeepRecord>();
  try {
    const nameOf = new Map(getPlans().map((p) => [p.plan_id, p.institution_name]));
    for (const d of read<DeepRecord[]>("deep_analysis.json")) {
      // deep_analysis.json has no institution_name, so join it from the plans table.
      d.institution_name ??= nameOf.get(d.plan_id) ?? d.plan_id;
      m.set(d.plan_id, d);
    }
  } catch {
    // deep_analysis.json optional
  }
  return (_deep = m);
}

export function getStats(): Stats {
  return (_stats ??= read<Stats>("stats.json"));
}

export function getPlan(id: string): Plan | undefined {
  return getPlans().find((p) => p.plan_id === id);
}

export function getInstitution(id: string): Institution | undefined {
  return getInstitutions().find((i) => i.institution_id === id);
}

export function getDeep(id: string): DeepRecord | undefined {
  return getDeepMap().get(id);
}

/** The full set of deep records (each carries a joined institution_name). */
export function getDeepList(): DeepRecord[] {
  return [...getDeepMap().values()];
}

/** Related plans for a detail page: same state first (deep-coded ranked higher),
 * topped up with same-institution-type plans from elsewhere. */
export function getRelated(id: string, n = 4): SlimPlan[] {
  const p = getPlan(id);
  if (!p) return [];
  const isDeep = (x: Plan) => (getDeep(x.plan_id) ? 1 : 0);
  const sameState = getPlans()
    .filter((x) => x.plan_id !== id && x.state === p.state)
    .sort((a, b) => isDeep(b) - isDeep(a) || (b.recency_year || 0) - (a.recency_year || 0));
  let pool = sameState;
  if (pool.length < n) {
    const sameType = getPlans().filter(
      (x) =>
        x.plan_id !== id &&
        x.state !== p.state &&
        x.institution_type === p.institution_type
    );
    pool = [...pool, ...sameType];
  }
  return pool
    .slice(0, n)
    .map((x) => getSlim(x.plan_id))
    .filter(Boolean) as SlimPlan[];
}

/** A plan as the slim shape PlanCard consumes, with the deep layer merged in. */
export function getSlim(id: string): SlimPlan | null {
  const p = getPlan(id);
  if (!p) return null;
  const d = getDeep(id);
  return {
    plan_id: p.plan_id,
    institution_name: p.institution_name,
    state: p.state,
    city: p.city ?? null,
    control: p.control ?? null,
    institution_type: p.institution_type ?? null,
    system_affiliation: p.system_affiliation ?? null,
    plan_type: p.plan_type ?? null,
    document_type: p.document_type ?? null,
    source_url: p.source_url ?? null,
    landing_page_url: p.landing_page_url ?? null,
    file_format: p.file_format ?? null,
    published_revised: p.published_revised ?? null,
    version: p.version ?? null,
    framework_alignment: p.framework_alignment ?? null,
    organizing_structure:
      d?.organizing_structure_confirmed || p.organizing_structure || null,
    recency_year: p.recency_year ?? null,
    evidence_quote: p.evidence_quote ?? null,
    verification: p.verification ?? null,
    catalog_notes: p.catalog_notes ?? null,
    flags_present_count: p.flags_present_count ?? null,
    benchmark_present: d?.benchmark_present ?? p.benchmark_present ?? null,
    benchmark_missing: d?.benchmark_missing ?? [],
    benchmark_band: d?.benchmark_band ?? p.benchmark_band ?? null,
    unusual: d?.unusual_decisions ?? [],
    coop_treatment: d?.coop_treatment ?? null,
    alternate_facility_model: d?.alternate_facility_model ?? null,
    essential_functions: d?.essential_functions ?? [],
  };
}
