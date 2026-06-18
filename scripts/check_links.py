#!/usr/bin/env python3
"""
check_links.py — verify that every catalogued URL still resolves.

Pure Python 3 standard library only (urllib). Idempotent.

Reads data/plans.json, collects the unique source_url and landing_page_url
values, and (in live mode) issues a lightweight request to each, classifying:
    ok       2xx / 3xx
    broken   4xx / 5xx
    error    network/timeout/SSL error
Writes a machine-readable report to data/link_check_report.json and prints a
summary grouped by host. Use this before each release and to re-confirm
'link-only' records (a link that newly 404s should be dropped or re-sourced).

Usage:
    python3 scripts/check_links.py            # live check (needs network)
    python3 scripts/check_links.py --dry      # inventory only, no requests
    python3 scripts/check_links.py --limit 25 # check only the first N URLs
    python3 scripts/check_links.py --delay 1  # seconds between requests (polite)

The --dry inventory is safe to run anywhere; live mode should be run from an
environment with outbound network access (e.g. the deploy/Claude Code session).
"""
import argparse
import json
import os
import sys
import time
from urllib import request, error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLANS = os.path.join(ROOT, "data", "plans.json")
REPORT = os.path.join(ROOT, "data", "link_check_report.json")
UA = "CampusCOOPArchive-linkcheck/1.0 (+research index; contact via repo)"


def host_of(url):
    try:
        return url.split("/")[2].lower()
    except IndexError:
        return "?"


def collect_urls(plans):
    """Return list of (url, kind, plan_id), de-duplicated by url."""
    seen, out = set(), []
    for p in plans:
        for kind in ("source_url", "landing_page_url"):
            u = p.get(kind)
            if u and u not in seen:
                seen.add(u)
                out.append((u, kind, p.get("plan_id", "?")))
    return out


def check_one(url, timeout):
    """Return (status_str, code_or_msg). Tries HEAD, falls back to GET."""
    for method in ("HEAD", "GET"):
        try:
            req = request.Request(url, method=method, headers={"User-Agent": UA})
            with request.urlopen(req, timeout=timeout) as resp:
                code = resp.getcode()
                return ("ok" if code < 400 else "broken"), code
        except error.HTTPError as exc:
            if exc.code in (403, 405) and method == "HEAD":
                continue  # some hosts block HEAD; retry with GET
            return ("broken" if exc.code >= 400 else "ok"), exc.code
        except Exception as exc:  # noqa: BLE001
            if method == "GET":
                return "error", type(exc).__name__
    return "error", "unknown"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry", action="store_true", help="inventory only, no requests")
    ap.add_argument("--limit", type=int, default=0, help="check only first N urls")
    ap.add_argument("--delay", type=float, default=0.5, help="seconds between requests")
    ap.add_argument("--timeout", type=float, default=20.0)
    args = ap.parse_args()

    if not os.path.exists(PLANS):
        sys.exit("data/plans.json not found — run build_dataset.py first.")
    with open(PLANS, encoding="utf-8") as fh:
        plans = json.load(fh)
    urls = collect_urls(plans)
    if args.limit:
        urls = urls[: args.limit]

    hosts = {}
    for u, _, _ in urls:
        hosts[host_of(u)] = hosts.get(host_of(u), 0) + 1
    print("%d unique URLs across %d hosts (from %d plans)"
          % (len(urls), len(hosts), len(plans)))

    if args.dry:
        report = {"mode": "dry", "total_urls": len(urls), "total_hosts": len(hosts),
                  "by_host": dict(sorted(hosts.items(), key=lambda kv: -kv[1])),
                  "checked": []}
        with open(REPORT, "w", encoding="utf-8") as fh:
            json.dump(report, fh, indent=2, ensure_ascii=False)
        print("Dry run — wrote inventory to data/link_check_report.json "
              "(no network requests made). Run without --dry to check live.")
        return

    results = {"ok": 0, "broken": 0, "error": 0}
    rows = []
    for i, (u, kind, pid) in enumerate(urls, 1):
        status, code = check_one(u, args.timeout)
        results[status] += 1
        rows.append({"url": u, "kind": kind, "plan_id": pid,
                     "status": status, "code": code, "host": host_of(u)})
        print("  [%d/%d] %-6s %s %s" % (i, len(urls), status, code, u))
        if args.delay:
            time.sleep(args.delay)

    report = {"mode": "live", "total_urls": len(urls),
              "summary": results, "checked": rows}
    with open(REPORT, "w", encoding="utf-8") as fh:
        json.dump(report, fh, indent=2, ensure_ascii=False)
    print("\nDone: %(ok)d ok, %(broken)d broken, %(error)d error" % results)
    print("Wrote data/link_check_report.json")
    if results["broken"]:
        print("Review broken links and drop/re-source them before release.")


if __name__ == "__main__":
    main()
