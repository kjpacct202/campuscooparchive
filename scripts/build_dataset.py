#!/usr/bin/env python3
"""
build_dataset.py — Campus COOP Archive master-dataset builder.

Pure Python 3 standard library only. Idempotent.

Reads every discovery file in data/raw/*.json (one JSON array of plan records
per research lane), deduplicates, normalizes, computes derived flags, and writes:

  data/plans.json          one row per plan (deduped, normalized, +derived)
  data/plans.csv           flat CSV of the same
  data/institutions.json   one row per institution
  data/institutions.csv    flat CSV of the same
  data/stats.json          pre-computed aggregates for the dashboard/website

If data/deep_analysis.json exists (produced by merge_deep.py), its benchmark
scores are folded into plans.json (has_deep, benchmark_present, benchmark_band)
and into the deep section of stats.json — so the canonical order is:

    python3 scripts/build_dataset.py      # base
    python3 scripts/merge_deep.py         # deep_analysis.json
    python3 scripts/build_dataset.py      # re-run, folds deep in

Running build_dataset.py twice with no input change produces identical output.
"""
import csv
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(ROOT, "data", "raw")
DATA_DIR = os.path.join(ROOT, "data")
DEEP_ANALYSIS = os.path.join(DATA_DIR, "deep_analysis.json")

# --- controlled vocabularies (mirror schema/taxonomies.md) -------------------
CONTROL = {"public", "private-nonprofit", "private-for-profit"}
INST_TYPES = {
    "R1 university", "R2 university", "regional public university",
    "community college", "technical college", "liberal arts college",
    "HBCU", "HSI", "tribal college", "system office",
    "religiously affiliated university", "specialized institution",
    "other public", "other private",
}
DOC_TYPES = {
    "full-coop", "business-continuity-framework", "department-level",
    "academic-continuity", "it-dr", "template",
}
ORG_STRUCT = {
    "essential-functions-based", "FCD-element-based", "phase-based",
    "departmental", "unclear",
}
VERIF = {"opened-and-confirmed", "link-only"}
FILE_FMT = {"PDF", "HTML", "DOCX", "other"}

# the 17 discovery-stage derived boolean flags
FLAGS = [
    "identifies_essential_functions", "business_impact_analysis",
    "orders_of_succession", "delegations_of_authority", "alternate_facilities",
    "continuity_communications", "vital_records", "defines_rto",
    "tt_e_program", "devolution", "reconstitution",
    "addresses_academic_continuity", "addresses_it_dr",
    "references_fcd1", "references_nist80034", "references_iso22301",
    "public_redacted_version",
]

REQUIRED = [
    "plan_id", "institution_name", "state", "control", "institution_type",
    "plan_type", "document_type", "source_url", "landing_page_url",
    "evidence_quote", "verification", "date_accessed",
]

OPTIONAL_STR = [
    "institution_id", "city", "system_affiliation", "plan_type",
    "organizing_structure", "framework_alignment", "published_revised",
    "version", "file_format", "catalog_notes", "source_lane",
]

# Column order for plans.csv
CSV_COLUMNS = [
    "plan_id", "institution_id", "institution_name", "state", "city",
    "control", "institution_type", "system_affiliation", "enrollment",
    "plan_type", "document_type", "organizing_structure", "framework_alignment",
    "recency_year", "published_revised", "version", "file_format",
    "source_url", "landing_page_url", "evidence_quote", "verification",
    "date_accessed", "catalog_notes", "source_lane",
] + FLAGS + ["flags_present_count", "has_deep", "benchmark_present", "benchmark_band"]

def slugify(text):
    text = (text or "").lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return re.sub(r"-+", "-", text).strip("-")


def norm_url(u):
    if not u:
        return ""
    u = u.strip()
    u = re.sub(r"#.*$", "", u)         # drop fragment
    u = re.sub(r"/+$", "", u)          # drop trailing slash
    return u


def warn(msg):
    sys.stderr.write("  [warn] " + msg + "\n")


def load_raw():
    records = []
    files = sorted(glob.glob(os.path.join(RAW_DIR, "*.json")))
    for fp in files:
        try:
            with open(fp, encoding="utf-8") as fh:
                data = json.load(fh)
        except Exception as exc:  # noqa: BLE001
            warn("could not parse %s: %s" % (os.path.basename(fp), exc))
            continue
        if not isinstance(data, list):
            warn("%s is not a JSON array; skipping" % os.path.basename(fp))
            continue
        for rec in data:
            rec.setdefault("source_lane", os.path.basename(fp).rsplit(".", 1)[0])
            records.append(rec)
    print("Loaded %d raw records from %d lane files" % (len(records), len(files)))
    return records


