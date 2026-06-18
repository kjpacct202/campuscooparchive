# Taxonomies — controlled vocabularies

All categorical fields draw from these closed lists. Adding a value requires
adding it here first so the pipeline and website stay aligned.

## `state`
USPS two-letter codes for the 50 states **plus `DC`**. Non-US institutions are
out of scope.

## `control`
| value | meaning |
|---|---|
| `public` | State/locally controlled public institution or system |
| `private-nonprofit` | Independent/private not-for-profit |
| `private-for-profit` | Proprietary institution |

## `institution_type`
| value | notes |
|---|---|
| `R1 university` | Doctoral, very high research (Carnegie) |
| `R2 university` | Doctoral, high research |
| `regional public university` | Master's/regional comprehensive public |
| `community college` | Public two-year |
| `technical college` | Public technical/vocational two-year |
| `liberal arts college` | Primarily-baccalaureate private |
| `HBCU` | Historically Black College or University |
| `HSI` | Hispanic-Serving Institution (when that is the salient identity) |
| `tribal college` | Tribal College or University (TCU) |
| `system office` | System/district central office (multi-campus) |
| `religiously affiliated university` | Faith-affiliated, when salient |
| `specialized institution` | Medical, art, music, maritime, military, etc. |
| `other public` | Public not fitting above |
| `other private` | Private not fitting above |

> An institution can hold several identities (e.g., an HBCU that is also an R2).
> Pick the **most salient** type for filtering; note the rest in `catalog_notes`.

## `plan_type` (genre label)
| value |
|---|
| `Continuity of Operations Plan (COOP)` |
| `Business Continuity Plan (BCP)` |
| `Business Continuity Program` |
| `Continuity Plan` |
| `Continuity of Instruction / Academic Continuity Plan` |
| `IT Disaster Recovery Plan` |
| `IT Continuity Plan` |
| `Continuity of Operations Guide/Template` |

## `document_type` (structural classifier — used to score fairly)
| value | meaning | benchmark expectation |
|---|---|---|
| `full-coop` | Institution-wide COOP/continuity plan | Full 22-component exposure |
| `business-continuity-framework` | Program/framework/policy that governs unit BCPs | Strong on program elements; lighter on operational annexes |
| `department-level` | A single unit/department continuity plan or completed template | Narrow scope; many components legitimately N/A |
| `academic-continuity` | Continuity of instruction / academic continuity plan | Strong on `academic_instructional_continuity`; light elsewhere |
| `it-dr` | IT disaster-recovery / system-contingency plan | Strong on `it_disaster_recovery`, RTO/RPO; light elsewhere |
| `template` | Blank/sample template published by the institution for its own units | Structure only; content N/A |

> Mirrors the EOP Atlas's separation of "full plan / base-plan-only / guide /
> vendor template," adapted to the continuity genres named in the project scope.

## `organizing_structure`
How the plan is architected. (Exact values required by the project spec.)
| value | meaning |
|---|---|
| `essential-functions-based` | Built around essential/critical functions & their recovery |
| `FCD-element-based` | Built around the FCD 1 continuity elements (succession, delegations, vital records, …) |
| `phase-based` | Built around the four continuity phases (readiness/activation/operations/reconstitution) |
| `departmental` | Built as a roll-up of department/unit plans |
| `unclear` | Cannot be determined from the captured text |

## `verification`
| value | meaning |
|---|---|
| `opened-and-confirmed` | The document or its official page was actually rendered and the `evidence_quote` read directly from it |
| `link-only` | The URL resolves on an official host and title/quote are confirmed via a search index or landing page, but the document bytes were not personally rendered |

## `file_format`
`PDF` · `HTML` · `DOCX` · `other`

## Deep-analysis enumerations (see `docs/CODING_GUIDE.md`)
- `benchmark_missing[]` — any of the **22 benchmark keys** (see `docs/CONTINUITY_BENCHMARK.md`).
- `organizing_structure_confirmed` — same five values as `organizing_structure`, set from full-text reading.
- `coop_treatment` — `integrated` (continuity inside a broader plan) · `separate` (standalone continuity doc) · `program` (governs unit plans) · `na`.
- `alternate_facility_model` — `physical-alternate-site` · `telework-distributed` · `reciprocal-mutual-aid` · `cloud-hosted` · `multiple` · `none-stated`.
