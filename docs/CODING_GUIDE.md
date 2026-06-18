# Coding guide — how to add records & run the deep layer

This guide explains (1) how to add a new plan record, (2) the deep-analysis
record schema, and (3) a ready-to-run agent prompt for both jobs. The whole
pipeline is plain Python 3 (no dependencies) and idempotent.

## Pipeline order

```bash
python3 scripts/build_dataset.py     # data/raw/*.json -> plans/institutions/stats
python3 scripts/merge_deep.py        # data/deep/batch_*.json -> deep_analysis.json
python3 scripts/build_dataset.py     # re-run: folds deep scores into plans/stats
python3 scripts/build_dashboard.py   # -> site/index.html
python3 scripts/check_links.py --dry # inventory; drop --dry to check live
```

## 1. Adding a discovery record

Append a record to a file in `data/raw/` (or add a new lane file
`data/raw/lane_<name>.json` — any JSON array of records is picked up). Required
fields and enums are defined in `schema/plan.schema.json`; controlled
vocabularies in `schema/taxonomies.md`; every field is documented in
`schema/field_dictionary.md`.

**The non-negotiables:** a real `source_url` on an official host, a real
`landing_page_url`, a **verbatim** `evidence_quote` you actually read, a
`verification` badge, and an ISO `date_accessed`. Never invent a URL or a quote.
Set the 17 boolean flags **true only where the captured text shows it**.

`build_dataset.py` will normalize enums, derive `institution_id`, dedupe by
`source_url`, resolve `plan_id` collisions, and recompute stats. Re-running with
no input change yields identical output.

## 2. The deep-analysis record (`data/deep/batch_*.json`)

Each batch is a JSON array of full-text-coded records. `merge_deep.py` validates
keys, computes the score, and writes `data/deep_analysis.json`.

```json
{
  "plan_id": "<must match a plans.json plan_id>",
  "read_confidence": "high | medium | low",
  "organizing_structure_confirmed": "essential-functions-based | FCD-element-based | phase-based | departmental | unclear",
  "coop_treatment": "integrated | separate | program | na",
  "benchmark_missing": ["<benchmark keys NOT clearly present>"],
  "essential_functions": ["<inventory items the plan lists, or []>"],
  "rto_tiers": "<short text or null>",
  "succession_depth": "<e.g. '3 positions deep' or null>",
  "alternate_facility_model": "physical-alternate-site | telework-distributed | reciprocal-mutual-aid | cloud-hosted | multiple | none-stated | null",
  "vital_records_approach": "<short text or null>",
  "tte_cadence": "<short text or null>",
  "devolution_treatment": "<short text or null>",
  "reconstitution_treatment": "<short text or null>",
  "academic_continuity_treatment": "<short text or null>",
  "it_continuity_treatment": "<short text or null>",
  "interdependencies_treatment": "<short text or null>",
  "unusual_decisions": [
    {"decision": "<notable/transferable choice>", "quote": "<VERBATIM excerpt from the document>"}
  ],
  "analyst_notes": "<2-4 sentences: structure, scope, what stands out>",
  "date_coded": "YYYY-MM-DD"
}
```

### Scoring rule (must not drift)

```
benchmark_present = 22 − (count of DISTINCT VALID keys in benchmark_missing)
```

`benchmark_missing` lists the keys whose component is **not** clearly present.
Everything not listed is treated as present — so only omit a key from
`benchmark_missing` if you actually saw the component in the text. The 22 valid
keys (any other string is dropped by `merge_deep.py` with a warning):

```
continuity_policy_promulgation  concept_of_operations          standards_alignment
budgeting_resources             plan_maintenance               essential_functions
business_impact_analysis        recovery_time_objectives       risk_threat_assessment
interdependencies               orders_of_succession           delegations_of_authority
continuity_facilities           continuity_communications      vital_records_management
continuity_personnel            activation_triggers            devolution
reconstitution                  it_disaster_recovery           academic_instructional_continuity
tests_training_exercises
```

**Every `unusual_decisions` entry must carry a verbatim quote.** If you could
not render the document, set `read_confidence:"low"` and leave
`unusual_decisions: []` — do not fabricate.

## 3. Ready-to-run agent prompt (deep coding)

Paste this to a research agent, filling the PLANS list with `plan_id | source_url | document_type` rows drawn from `data/plans.json` (prefer `verification == opened-and-confirmed`, richest document types first):

> You are a deep-analysis coder for the Campus COOP Archive. OPEN each plan
> below, READ it, and CODE it against the 22-component continuity benchmark with
> verbatim evidence. Never guess. Open docs with your web-fetch/PDF tools (load
> via ToolSearch if deferred); if a doc truly won't render, set
> `read_confidence:"low"`, code only what the landing page supports, and include
> no unusual_decisions for it.
>
> The 22 keys and what each means: [paste the component list from
> `docs/CONTINUITY_BENCHMARK.md`]. A component is PRESENT only if the text clearly
> shows it; otherwise put its key in `benchmark_missing`. Scoring is
> `22 − len(benchmark_missing)`, computed downstream, so list every key you did
> NOT see.
>
> Emit a JSON array of records in exactly the deep-record shape above and WRITE it
> to `data/deep/batch_<N>.json`. Every `unusual_decisions` entry needs an exact
> verbatim quote. Then reply with only: count coded, each plan_id + its missing
> count, and any docs you couldn't render. PLANS TO CODE: [list].

After the agent writes the batch, run `merge_deep.py` then re-run
`build_dataset.py` and `build_dashboard.py`.

## 4. Quality bar / review checklist

- [ ] `source_url` and `landing_page_url` are official-host and resolve.
- [ ] `evidence_quote` is verbatim and actually present on the page/doc.
- [ ] enums match `schema/taxonomies.md`; `state` is a valid USPS code.
- [ ] discovery flags are conservative (true only where shown).
- [ ] deep `benchmark_missing` uses only the 22 valid keys.
- [ ] every `unusual_decisions` entry has a real quote.
- [ ] `python3 scripts/build_dataset.py` runs clean; `check_links.py` shows no
      new 404s on the added URLs.
