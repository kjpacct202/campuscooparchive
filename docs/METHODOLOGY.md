# Methodology & verification standard

The Campus COOP Archive catalogs real, publicly published **continuity** plans
from US colleges and universities and analyzes their structure and content. It
inherits the core principle of its sibling projects — the **Campus Alert
Archive** and the **Higher Ed EOP Atlas**:

> **Every datapoint is traceable to a primary source that any skeptic can check.**

## What qualifies for inclusion

A record must be a specific US institution's (or system's) **own** publicly
accessible continuity plan or program document. Accepted genres:

- **Continuity of Operations Plan (COOP)**
- **Business Continuity Plan / Program (BCP)**
- **Continuity Plan**
- **Continuity of Instruction / Academic Continuity** plan
- **IT Disaster Recovery / IT Continuity** plan

Explicitly **excluded**: blank consultant/vendor samples (with one exception —
see below); another entity's plan; K-12 district plans; news articles and slide
decks; single-building fire-evacuation sheets; pure Emergency Operations Plans
(EOPs) that merely *mention* continuity without a continuity section or plan
(those belong to the EOP Atlas); and pages that merely reference a plan without a
public document. **Non-US institutions are out of scope.**

**Template exception.** A blank/sample template *published by the institution
itself for its own units* (e.g., a university's downloadable unit-COOP template)
**is** included, classified `document_type = template`. A generic consultant
template hosted by a vendor is not.

## The `document_type` classifier

Public continuity documents vary enormously in scope, so each record carries a
structural classifier that lets analysts score fairly:
`full-coop`, `business-continuity-framework`, `department-level`,
`academic-continuity`, `it-dr`, `template` (see `schema/taxonomies.md`). A
3-page IT-DR plan and a 100-page institutional COOP should not be compared
head-to-head on the full 22-point benchmark; the classifier makes the
document-scope artifact explicit.

## How each record is verified

Every record carries five verification fields:

- **`source_url`** — a direct link to the document (PDF/HTML/DOCX) on an
  official institutional host, or the plan page itself for HTML plans.
- **`landing_page_url`** — the official page that hosts or links the document.
- **`evidence_quote`** — a short **verbatim** excerpt from the document or its
  official hosting page (typically the title block, a promulgation line, a
  scope statement, or a framework-adoption sentence) proving the document is
  what we say it is. **Never invented.**
- **`date_accessed`** — the ISO date the record was checked.
- **`verification`** — the badge below.

### Verification badges

- **`opened-and-confirmed`** — a researcher loaded the document or its official
  page and read the evidence quote directly from it. **175 of 210** records
  (83%) carry this badge.
- **`link-only`** — the direct URL resolves on an official host and the
  title/quote are confirmed via a search index or landing page, but the
  document bytes were not personally rendered (usually a transient fetch limit
  or a viewer that blocks text extraction). **35 of 210** records. These are
  honest placeholders to be upgraded on a future pass; `check_links.py`
  re-confirms they still resolve.

## Honesty about derived analytic flags

The 17 boolean flags on each plan record (identifies essential functions, BIA,
orders of succession, RTO, devolution, references FCD 1, etc.) are, **at the
discovery stage, conservative lower bounds** — set true only where the brief
captured text shows them, not from a full read of the plan body. Nearly every
real COOP defines essential functions, but a flag only fires where the captured
evidence shows it. The **deep-analysis layer** (40 plans read end-to-end)
supersedes these with full-text-verified values, the 22-component benchmark
score, and a verbatim quote behind every notable claim.

## Scoring: the 22-component continuity benchmark

Deep-coded plans are scored against the benchmark synthesized from FCD 1, FCD 2,
the FEMA Continuity Guidance Circular, NIST SP 800-34 Rev. 1, ISO 22301, and
NFPA 1600 (see `docs/CONTINUITY_BENCHMARK.md`):

> `benchmark_present = 22 − (count of distinct valid keys in benchmark_missing)`

A component is coded present only when the text shows it clearly enough to
support a verbatim quote; when in doubt it is recorded missing. Scores are
therefore conservative, and low scores on narrow document types
(`it-dr`, `academic-continuity`, `template`) are largely scope artifacts.

## Known limitations

- **Survivorship bias toward transparency.** The dataset captures institutions
  that *publish* their continuity plans. Continuity documents are published far
  less often than EOPs (which Clery effectively compels), and many institutions
  — especially elite privates and several state systems — keep COOPs internal or
  treat them as security-sensitive (e.g., Florida's public-records exemption).
  Their absence here is **not** evidence they lack a plan.
- **State-mandate effect.** Coverage skews toward states whose continuity
  mandates drive publication (e.g., Florida, Virginia, the Technical College
  System of Georgia, the North Carolina Community College System). Three states
  (HI, ME, WY) yielded no verifiable public institution-owned continuity
  document at time of access and are open gaps (see `docs/COVERAGE_TRACKER.md`).
- **Currency.** Some posted plans are several years old; we record the most
  recent public version and the date as stated.
- **Public ≠ complete.** A public copy may be redacted or a base-plan-only
  release; `public_redacted_version` and `document_type` flag this.
- **AI-assisted compilation.** Discovery and coding were AI-assisted with a
  hard verbatim-quote requirement; every record is independently checkable via
  its `source_url`.

## Use and attribution

Source documents remain the work of their respective institutions and are
**linked, not redistributed**. This catalog is a research index and analysis
layer over publicly available documents.
