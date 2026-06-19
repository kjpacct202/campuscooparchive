// Types mirror schema/field_dictionary.md + schema/taxonomies.md. The Python
// pipeline (scripts/build_dataset.py + merge_deep.py) is the source of truth for
// the shapes. This is the continuity (COOP) sibling of the EOP Atlas.

export type Verification = "opened-and-confirmed" | "link-only";
export type Control = "public" | "private-nonprofit" | "private-for-profit";
export type FileFormat = "PDF" | "HTML" | "DOCX" | "other";
export type OrganizingStructure =
  | "essential-functions-based"
  | "FCD-element-based"
  | "phase-based"
  | "departmental"
  | "unclear";
export type DocumentType =
  | "full-coop"
  | "business-continuity-framework"
  | "department-level"
  | "academic-continuity"
  | "it-dr"
  | "template";
export type CoopTreatment = "integrated" | "separate" | "program" | "na";
export type AlternateFacilityModel =
  | "physical-alternate-site"
  | "telework-distributed"
  | "reciprocal-mutual-aid"
  | "cloud-hosted"
  | "multiple"
  | "none-stated";

/** One row of data/plans.json (the master catalog). */
export interface Plan {
  plan_id: string;
  institution_id: string;
  institution_name: string;
  state: string;
  city?: string | null;
  control: string;
  institution_type: string;
  system_affiliation?: string | null;
  enrollment?: number | null;
  plan_type: string;
  document_type: string;
  organizing_structure?: string | null;
  framework_alignment?: string | null;
  recency_year?: number | null;
  published_revised?: string | null;
  version?: string | null;
  file_format?: string | null;
  source_url: string;
  landing_page_url?: string | null;
  evidence_quote: string;
  verification: string;
  date_accessed: string;
  catalog_notes?: string | null;
  source_lane?: string | null;
  // 17 conservative discovery-stage continuity flags (lower bounds).
  identifies_essential_functions?: boolean;
  business_impact_analysis?: boolean;
  orders_of_succession?: boolean;
  delegations_of_authority?: boolean;
  alternate_facilities?: boolean;
  continuity_communications?: boolean;
  vital_records?: boolean;
  defines_rto?: boolean;
  tt_e_program?: boolean;
  devolution?: boolean;
  reconstitution?: boolean;
  addresses_academic_continuity?: boolean;
  addresses_it_dr?: boolean;
  references_fcd1?: boolean;
  references_nist80034?: boolean;
  references_iso22301?: boolean;
  public_redacted_version?: boolean;
  // Pipeline-derived.
  flags_present_count?: number;
  has_deep?: boolean;
  benchmark_present?: number | null;
  benchmark_band?: string | null;
}

/** One row of data/institutions.json. */
export interface Institution {
  institution_id: string;
  institution_name: string;
  state: string;
  city?: string | null;
  control: string;
  institution_type: string;
  system_affiliation?: string | null;
  enrollment?: number | null;
  plan_count: number;
  plan_ids: string[];
  best_verification: string;
  most_recent_year?: number | null;
}

/** One notable design decision captured from a deep-coded plan (verbatim quote). */
export interface UnusualDecision {
  decision: string;
  quote: string;
}

/** One record of data/deep_analysis.json (the full-text-coded plans). */
export interface DeepRecord {
  plan_id: string;
  read_confidence: string;
  organizing_structure_confirmed?: string;
  coop_treatment?: CoopTreatment | string;
  benchmark_missing: string[];
  essential_functions?: string[];
  rto_tiers?: string | null;
  succession_depth?: string | null;
  alternate_facility_model?: AlternateFacilityModel | string;
  vital_records_approach?: string | null;
  tte_cadence?: string | null;
  devolution_treatment?: string | null;
  reconstitution_treatment?: string | null;
  academic_continuity_treatment?: string | null;
  it_continuity_treatment?: string | null;
  interdependencies_treatment?: string | null;
  unusual_decisions?: UnusualDecision[];
  analyst_notes?: string;
  date_coded?: string;
  benchmark_present: number;
  benchmark_band?: string;
  // Joined in at load time (NOT present in the deep source; see data.ts).
  institution_name?: string;
}

/** data/stats.json (pre-computed aggregates). Nested totals{} + deep{} blocks. */
export interface Stats {
  generated_from: string;
  totals: {
    plans: number;
    institutions: number;
    states_covered: number;
    opened_and_confirmed: number;
    link_only: number;
    deep_coded: number;
    mean_benchmark: number;
  };
  by_state: Record<string, number>;
  by_institution_type: Record<string, number>;
  by_control: Record<string, number>;
  by_plan_type: Record<string, number>;
  by_document_type: Record<string, number>;
  by_organizing_structure: Record<string, number>;
  by_verification: Record<string, number>;
  by_file_format: Record<string, number>;
  framework_flags: Record<string, number>;
  deep: {
    deep_coded: number;
    discovery_only: number;
    mean_benchmark: number;
    score_band_distribution: Record<string, number>;
    mean_by_document_type: Record<string, { n: number; mean: number }>;
    mean_by_organizing_structure: Record<string, { n: number; mean: number }>;
  };
}

/** Slim record emitted by web/scripts/prepare-data.mjs for the client. */
export interface SlimPlan {
  plan_id: string;
  institution_name: string;
  state: string;
  city: string | null;
  control: string | null;
  institution_type: string | null;
  system_affiliation: string | null;
  plan_type: string | null;
  document_type: string | null;
  source_url: string | null;
  landing_page_url: string | null;
  file_format: string | null;
  published_revised: string | null;
  version: string | null;
  framework_alignment: string | null;
  organizing_structure: string | null;
  recency_year: number | null;
  evidence_quote: string | null;
  verification: string | null;
  catalog_notes: string | null;
  flags_present_count: number | null;
  benchmark_present: number | null;
  benchmark_missing: string[];
  benchmark_band: string | null;
  // Deep fields present only on deep-coded records (used by the compare view).
  unusual?: UnusualDecision[];
  coop_treatment?: string | null;
  alternate_facility_model?: string | null;
  essential_functions?: string[];
}
