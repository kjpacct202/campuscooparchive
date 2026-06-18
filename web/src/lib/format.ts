// Display helpers + the canonical 22 continuity benchmark component labels.

// The 22 keys are the exact values that appear in deep_analysis.json's
// `benchmark_missing` arrays (see docs/CONTINUITY_BENCHMARK.md and
// scripts/merge_deep.py BENCHMARK_KEYS). Order matches the benchmark document.
export const COMPONENT_LABEL: Record<string, string> = {
  continuity_policy_promulgation: "Continuity policy & promulgation",
  concept_of_operations: "Concept of operations",
  standards_alignment: "Standards alignment",
  budgeting_resources: "Budgeting & resources",
  plan_maintenance: "Plan maintenance",
  essential_functions: "Essential functions",
  business_impact_analysis: "Business impact analysis",
  recovery_time_objectives: "Recovery time objectives",
  risk_threat_assessment: "Risk & threat assessment",
  interdependencies: "Interdependencies",
  orders_of_succession: "Orders of succession",
  delegations_of_authority: "Delegations of authority",
  continuity_facilities: "Continuity facilities",
  continuity_communications: "Continuity communications",
  vital_records_management: "Vital records management",
  continuity_personnel: "Continuity personnel",
  activation_triggers: "Activation triggers",
  devolution: "Devolution",
  reconstitution: "Reconstitution",
  it_disaster_recovery: "IT disaster recovery",
  academic_instructional_continuity: "Academic / instructional continuity",
  tests_training_exercises: "Tests, training & exercises",
};

export const ALL_COMPONENT_KEYS = Object.keys(COMPONENT_LABEL);
export const BENCHMARK_MAX = ALL_COMPONENT_KEYS.length; // 22

export function componentLabel(key: string): string {
  return COMPONENT_LABEL[key] || key;
}

export function verificationLabel(v: string | null | undefined): string {
  return v === "opened-and-confirmed" ? "Opened & confirmed" : "Link-only";
}

export function isConfirmed(v: string | null | undefined): boolean {
  return v === "opened-and-confirmed";
}

/** Pretty-print a hyphenated tag like "telework-distributed" → "Telework distributed". */
export function prettyTag(tag: string): string {
  return tag
    .split("/")
    .map((seg) =>
      seg
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    )
    .join(" / ");
}

export function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Map a benchmark score (0-22) to a coarse tier for color coding. Mean is 13.1. */
export function scoreTier(score: number): "high" | "mid" | "low" {
  if (score >= 17) return "high";
  if (score >= 10) return "mid";
  return "low";
}

export const SITE_NAME = "Campus COOP Archive";
export const SITE_TAGLINE =
  "An open, fully sourced catalog of US college & university continuity plans.";
export const SITE_EYEBROW = "A Campus Alert Archive project.";
// Used for absolute URLs in metadata / sitemap. Override at deploy time if a
// custom domain is attached in Vercel.
export const SITE_URL = "https://campuscooparchive.vercel.app";

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
