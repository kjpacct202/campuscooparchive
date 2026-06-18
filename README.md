# Campus COOP Archive

**An open, fully sourced catalog of US college & university *continuity* plans —
read, scored, and free to download.**

The Campus COOP Archive catalogs publicly published **continuity** documents from
US colleges and universities — Continuity of Operations Plans (COOP), Business
Continuity Plans/Programs (BCP), Continuity Plans, Continuity of Instruction /
Academic Continuity plans, and IT Disaster Recovery / IT Continuity plans. Every
record links to its primary source and a verbatim evidence quote; a growing
subset is read in full and scored against a **22-component continuity
benchmark** synthesized from FCD 1, FCD 2, the FEMA Continuity Guidance Circular,
NIST SP 800-34, ISO 22301, and NFPA 1600.

It is an exact sibling of:
- **Campus Alert Archive** — campusalertarchive.com (the structure, tone, and
  verifiability ethos this project inherits)
- **The Higher Ed EOP Atlas** — campus-eop-archive.vercel.app (the direct
  template; this project mirrors its data pipeline and website shape, swapping
  *emergency operations* for *continuity*)

## The non-negotiable standard

> **Every datapoint is traceable to a primary source a skeptic can check.**

Every plan record carries `source_url` (a direct link on an official host),
`landing_page_url`, `date_accessed`, a verbatim `evidence_quote`, and a
`verification` badge — `opened-and-confirmed` (the document/page was actually
rendered and the quote read directly) or `link-only` (the URL resolves on an
official host but the bytes weren't personally rendered). **No URL or quote is
ever invented.** Source documents are linked, not redistributed.

## The archive at a glance (this build)

| | |
|--|--|
| Plans cataloged | **210** |
| Institutions | **207** |
| States + DC | **47 + DC** (48; gaps: HI, ME, WY) |
| Opened & confirmed | **175** (83%) |
| Deep-coded in full | **40** |
| Mean benchmark | **13.1 / 22** |

Top exemplars (22/22): **CSU Bakersfield**, **University of Houston–Downtown**.
See `reports/DEEP_ANALYSIS.md` for the full breakdown.

## Repository structure

```
README.md                  this file — overview + suggested website shape
CLAUDE.md                  project brief for the Claude Code build session
CHANGELOG.md               session-by-session log
HANDOFF.md                 what's done + exactly what's left (web app, git, Vercel)
data/
  raw/*.json               unmodified discovery output, one file per research lane (provenance)
  plans.json / plans.csv   master: one row per plan, all fields + derived flags + document_type
  institutions.json / .csv one row per institution
  deep_analysis.json       full-text-coded records (benchmark score, inventories, notable decisions w/ quotes)
  deep/batch_*.json        intermediate deep-analysis batches
  stats.json               pre-computed aggregates
schema/
  plan.schema.json         JSON Schema for a plan record
  field_dictionary.md      every field, type, description
  taxonomies.md            controlled vocabularies
docs/
  METHODOLOGY.md           inclusion rules + verification standard
  CONTINUITY_BENCHMARK.md  the 22-component benchmark, fully cited
  CODING_GUIDE.md          how to add records + deep schema + a ready-to-run agent prompt
  COVERAGE_TRACKER.md      coverage map + gaps + prioritized next steps
reports/
  TRENDS_REPORT.md         cross-plan analysis (whole corpus)
  DEEP_ANALYSIS.md         deep analysis against the benchmark
scripts/
  build_dataset.py         data/raw -> plans/institutions/stats   (pure py3, idempotent)
  merge_deep.py            data/deep -> deep_analysis.json (validate + score)
  build_dashboard.py       -> site/index.html (self-contained offline prototype)
  check_links.py           verify every catalogued URL still resolves
site/
  index.html               offline interactive prototype (search, filter, evidence, charts, export)
```

## Rebuild the dataset & prototype

Pure Python 3 standard library — no dependencies, no build step:

```bash
python3 scripts/build_dataset.py     # base dataset
python3 scripts/merge_deep.py        # deep layer
python3 scripts/build_dataset.py     # re-run to fold deep scores in
python3 scripts/build_dashboard.py   # regenerate site/index.html
python3 scripts/check_links.py --dry # URL inventory (drop --dry to check live)
```

Then open `site/index.html` in any browser.

## Suggested website shape (mirror the EOP Atlas)

The production site (a later Next.js → Vercel build — see `HANDOFF.md`) should
mirror `campus-eop-archive.vercel.app` page-for-page, re-themed for continuity:

- **Home** — hero, "archive at a glance" stat band, the bigger idea, how it
  works (browse / download / analyze with your AI), featured 22/22 exemplars.
- **Browse** — every plan, searchable and multi-filterable (state, control,
  institution type, plan type, document type, organizing structure, recency,
  verification, deep-only), with ⌘K jump-to-institution. *(Prototyped in
  `site/index.html`.)*
- **Plan detail** — identity, the verbatim evidence quote, source + official
  links, overview fields, and (if deep-coded) the benchmark panel: present vs.
  missing components, essential-functions inventory, RTO tiers, succession depth,
  alternate-facility model, COOP treatment, notable decisions with quotes, and
  analyst notes.
- **Institutions** — full roster (207) across 47 states + DC.
- **Compare** — up to four plans side-by-side across the 22 components.
- **Benchmark** — the 22-component standard, fully cited (`docs/CONTINUITY_BENCHMARK.md`).
- **Statistics** — the aggregates in `data/stats.json`.
- **Insights / Wisdom** — narrative findings (`reports/`) + a notable-decisions
  gallery from `data/deep_analysis.json`.
- **Methodology** — `docs/METHODOLOGY.md`.
- **Download** — CSV / JSON / Excel export of the whole archive or a filtered slice.

## Provenance & ethos

Discovery was run as parallel research lanes (by region and by institution type);
each lane's unmodified output is preserved in `data/raw/` for provenance. The
project is AI-assisted but every record is independently checkable via its
`source_url`. This is a research index and analysis layer over publicly
available material.
