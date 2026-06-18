# Trends report — the shape of campus continuity planning

*Cross-plan analysis of the full catalog. Generated 2026-06-17 from
`data/plans.json` / `data/stats.json` (n = 210 plans, 207 institutions, 47
states + DC). Discovery-stage framework flags are **conservative lower bounds**;
the deep layer (see `reports/DEEP_ANALYSIS.md`) reports full-text-verified
values for the 40 plans read end-to-end.*

## Headline

US colleges publish continuity material far less consistently than they publish
emergency operations plans — and when they do, it is more often a **program web
page** than a downloadable plan. Of 210 catalogued records, **136 are HTML**
pages and only **70 are PDFs** (4 DOCX). That inverts the EOP world (where the
Higher Ed EOP Atlas is ~90% PDF) and is itself a finding: continuity is
frequently presented as an *ongoing program* (a process units opt into) rather
than a *finished document*.

## What gets published, by genre

| `document_type` | plans | what it is |
|---|--:|---|
| business-continuity-framework | 123 | a program/policy that governs unit BCPs |
| full-coop | 31 | an institution-wide COOP/continuity plan |
| template | 18 | the institution's own unit-plan template |
| academic-continuity | 14 | continuity of instruction / academic continuity |
| it-dr | 14 | IT disaster recovery / system contingency |
| department-level | 10 | a single unit's continuity plan |

By the plan's own label, **COOP (82)** and **Business Continuity Plan/Program
(71)** dominate, with a long tail of academic-continuity (13), IT-DR/continuity
(13), and institution-published templates (13).

The publication pattern says a lot about governance: the single most common
artifact is a **framework/policy that pushes the actual plan down to
departments**. Continuity is widely treated as a distributed, unit-owned
capability coordinated by a central office — not a single central binder.

## Who publishes

By control, the catalog is **172 public / 38 private-nonprofit** — public
institutions publish continuity material far more readily, consistent with state
continuity mandates and open-records norms. By Carnegie-ish type, **R1
universities (91)** lead, followed by regional publics (36) and R2s (14). The
project deliberately reached minority-serving and two-year institutions: **12
HBCUs, 11 HSIs, 11 community colleges, 8 system offices, 3 technical colleges,
and 3 tribal colleges** are represented.

## Where it is published

Top states: **CA 21, TX 19, MA 12, NC 11, VA 11, NY 10, FL 9, GA 8, OH 7**.
Coverage tracks transparency drivers more than raw enrollment: Virginia's
state-agency COOP mandate (VDEM), Florida's statutory COOP requirement, the
Technical College System of Georgia (which requires an annually-submitted BCP of
each college), and the North Carolina Community College System all surface
clusters of publicly posted plans. **47 states + DC** are covered; **HI, ME, and
WY** yielded no verifiable public institution-owned continuity document at time
of access (see `docs/COVERAGE_TRACKER.md`).

## How plans are organized

| `organizing_structure` | plans |
|---|--:|
| essential-functions-based | 115 |
| departmental | 49 |
| phase-based | 24 |
| unclear | 13 |
| FCD-element-based | 9 |

The essential-functions logic of FCD 2 / the FEMA CGC has clearly won as the
organizing spine of campus continuity planning — more than half of all plans are
built around identifying and recovering essential functions. The "departmental"
cluster reflects the framework-plus-unit-plans model above.

## What the plans contain (discovery-stage lower bounds, n = 210)

| signal | plans | % |
|---|--:|--:|
| identifies essential functions | 183 | 87% |
| continuity communications | 102 | 49% |
| tests/training/exercises | 92 | 44% |
| addresses IT disaster recovery | 84 | 40% |
| reconstitution | 80 | 38% |
| alternate facilities | 71 | 34% |
| addresses academic continuity | 70 | 33% |
| business impact analysis | 52 | 25% |
| vital records | 47 | 22% |
| defines RTO/RPO | 42 | 20% |
| orders of succession | 41 | 20% |
| delegations of authority | 29 | 14% |
| **devolution** | **3** | **1.4%** |
| references FCD 1 | 3 | 1% |
| references ISO 22301 | 1 | <1% |
| references NIST SP 800-34 | 0 | 0% |
| public/redacted version flagged | 2 | 1% |

Two patterns jump out even at the discovery stage:

1. **Essential functions are nearly universal; the FCD "continuity pillars" are
   not.** Succession (20%), delegations of authority (14%), and especially
   **devolution (1.4%)** are rare. Campuses know *what* must keep running but far
   fewer pre-wire *who takes over and from where* if leadership or a site is lost.
2. **Plans rarely cite their doctrine.** Almost no public plan names FCD 1, NIST
   800-34, or ISO 22301 in the captured text. The doctrine is clearly absorbed
   (the vocabulary is everywhere) but seldom credited — which is exactly why a
   benchmark that scores *function* rather than *citation* is the right lens.

## Verifiability

**175 of 210 (83%)** records are `opened-and-confirmed` — a researcher rendered
the document or its official page and copied the evidence quote directly. The
remaining **35** are `link-only`: the URL resolves on an official host and the
quote comes from the landing page or search index, pending a future render.
`scripts/check_links.py` re-confirms all 416 catalogued URLs across 233 hosts.

## How to read this

These whole-corpus signals are intentionally conservative. For full-text-verified
structure, scores, and the most-missing components, see
`reports/DEEP_ANALYSIS.md`, and explore the data interactively in
`site/index.html` (search, filter, per-plan evidence, live charts, CSV/JSON
export).
