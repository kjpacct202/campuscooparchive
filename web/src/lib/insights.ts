// Aggregations over the deep-coded records (data/deep_analysis.json), computed
// at build time. Source of truth stays the Python pipeline; this only summarizes it.

import { getDeepList, getPlan } from "./data";

export interface Count {
  label: string;
  value: number;
}
export interface GroupMean {
  label: string;
  value: number; // mean benchmark score
  n: number;
}

const COOP_TREATMENT_LABEL: Record<string, string> = {
  integrated: "Integrated in a broader plan",
  separate: "Separate continuity document",
  program: "Program governing unit plans",
  na: "Not applicable",
};

/** How continuity is housed across the deep-coded corpus. */
export function coopSplit(): Count[] {
  const m: Record<string, number> = {};
  for (const d of getDeepList()) {
    const k = d.coop_treatment || "na";
    m[k] = (m[k] || 0) + 1;
  }
  return Object.entries(m)
    .sort((a, b) => b[1] - a[1])
    .map(([k, value]) => ({ label: COOP_TREATMENT_LABEL[k] || k, value }));
}

const ALT_FACILITY_LABEL: Record<string, string> = {
  "physical-alternate-site": "Physical alternate site",
  "telework-distributed": "Telework / distributed",
  "reciprocal-mutual-aid": "Reciprocal / mutual-aid",
  "cloud-hosted": "Cloud-hosted",
  multiple: "Multiple models",
  "none-stated": "None stated",
};

/** Continuity-facility strategies across the deep-coded corpus. */
export function altFacilityModels(): Count[] {
  const m: Record<string, number> = {};
  for (const d of getDeepList()) {
    const k = d.alternate_facility_model || "none-stated";
    m[k] = (m[k] || 0) + 1;
  }
  return Object.entries(m)
    .sort((a, b) => b[1] - a[1])
    .map(([k, value]) => ({ label: ALT_FACILITY_LABEL[k] || k, value }));
}

function meansBy(keyOf: (planId: string, structure: string) => string): GroupMean[] {
  const groups: Record<string, number[]> = {};
  for (const d of getDeepList()) {
    const k = keyOf(d.plan_id, d.organizing_structure_confirmed || "unclear");
    (groups[k] ??= []).push(d.benchmark_present);
  }
  return Object.entries(groups)
    .map(([label, arr]) => ({
      label,
      value: Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)),
      n: arr.length,
    }))
    .sort((a, b) => b.value - a.value);
}

export function meanScoreByStructure(): GroupMean[] {
  return meansBy((_id, structure) => structure);
}

export function meanScoreByDocType(): GroupMean[] {
  return meansBy((id) => getPlan(id)?.document_type || "unknown");
}

export function mostMissing(topN = 8): Count[] {
  const m: Record<string, number> = {};
  for (const d of getDeepList())
    for (const k of d.benchmark_missing || []) m[k] = (m[k] || 0) + 1;
  return Object.entries(m)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([label, value]) => ({ label, value }));
}

export interface Decision {
  plan_id: string;
  institution_name: string;
  decision: string;
  quote: string;
}

/** Every notable design decision captured across the deep-coded plans, with its quote. */
export function notableDecisions(): Decision[] {
  const out: Decision[] = [];
  for (const d of getDeepList()) {
    for (const u of d.unusual_decisions || []) {
      out.push({
        plan_id: d.plan_id,
        institution_name: d.institution_name || d.plan_id,
        decision: u.decision,
        quote: u.quote,
      });
    }
  }
  return out.sort((a, b) => a.institution_name.localeCompare(b.institution_name));
}

/** Notable decisions grouped by plan (for the gallery), institutions A–Z. */
export function notableDecisionsByPlan(): {
  plan_id: string;
  institution_name: string;
  items: Decision[];
}[] {
  const map = new Map<string, { plan_id: string; institution_name: string; items: Decision[] }>();
  for (const d of notableDecisions()) {
    const g = map.get(d.plan_id) || {
      plan_id: d.plan_id,
      institution_name: d.institution_name,
      items: [],
    };
    g.items.push(d);
    map.set(d.plan_id, g);
  }
  return [...map.values()].sort((a, b) =>
    a.institution_name.localeCompare(b.institution_name)
  );
}