def validate_and_normalize(rec):
    """Return a normalized record, or None if it fails a hard requirement."""
    for key in REQUIRED:
        if not rec.get(key):
            warn("dropping record missing '%s': %s"
                 % (key, rec.get("institution_name", rec.get("plan_id", "?"))))
            return None

    out = {}
    out["plan_id"] = slugify(rec["plan_id"])
    out["institution_name"] = str(rec["institution_name"]).strip()
    out["state"] = str(rec["state"]).strip().upper()[:2]
    out["control"] = rec["control"] if rec["control"] in CONTROL else "public"
    out["institution_type"] = (rec["institution_type"]
                               if rec["institution_type"] in INST_TYPES
                               else "other public")
    out["plan_type"] = str(rec.get("plan_type", "Continuity Plan")).strip()
    out["document_type"] = (rec["document_type"]
                            if rec["document_type"] in DOC_TYPES else "full-coop")
    os_val = rec.get("organizing_structure")
    out["organizing_structure"] = os_val if os_val in ORG_STRUCT else "unclear"
    out["verification"] = (rec["verification"]
                           if rec["verification"] in VERIF else "link-only")
    ff = rec.get("file_format")
    out["file_format"] = ff if ff in FILE_FMT else "PDF"

    # institution id: canonical slug of the institution name so that multiple
    # plans from the same institution always group together (robust to plan_id
    # suffixes like -bcp / -continuity-of-instruction).
    out["institution_id"] = slugify(out["institution_name"])

    for key in ("city", "system_affiliation", "framework_alignment",
                "published_revised", "version", "catalog_notes", "source_lane"):
        val = rec.get(key)
        out[key] = (str(val).strip() if val not in (None, "") else None)

    out["source_url"] = norm_url(rec["source_url"])
    out["landing_page_url"] = norm_url(rec["landing_page_url"])
    out["evidence_quote"] = str(rec["evidence_quote"]).strip()
    out["date_accessed"] = str(rec["date_accessed"]).strip()

    # enrollment / recency_year as ints or None
    for key in ("enrollment", "recency_year"):
        val = rec.get(key)
        try:
            out[key] = int(val) if val not in (None, "") else None
        except (ValueError, TypeError):
            out[key] = None

    # boolean flags
    present = 0
    for flag in FLAGS:
        v = bool(rec.get(flag, False))
        out[flag] = v
        present += 1 if v else 0
    out["flags_present_count"] = present

    # deep placeholders (folded later)
    out["has_deep"] = False
    out["benchmark_present"] = None
    out["benchmark_band"] = None
    return out


def dedupe(records):
    """Dedupe by normalized source_url; resolve plan_id collisions."""
    by_url = {}
    order = []
    for rec in records:
        key = rec["source_url"].lower()
        if key not in by_url:
            by_url[key] = rec
            order.append(key)
        else:
            existing = by_url[key]
            # prefer opened-and-confirmed, then more flags, then more fields
            better = False
            if (existing["verification"] != "opened-and-confirmed"
                    and rec["verification"] == "opened-and-confirmed"):
                better = True
            elif (existing["verification"] == rec["verification"]
                  and rec["flags_present_count"] > existing["flags_present_count"]):
                better = True
            if better:
                by_url[key] = rec
    deduped = [by_url[k] for k in order]
    print("After source_url dedupe: %d records (removed %d dups)"
          % (len(deduped), len(records) - len(deduped)))

    # resolve plan_id collisions across distinct URLs
    seen = {}
    for rec in deduped:
        pid = rec["plan_id"]
        if pid not in seen:
            seen[pid] = 1
        else:
            seen[pid] += 1
            # suffix by document_type, else counter
            suffix = {
                "it-dr": "-itdr", "academic-continuity": "-academic",
                "business-continuity-framework": "-bcp", "template": "-template",
                "department-level": "-dept",
            }.get(rec["document_type"], "-%d" % seen[pid])
            newpid = pid + suffix
            while any(r["plan_id"] == newpid for r in deduped):
                newpid = newpid + "-x"
            rec["plan_id"] = newpid
    return deduped


def fold_deep(plans):
    if not os.path.exists(DEEP_ANALYSIS):
        return 0
    with open(DEEP_ANALYSIS, encoding="utf-8") as fh:
        deep = json.load(fh)
    deep_by_id = {d["plan_id"]: d for d in deep}
    n = 0
    for p in plans:
        d = deep_by_id.get(p["plan_id"])
        if not d:
            continue
        p["has_deep"] = True
        bp = d.get("benchmark_present")
        p["benchmark_present"] = bp
        p["benchmark_band"] = band(bp)
        n += 1
    return n


def band(score):
    if score is None:
        return None
    if score <= 4:
        return "0-4"
    if score <= 9:
        return "5-9"
    if score <= 14:
        return "10-14"
    if score <= 19:
        return "15-19"
    return "20-22"


