# HANDOFF — what's done & what's left

**Prepared 2026-06-17.** This hands the project from the data-foundation session
to a later **Claude Code** session whose job is the **website + deployment**.

---

## TL;DR

The entire **data-and-analysis foundation is complete and verified**. Two things
remain, both intentionally left for Claude Code:

1. **Build the Next.js website** mirroring the Higher Ed EOP Atlas
   (`campus-eop-archive.vercel.app`), re-themed for continuity, consuming the
   JSON in `data/`.
2. **`git init` → push to `git@github.com:kjpacct202/campuscooparchive.git`**,
   then **import to Vercel** and deploy.

Nothing else is blocking. The dataset, benchmark, deep-analysis layer, pipeline
scripts, offline prototype, docs, and reports are all built and run clean.

---

## Coverage stats (this build)

| metric | value |
|---|---|
| Plans cataloged | **210** |
| Institutions | **207** |
| States + DC | **47 + DC** (gaps: HI, ME, WY) |
| Opened-and-confirmed | **175 (83%)** |
| Link-only | 35 |
| Deep-coded (full read, scored) | **40** |
| Mean benchmark | **13.1 / 22** |
| Notable decisions captured (with quotes) | **101** |
| Unique URLs / hosts | 416 / 233 |

Institution-type spread: R1 91, regional public 36, R2 14, HBCU 12, HSI 11,
community college 11, religiously affiliated 9, specialized 8, system office 8,
technical 3, tribal 3, liberal arts 2. Document types: business-continuity-
framework 123, full-coop 31, template 18, academic-continuity 14, it-dr 14,
department-level 10.

---

## What's DONE (don't redo)

- ✅ **22-component continuity benchmark**, fully cited — `docs/CONTINUITY_BENCHMARK.md`.
- ✅ **Schema** — `schema/plan.schema.json`, `field_dictionary.md`, `taxonomies.md`.
- ✅ **Discovery** — 12 lane files in `data/raw/` (provenance preserved).
- ✅ **Master dataset** — `data/plans.json/csv`, `institutions.json/csv`, `stats.json`.
- ✅ **Deep layer** — `data/deep/batch_*.json` → `data/deep_analysis.json` (40 scored).
- ✅ **Pipeline** — `scripts/build_dataset.py`, `merge_deep.py`, `build_dashboard.py`,
  `check_links.py` (pure Python 3, idempotent, all run clean).
- ✅ **Offline prototype** — `site/index.html` (the behavior reference for the UI).
- ✅ **Docs & reports** — METHODOLOGY, CODING_GUIDE, COVERAGE_TRACKER, TRENDS_REPORT,
  DEEP_ANALYSIS, README, CLAUDE, CHANGELOG.

---

## TASK 1 — Build the Next.js website (mirror the EOP Atlas)

**Goal:** reproduce `campus-eop-archive.vercel.app` page-for-page, re-themed for
*continuity*, reading the JSON in `data/`. The offline `site/index.html` already
demonstrates the core browse/filter/evidence/export behavior and the exact data
shape — use it as the functional reference.

**Recommended stack:** Next.js (App Router) + static export (`output: 'export'`)
so it deploys to Vercel as a static site, exactly like the EOP Atlas. Load the
JSON at build time from `data/`. Add a client-side search index (e.g. a tiny
`⌘K` fuzzy search over `plans.json`).

**Pages / routes to build (mirror the EOP Atlas sitemap):**
- `/` — hero + "archive at a glance" stat band (from `data/stats.json`) + how it
  works (browse / download / analyze with your AI) + featured 22/22 exemplars.
- `/browse/` — searchable, multi-filterable list (state, control, institution
  type, plan type, document type, organizing structure, recency, verification,
  deep-only). Behavior is prototyped in `site/index.html`.
- `/plans/<plan_id>/` — plan detail: identity, verbatim evidence quote, source +
  official links, overview fields, and (if `has_deep`) the benchmark panel:
  present vs. missing components, essential-functions inventory, RTO tiers,
  succession depth, alternate-facility model, COOP treatment, notable decisions
  with quotes, analyst notes. (Join `deep_analysis.json` on `plan_id`.)
- `/institutions/` and `/institutions/<institution_id>/` — roster + per-institution.
- `/compare/` — up to four plans side-by-side across the 22 components.
- `/benchmark/` — render `docs/CONTINUITY_BENCHMARK.md` (the 22 components + cited sources).
- `/statistics/` — charts from `data/stats.json` (incl. the `deep` section).
- `/insights/` + `/insights/notable-decisions/` — narrative from `reports/` + a
  gallery built from every `unusual_decisions` entry in `deep_analysis.json`.
- `/wisdom/` — best transferable lessons (each backed by a quote).
- `/methodology/` — render `docs/METHODOLOGY.md`.
- `/downloads/` — CSV/JSON/Excel of the whole archive or a filtered slice + AI
  prompt-starters (mirror the EOP Atlas Download page).
- `/about/` — "how this was built"; credit Campus Alert Archive + EOP Atlas.

**Branding:** title "Campus COOP Archive", tagline "An open, fully sourced
catalog of US college & university continuity plans." Eyebrow "A Campus Alert
Archive project." Keep the EOP Atlas's clean, minimal aesthetic.

**Data contract for the site:** read `data/plans.json` (rows), `data/stats.json`
(aggregates), `data/deep_analysis.json` (keyed by `plan_id` for detail pages).
Field meanings are in `schema/field_dictionary.md`. Regenerate everything with
the pipeline in `CLAUDE.md` before building.

**Verifiability in the UI (non-negotiable):** every plan view must show its
`verification` badge, the verbatim `evidence_quote`, and both the `source_url`
and `landing_page_url`. Never present a datapoint without its source. State that
source documents are linked, not redistributed.

---

## TASK 2 — git + Vercel

```bash
cd "<this repo>"
git init
git add .
git commit -m "Campus COOP Archive — data foundation + Next.js site"
git branch -M main
git remote add origin git@github.com:kjpacct202/campuscooparchive.git
git push -u origin main
```

Then in Vercel: **Import** the `kjpacct202/campuscooparchive` repo, framework
preset **Next.js**, build as configured (static export), and deploy. Add a custom
domain later if desired (the EOP Atlas runs on a `vercel.app` subdomain).

Suggested `.gitignore`: `node_modules/`, `.next/`, `out/`, `.DS_Store`,
`data/deep/pdfs/`, `data/deep/txt/` (if any local PDF caches were created).
Commit all of `data/` (it's the product) and `site/index.html`.

---

## Recommended polish before/after launch (optional, from COVERAGE_TRACKER.md)

- Fill the three missing states (HI, ME, WY) and upgrade the 35 `link-only`
  records to `opened-and-confirmed`.
- Re-source `texas-tech-university-system` (linked URL is a slide deck → scored
  1/22) and `university-of-maryland-baltimore` (deep coding skipped on a 404).
- Deep-code another 40–80 plans toward ~25–30% deep coverage (ready-to-run agent
  prompt in `docs/CODING_GUIDE.md`).
- Run `python3 scripts/check_links.py` **live** (not `--dry`) from the deploy
  environment and drop/re-source any new 404s.

Everything needed to do the above is documented in `CLAUDE.md`,
`docs/CODING_GUIDE.md`, and `docs/COVERAGE_TRACKER.md`.
