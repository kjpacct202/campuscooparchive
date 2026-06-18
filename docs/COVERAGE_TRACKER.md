# Coverage tracker

*Snapshot 2026-06-17 · 210 plans · 207 institutions · 47 states + DC ·
175 opened-and-confirmed · 40 deep-coded. Regenerate counts any time with
`python3 scripts/build_dataset.py` (writes `data/stats.json`).*

## State coverage (plans per state)

```
CA 21  TX 19  MA 12  NC 11  VA 11  NY 10  FL 9   GA 8   OH 7
IL 6   MD 6   MS 5   PA 5   CO 4   MI 4   RI 4   WI 4
AL 3   AZ 3   CT 3   IN 3   KS 3   KY 3   MN 3   MT 3   NJ 3   SC 3   TN 3   WA 3
AR 2   IA 2   LA 2   MO 2   ND 2   NH 2   OR 2   UT 2   WV 2
AK 1   DC 1   DE 1   ID 1   NE 1   NM 1   NV 1   OK 1   SD 1   VT 1
```

**Missing (priority gaps): `HI`, `ME`, `WY`.** Each was searched in wave 2
(flagships, systems, community colleges) and yielded **no verifiable public
institution-owned continuity document** at time of access — only EOPs that
mention continuity, image-only scans, or internal/non-public plans. These are
genuine transparency gaps, not oversights; re-attempt on the next pass (UH
System EMP is image-only and may OCR; University of Alaska has a program page; UMaine
System and University of Wyoming publish EOPs only).

## Institution-type coverage

```
R1 university 91   regional public 36   R2 university 14   HBCU 12   HSI 11
community college 11   religiously affiliated 9   specialized 8   system office 8
technical college 3   tribal college 3   liberal arts college 2   other 2
```

Reasonably balanced for a first build, with deliberate minority-serving and
two-year representation. **Under-represented vs. their population share:**
community/technical colleges, liberal arts colleges, and tribal colleges.

## Document-type & verification coverage

- `business-continuity-framework` 123 · `full-coop` 31 · `template` 18 ·
  `academic-continuity` 14 · `it-dr` 14 · `department-level` 10.
- **Verification:** 175 opened-and-confirmed (83%) · 35 link-only (17%).
- **Deep-coded:** 40 of 210 (19%). All 40 are `high` read confidence.

## Known data-quality items to revisit

1. **35 link-only records → upgrade to opened-and-confirmed.** These resolved on
   official hosts but the bytes weren't personally rendered (transient fetch
   rate-limit during discovery). Re-fetch and confirm the in-document quote.
   Run `python3 scripts/check_links.py` (live) first to confirm they still 200.
2. **`texas-tech-university-system`** deep record scored 1/22 because the linked
   URL is a 2017 *program-overview slide deck*, not the operational COOP. Re-source
   the actual TTUS COOP or reclassify `document_type` and re-quote.
3. **`university-of-maryland-baltimore`** deep coding was skipped (its COOP PDF
   404'd during coding); the discovery record stands on its landing-page quote.
   Re-source the current UMB COOP PDF.
4. **A few CA/TX institutions** appeared in both a regional lane and the
   minority-serving lane; `build_dataset.py` deduped by `source_url` (4 dupes
   removed). If two records describe genuinely different documents for one
   institution, confirm both `plan_id`s are distinct and correct.

## Prioritized next steps (for the next research session)

**Tier 1 — close the obvious gaps**
- Fill `HI`, `ME`, `WY` (try OCR on the UH System EMP; UMaine System; UW).
- Upgrade the 35 `link-only` records to `opened-and-confirmed`.
- Re-source the TTUS and UMB documents noted above.

**Tier 2 — depth**
- Deep-code another ~40–80 plans (target ~25–30% deep coverage), prioritizing
  `full-coop` and rich `business-continuity-framework` PDFs not yet coded. Use
  the ready-to-run agent prompt in `docs/CODING_GUIDE.md`.
- Add an `insights/notable-decisions` view to the website from the 101 (and
  growing) coded `unusual_decisions`.

**Tier 3 — breadth**
- A dedicated community-college / technical-college sweep by state system
  (CCC, VCCS, TCSG, NCCCS, Maricopa, Lone Star, Dallas College, Wisconsin/
  Minnesota technical systems) — these publish more than indexed search reveals;
  many are HTML-only and need direct site crawls.
- A tribal-college sweep working from AIHEC's member roster and each TCU's
  Annual Security & Fire Safety Report (which often assigns COOP responsibility).
- More liberal-arts and religiously-affiliated privates that publish BC programs.

**Tier 4 — enrichment**
- Backfill `enrollment` from IPEDS for institutions where it is null (several
  discovery records used approximate figures or left it null — IPEDS gives a
  citable source).
- Capture `recency_year` where currently null by opening the document's revision
  block.