def build_institutions(plans):
    insts = {}
    for p in plans:
        iid = p["institution_id"]
        if iid not in insts:
            insts[iid] = {
                "institution_id": iid,
                "institution_name": p["institution_name"],
                "state": p["state"],
                "city": p["city"],
                "control": p["control"],
                "institution_type": p["institution_type"],
                "system_affiliation": p["system_affiliation"],
                "enrollment": p["enrollment"],
                "plan_count": 0,
                "plan_ids": [],
                "best_verification": "link-only",
                "most_recent_year": None,
            }
        it = insts[iid]
        it["plan_count"] += 1
        it["plan_ids"].append(p["plan_id"])
        if p["verification"] == "opened-and-confirmed":
            it["best_verification"] = "opened-and-confirmed"
        if p["recency_year"]:
            if not it["most_recent_year"] or p["recency_year"] > it["most_recent_year"]:
                it["most_recent_year"] = p["recency_year"]
        if not it["enrollment"] and p["enrollment"]:
            it["enrollment"] = p["enrollment"]
    out = sorted(insts.values(), key=lambda x: x["institution_id"])
    for it in out:
        it["plan_ids"].sort()
    return out


def counter(items):
    out = {}
    for x in items:
        k = x if x is not None else "unknown"
        out[k] = out.get(k, 0) + 1
    return dict(sorted(out.items(), key=lambda kv: (-kv[1], str(kv[0]))))


def build_stats(plans, insts):
    deep = [p for p in plans if p["has_deep"] and p["benchmark_present"] is not None]
    scores = [p["benchmark_present"] for p in deep]
    stats = {
        "generated_from": "data/raw/*.json",
        "totals": {
            "plans": len(plans),
            "institutions": len(insts),
            "states_covered": len(set(p["state"] for p in plans)),
            "opened_and_confirmed": sum(
                1 for p in plans if p["verification"] == "opened-and-confirmed"),
            "link_only": sum(1 for p in plans if p["verification"] == "link-only"),
            "deep_coded": len(deep),
            "mean_benchmark": round(sum(scores) / len(scores), 1) if scores else None,
        },
        "by_state": counter(p["state"] for p in plans),
        "by_institution_type": counter(p["institution_type"] for p in plans),
        "by_control": counter(p["control"] for p in plans),
        "by_plan_type": counter(p["plan_type"] for p in plans),
        "by_document_type": counter(p["document_type"] for p in plans),
        "by_organizing_structure": counter(p["organizing_structure"] for p in plans),
        "by_verification": counter(p["verification"] for p in plans),
        "by_file_format": counter(p["file_format"] for p in plans),
        "framework_flags": {
            flag: sum(1 for p in plans if p[flag]) for flag in FLAGS
        },
    }
    if deep:
        bands = counter(p["benchmark_band"] for p in deep)
        ordered = {}
        for b in ["0-4", "5-9", "10-14", "15-19", "20-22"]:
            if b in bands:
                ordered[b] = bands[b]
        stats["deep"] = {
            "deep_coded": len(deep),
            "discovery_only": len(plans) - len(deep),
            "mean_benchmark": round(sum(scores) / len(scores), 1),
            "score_band_distribution": ordered,
            "mean_by_document_type": mean_by(deep, "document_type"),
            "mean_by_organizing_structure": mean_by(deep, "organizing_structure"),
        }
    return stats


def mean_by(deep, key):
    groups = {}
    for p in deep:
        groups.setdefault(p[key], []).append(p["benchmark_present"])
    return {k: {"n": len(v), "mean": round(sum(v) / len(v), 1)}
            for k, v in sorted(groups.items(), key=lambda kv: -len(kv[1]))}


def write_json(path, obj):
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(obj, fh, indent=2, ensure_ascii=False, sort_keys=False)
        fh.write("\n")


def write_csv(path, rows, columns):
    with open(path, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=columns, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow({c: r.get(c, "") for c in columns})


def main():
    raw = load_raw()
    normalized = [r for r in (validate_and_normalize(x) for x in raw) if r]
    plans = dedupe(normalized)
    plans.sort(key=lambda p: (p["state"], p["institution_name"], p["plan_id"]))

    folded = fold_deep(plans)
    if folded:
        print("Folded %d deep-analysis scores into plans" % folded)

    insts = build_institutions(plans)
    stats = build_stats(plans, insts)

    write_json(os.path.join(DATA_DIR, "plans.json"), plans)
    write_csv(os.path.join(DATA_DIR, "plans.csv"), plans, CSV_COLUMNS)
    write_json(os.path.join(DATA_DIR, "institutions.json"), insts)
    write_csv(os.path.join(DATA_DIR, "institutions.csv"), insts,
              ["institution_id", "institution_name", "state", "city", "control",
               "institution_type", "system_affiliation", "enrollment",
               "plan_count", "best_verification", "most_recent_year"])
    write_json(os.path.join(DATA_DIR, "stats.json"), stats)

    t = stats["totals"]
    print("\nWrote:")
    print("  data/plans.json / .csv         %d plans" % t["plans"])
    print("  data/institutions.json / .csv  %d institutions" % t["institutions"])
    print("  data/stats.json                %d states, %d opened-and-confirmed, %d deep-coded"
          % (t["states_covered"], t["opened_and_confirmed"], t["deep_coded"]))


if __name__ == "__main__":
    main()
