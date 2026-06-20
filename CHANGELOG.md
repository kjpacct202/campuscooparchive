# Changelog

All notable changes to the Campus COOP Archive data foundation. Newest first.

## Session 3 — 2026-06-19 — Premium redesign (sister to the Campus Alert Archive)

Re-skinned the website to the Campus Alert Archive design language so the two
read as siblings, re-accented teal for continuity. All on branch
`feat/premium-redesign`; pure static export preserved.

### Added — design system & dark mode
- Tailwind 3.4 with CSS-variable design tokens (light + dark), a distinct COOP
  **teal accent**, Geist + **Fraunces** (editorial headlines), shadcn/ui
  primitives (button, dialog, dropdown-menu) on Radix.
- First-class **dark mode** (next-themes, system default, persistent toggle);
  every existing page inherits it through a legacy-variable bridge.
- `enhance.css` motion layer: hero aurora, gradient-text keyword, scroll-reveal
  (`RevealController`), hover-lift, tasteful `EasterEggs` (Konami / confetti /
  `g`-nav); all reduced-motion-safe. Glass sticky `Header` + richer `Footer`.

### Added — features
- **StateCoverageMap** cartogram on Statistics (+ screen-reader data table);
  `Sparkline` and `AnimatedStat` components.
- A dedicated **/search/** page (token full-text over institutions, metadata,
  and verbatim quotes; reads `?q=`/`?state=`).
- Real **xlsx + PDF** exports (lazy-loaded `xlsx` / `jspdf`) plus CSV/JSON via an
  `ExportMenu` + confirm dialog, on Browse and Search.
- Build-time **OG image**, **PWA manifest**, **JSON-LD**, theme-color.
- Six new pages: privacy, terms, disclaimer, accessibility, contribute, contact
  (static, GitHub-routed). A **CiteCard** (APA / MLA / BibTeX) on plan detail.
- Re-ran the em-dash cleanup so the branch ships em-dash-free.

## Session 2 — 2026-06-17 — Public website (Next.js → Vercel)

Built the public website in `web/`, mirroring the Higher Ed EOP Atlas page-for-page
and re-themed for continuity. Consumes `data/*.json` only; the Python pipeline
remains the single source of truth. (See `HANDOFF.md` Task 1.)

### Added — web app (`web/`)
- **Next.js 14 (App Router) static export** (`output: "export"`) cloned from the
  EOP Atlas and adapted: 22-component continuity benchmark (was the 24-point
  federal benchmark), COOP plan/deep/stats field shapes, nested `stats.json`.
- **Pages:** narrative home (stat band from `stats.totals`, featured 22/22
  exemplars CSU Bakersfield + UH–Downtown), Browse (search + 8 filters +
  deep-only + sort + CSV/JSON/Excel export), per-plan & per-institution detail
  (verbatim quote + source links + verification badge; graceful deep panel),
  Statistics, the cited Continuity Benchmark, Insights + notable-decisions
  gallery, Chapters, Compare (across the 22 components), Wisdom, Downloads
  (whole-dataset CSV/JSON/Excel + everything-bundle + data dictionary + AI
  prompt-starters), Methodology, About. ⌘K palette, sitemap/robots, per-page
  metadata.
- **Node prebuild** (`web/scripts/prepare-data.mjs`, `build-downloads.mjs`)
  derives the client search payload + download artifacts from `data/` at build
  time; never mutates the masters.
- **Deploy config:** `next.config.mjs` (export, trailingSlash, images.unoptimized,
  `@`→`src` webpack alias), `web/vercel.json` (framework: null → serves `out/`),
  `.nvmrc` = 20.
- Verifiability-first preserved: every plan view shows `evidence_quote`,
  `source_url`, `landing_page_url`, and the verification badge.

### Repo
- `git init` → committed the whole monorepo (data foundation + `web/`) and
  pushed to `git@github.com:kjpacct202/campuscooparchive.git`. Ready for Vercel
  import (Root Directory = `web`).

## Session 1 — 2026-06-17 — Data & analysis foundation (initial build)

Built the entire data-and-analysis foundation from scratch, modeled exactly on
the Higher Ed EOP Atlas and inheriting the Campus Alert Archive verifiability
ethos. (The Next.js website, git, and Vercel deploy are intentionally left for a
later Claude Code session — see `HANDOFF.md`.)

### Added — framework & schema
- **`docs/CONTINUITY_BENCHMARK.md`** — the 22-component continuity benchmark, the
  COOP analog of the EOP Atlas's 24-point standard. Synthesized and cited from
  verified primary sources: FCD 1 (2017), FCD 2 (2017), FEMA Continuity Guidance
  Circular (2018), NIST SP 800-34 Rev. 1, ISO 22301:2019, NFPA 1600 (2019), plus
  higher-ed academic-continuity practice. Defines the exact 22 `benchmark_missing`
  keys.
- **`schema/`** — `plan.schema.json` (JSON Schema), `field_dictionary.md`,
  `taxonomies.md` (controlled vocabularies incl. the `document_type` classifier:
  full-coop / business-continuity-framework / department-level / academic-continuity
  / it-dr / template).

### Added — discovery (data/raw/)
- Ran a **seed pass** (3 institutions personally verified: FSU, Central Georgia
  Technical College, Appalachian State) to lock the record format.
- Ran an **8-lane regional discovery fleet** (West/Pacific, Southwest, Deep
  South, Upper South, Mid-Atlantic, New England, Midwest-East, Plains/Mountain),
  then a **3-lane gap-fill fleet** (under-covered states; community & technical
  colleges; minority-serving institutions — HBCUs, tribal, HSIs).
- Result: **214 raw records** across 12 lane files, each with a real source URL
  and verbatim evidence quote; unmodified per-lane output preserved for
  provenance.

### Added — master dataset
- **`scripts/build_dataset.py`** — dedupes (by `source_url`), normalizes enums,
  derives flags + `institution_id`, builds institutions and stats. Idempotent.
- Output: **210 plans**, **207 institutions**, **47 states + DC**,
  **175 opened-and-confirmed (83%)**, 35 link-only. Files: `plans.json/csv`,
  `institutions.json/csv`, `stats.json`.

### Added — deep-analysis layer
- **`scripts/merge_deep.py`** — validates the 22 benchmark keys, scores
  (`22 − len(benchmark_missing)`), writes `deep_analysis.json`. Idempotent.
- **40 plans read in full and coded** (4 batches incl. one coded directly).
  Mean **13.1/22**, range 1–22, **101 notable design decisions** captured with
  verbatim quotes. Top exemplars: CSU Bakersfield 22/22, UH–Downtown 22/22.
- Key finding: **devolution is missing in 95% of deep-coded plans**; succession
  (63% missing) and delegations of authority (75% missing) are the weakest FCD
  pillars; essential functions and continuity personnel are near-universal.

### Added — prototype & QA
- **`scripts/build_dashboard.py`** → **`site/index.html`**, a self-contained
  offline interactive prototype (search, 8 filters, deep-only toggle, per-plan
  evidence + source links, live charts, CSV/JSON export). 633 KB, no network.
- **`scripts/check_links.py`** — URL resolver/QA (stdlib urllib; `--dry`,
  `--limit`, `--delay`). Inventory: 416 unique URLs across 233 hosts.

### Added — docs & reports
- `docs/METHODOLOGY.md`, `docs/CODING_GUIDE.md` (incl. ready-to-run agent
  prompt), `docs/COVERAGE_TRACKER.md`.
- `reports/TRENDS_REPORT.md` (whole-corpus), `reports/DEEP_ANALYSIS.md` (the 40).
- `README.md`, `CLAUDE.md`, `HANDOFF.md`.

### Known gaps (carried to COVERAGE_TRACKER.md / HANDOFF.md)
- No verifiable public continuity document found for **HI, ME, WY**.
- 35 `link-only` records to upgrade; `texas-tech-university-system` and
  `university-of-maryland-baltimore` deep records to re-source.
- Community/technical, liberal-arts, and tribal colleges under-represented vs.
  population share.
