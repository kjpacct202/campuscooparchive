#!/usr/bin/env python3
"""
merge_deep.py — merge & score the deep-analysis layer.

Pure Python 3 standard library only. Idempotent.

Reads every batch in data/deep/batch_*.json (one JSON array of full-text-coded
records per batch), validates each against the 22-component continuity
benchmark, scores it, and writes the merged, scored layer to:

    data/deep_analysis.json

Scoring rule (must match docs/CONTINUITY_BENCHMARK.md):

    benchmark_present = 22 - (count of DISTINCT VALID keys in benchmark_missing)

Invalid / misspelled keys in benchmark_missing are dropped with a warning so a
typo can never inflate or deflate a score. After running this, re-run
build_dataset.py to fold the scores into plans.json and stats.json.
"""
import glob
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEEP_DIR = os.path.join(ROOT, "data", "deep")
PLANS = os.path.join(ROOT, "data", "plans.json")
OUT = os.path.join(ROOT, "data", "deep_analysis.json")

# The 22 benchmark component keys (see docs/CONTINUITY_BENCHMARK.md)
BENCHMARK_KEYS = [
    "continuity_policy_promulgation", "concept_of_operations", "standards_alignment",
    "budgeting_resources", "plan_maintenance", "essential_functions",
    "business_impact_analysis", "recovery_time_objectives", "risk_threat_assessment",
    "interdependencies", "orders_of_succession", "delegations_of_authority",
    "continuity_facilities", "continuity_communications", "vital_records_management",
    "continuity_personnel", "activation_triggers", "devolution", "reconstitution",
    "it_disaster_recovery", "academic_instructional_continuity", "tests_training_exercises",
]
BK = set(BENCHMARK_KEYS)
TOTAL = len(BENCHMARK_KEYS)  # 22

ORG_STRUCT = {"essential-functions-based", "FCD-element-based", "phase-based",
              "departmental", "unclear"}
COOP_TREATMENT = {"integrated", "separate", "program", "na"}
ALT_MODELS = {"physical-alternate-site", "telework-distributed",
              "reciprocal-mutual-aid", "cloud-hosted", "multiple", "none-stated"}

REQUIRED = ["plan_id", "benchmark_missing"]


def warn(msg):
    sys.stderr.write("  [warn] " + msg + "\n")


def band(score):
    if score <= 4:
        return "0-4"
    if score <= 9:
        return "5-9"
    if score <= 14:
        return "10-14"
    if score <= 19:
        return "15-19"
    return "20-22"


def load_plan_ids():
    if not os.path.exists(PLANS):
        warn("data/plans.json not found — run build_dataset.py first. "
             "Continuing without plan_id validation.")
        return None
    with open(PLANS, encoding="utf-8") as fh:
        return set(p["plan_id"] for p in json.load(fh))


def clean(rec, valid_ids):
    for key in REQUIRED:
        if key not in rec:
            warn("dropping deep record missing '%s': %s"
                 % (key, rec.get("plan_id", "?")))
            return None
    pid = rec["plan_id"]
    if valid_ids is not None and pid not in valid_ids:
        warn("deep record plan_id not in plans.json (kept, but check): %s" % pid)

    # coerce stray string sentinels ("null", "none", "") to real None
    for k, v in list(rec.items()):
        if isinstance(v, str) and v.strip().lower() in ("null", "none", "n/a", ""):
            rec[k] = None

    # validate benchmark_missing keys
    raw_missing = rec.get("benchmark_missing") or []
    valid_missing, dropped = [], []
    for k in raw_missing:
        if k in BK and k not in valid_missing:
            valid_missing.append(k)
        elif k not in BK:
            dropped.append(k)
    if dropped:
        warn("%s: dropped invalid benchmark key(s): %s" % (pid, ", ".join(dropped)))

    present = TOTAL - len(valid_missing)

    out = dict(rec)
    out["benchmark_missing"] = sorted(valid_missing, key=BENCHMARK_KEYS.index)
    out["benchmark_present"] = present
    out["benchmark_band"] = band(present)

    # light enum hygiene (don't drop; just flag)
    osc = rec.get("organizing_structure_confirmed")
    if osc and osc not in ORG_STRUCT:
        warn("%s: organizing_structure_confirmed not in vocab: %s" % (pid, osc))
    ct = rec.get("coop_treatment")
    if ct and ct not in COOP_TREATMENT:
        warn("%s: coop_treatment not in vocab: %s" % (pid, ct))
    am = rec.get("alternate_facility_model")
    if am and am not in ALT_MODELS:
        warn("%s: alternate_facility_model not in vocab: %s" % (pid, am))

    # ensure unusual_decisions carry quotes
    uds = rec.get("unusual_decisions") or []
    cleaned_uds = []
    for ud in uds:
        if isinstance(ud, dict) and ud.get("quote"):
            cleaned_uds.append({"decision": ud.get("decision", ""),
                                "quote": ud["quote"]})
        else:
            warn("%s: unusual_decision without a verbatim quote was dropped" % pid)
    out["unusual_decisions"] = cleaned_uds
    return out


def main():
    valid_ids = load_plan_ids()
    batches = sorted(glob.glob(os.path.join(DEEP_DIR, "batch_*.json")))
    if not batches:
        warn("no data/deep/batch_*.json found; nothing to merge")
    merged, seen = [], set()
    for fp in batches:
        try:
            with open(fp, encoding="utf-8") as fh:
                data = json.load(fh)
        except Exception as exc:  # noqa: BLE001
            warn("could not parse %s: %s" % (os.path.basename(fp), exc))
            continue
        print("  %s: %d records" % (os.path.basename(fp), len(data)))
        for rec in data:
            c = clean(rec, valid_ids)
            if not c:
                continue
            if c["plan_id"] in seen:
                warn("duplicate deep plan_id across batches (last wins): %s"
                     % c["plan_id"])
                merged = [m for m in merged if m["plan_id"] != c["plan_id"]]
            seen.add(c["plan_id"])
            merged.append(c)

    merged.sort(key=lambda r: (-r["benchmark_present"], r["plan_id"]))
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(merged, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    if merged:
        scores = [m["benchmark_present"] for m in merged]
        print("\nMerged %d deep-coded plans -> data/deep_analysis.json" % len(merged))
        print("  mean benchmark: %.1f / %d" % (sum(scores) / len(scores), TOTAL))
        print("  range: %d-%d" % (min(scores), max(scores)))
        print("  Re-run build_dataset.py to fold these into plans.json & stats.json")
    else:
        print("\nNo deep records merged.")


if __name__ == "__main__":
    main()
