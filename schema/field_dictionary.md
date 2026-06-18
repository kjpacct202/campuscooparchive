# Field dictionary — `data/plans.json`

One row per plan. Types and allowed values are enforced by
`schema/plan.schema.json`; controlled vocabularies live in `schema/taxonomies.md`.

## Identity & filters
| field | type | required | description |
|---|---|---|---|
| `plan_id` | string (kebab) | ✓ | Stable slug. Institution slug, suffixed for multiple plans (`-bcp`, `-itdr`, `-academic`). |
| `institution_id` | string (kebab) | – | Institution slug; joins to `institutions.json`. Defaults to `plan_id` base. |
| `institution_name` | string | ✓ | Official institution name. |
| `state` | string (2) | ✓ | USPS code, 50 + DC. |
| `city` | string\|null | – | City. |
| `control` | enum | ✓ | `public` / `private-nonprofit` / `private-for-profit`. |
| `institution_type` | enum | ✓ | See taxonomies. |
| `system_affiliation` | string\|null | – | Parent system/district. |
| `enrollment` | int\|null | – | Approx. total enrollment. |
| `plan_type` | enum | ✓ | Genre label. |
| `document_type` | enum | ✓ | Structural classifier for fair scoring. |
| `organizing_structure` | enum | – | How the plan is architected. |
| `framework_alignment` | string\|null | – | Frameworks the plan cites. |
| `recency_year` | int\|null | – | Most recent public version year. |
| `published_revised` | string\|null | – | As-stated published/revised label. |
| `version` | string\|null | – | Version label. |
| `file_format` | enum | – | `PDF`/`HTML`/`DOCX`/`other` (default `PDF`). |

## Verifiability (the non-negotiable core)
| field | type | required | description |
|---|---|---|---|
| `source_url` | uri | ✓ | Direct link to the document (or HTML plan) on an official host. |
| `landing_page_url` | uri | ✓ | Official page hosting/linking the document. |
| `evidence_quote` | string | ✓ | **Verbatim** excerpt from the document/page. Never invented. |
| `verification` | enum | ✓ | `opened-and-confirmed` / `link-only`. |
| `date_accessed` | date | ✓ | ISO `YYYY-MM-DD`. |
| `catalog_notes` | string\|null | – | Curatorial note. |
| `source_lane` | string\|null | – | Discovery lane / raw file (provenance). |

## Derived continuity flags (booleans, default `false`)
Discovery-stage flags are **conservative lower bounds** — true only where the
captured text shows it. The deep-analysis layer supersedes them with
full-text-verified values + per-claim quotes.

| field | fires when the captured text shows… |
|---|---|
| `identifies_essential_functions` | essential/mission-essential/critical functions identified |
| `business_impact_analysis` | a BIA / business-process analysis |
| `orders_of_succession` | orders of succession for leadership |
| `delegations_of_authority` | pre-delegated authorities |
| `alternate_facilities` | alternate/continuity facilities or telework-as-site |
| `continuity_communications` | resilient continuity communications |
| `vital_records` | vital records & databases protection |
| `defines_rto` | RTO/RPO/MTD or explicit recovery-priority tiers |
| `tt_e_program` | tests/training/exercises program |
| `devolution` | devolution of control to a separate unit/site |
| `reconstitution` | reconstitution / return-to-normal process |
| `addresses_academic_continuity` | continuity of instruction / academic continuity |
| `addresses_it_dr` | IT disaster recovery / system contingency |
| `references_fcd1` | cites FCD 1 / FEMA continuity doctrine |
| `references_nist80034` | cites NIST SP 800-34 |
| `references_iso22301` | cites ISO 22301 |
| `public_redacted_version` | the public copy is explicitly redacted/abridged |

## Build-derived fields (added by `build_dataset.py`, not authored)
| field | description |
|---|---|
| `flags_present_count` | Count of the 17 derived flags that are `true`. |
| `has_deep` | `true` once a deep-analysis record is merged for this `plan_id`. |
| `benchmark_present` | (deep only) `22 − len(benchmark_missing)`. |
| `benchmark_band` | (deep only) `0-4 / 5-9 / 10-14 / 15-19 / 20-22`. |

---

# Field dictionary — `data/institutions.json`
One row per institution (deduped on `institution_id`).

| field | type | description |
|---|---|---|
| `institution_id` | string (kebab) | Slug. |
| `institution_name` | string | Name. |
| `state` | string (2) | USPS code. |
| `city` | string\|null | City. |
| `control` | enum | Control. |
| `institution_type` | enum | Type. |
| `system_affiliation` | string\|null | Parent system. |
| `enrollment` | int\|null | Approx. enrollment. |
| `plan_count` | int | Number of plan records for this institution. |
| `plan_ids` | string[] | The `plan_id`s. |
| `best_verification` | enum | `opened-and-confirmed` if any plan is confirmed. |
| `most_recent_year` | int\|null | Max `recency_year` across its plans. |
