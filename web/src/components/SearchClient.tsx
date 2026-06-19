"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import type { SlimPlan } from "@/lib/types";
import { PlanCard } from "./PlanCard";
import ExportMenu from "./ExportMenu";

function haystack(p: SlimPlan): string {
  return [
    p.institution_name,
    p.state,
    p.institution_type,
    p.system_affiliation,
    p.plan_type,
    p.document_type,
    p.organizing_structure,
    p.catalog_notes,
    p.framework_alignment,
    p.evidence_quote,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function SearchClient() {
  const [plans, setPlans] = useState<SlimPlan[] | null>(null);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Seed from the URL (?q= / ?state=), e.g. coverage-map and deep links.
    const sp = new URLSearchParams(window.location.search);
    const initial = sp.get("q") || sp.get("state") || "";
    if (initial) setQ(initial);
    fetch("/data/plans.slim.json")
      .then((r) => r.json())
      .then((d: SlimPlan[]) => setPlans(d))
      .catch(() => setPlans([]));
  }, []);

  const results = useMemo(() => {
    if (!plans) return [];
    const tokens = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];
    return plans
      .map((p) => ({ p, hay: haystack(p) }))
      .filter(({ hay }) => tokens.every((t) => hay.includes(t)))
      .map(({ p }) => p)
      .sort(
        (a, b) =>
          (b.benchmark_present == null ? -1 : b.benchmark_present) -
            (a.benchmark_present == null ? -1 : a.benchmark_present) ||
          a.institution_name.localeCompare(b.institution_name)
      );
  }, [plans, q]);

  return (
    <div>
      <div className="controls" style={{ marginBottom: 8 }}>
        <div style={{ position: "relative", flex: "1 1 360px" }}>
          <Search
            className="h-5 w-5"
            aria-hidden="true"
            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
          />
          <input
            ref={inputRef}
            className="search-input"
            style={{ width: "100%", paddingLeft: 42 }}
            placeholder="Search institutions, plan types, and verbatim evidence quotes…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
            aria-label="Search the archive"
          />
        </div>
      </div>

      {q.trim() === "" ? (
        <p className="muted">
          {plans ? `Type to search all ${plans.length} continuity plans by institution, type, framework, or the exact words of an evidence quote.` : "Loading the catalog…"}
        </p>
      ) : (
        <>
          <div className="resultmeta">
            <span>
              <strong>{results.length}</strong> result{results.length === 1 ? "" : "s"} for &ldquo;{q.trim()}&rdquo;
            </span>
            {results.length > 0 && (
              <span className="pill-row">
                <ExportMenu rows={results} baseName="campus-coop-archive-search" label="Export results" />
              </span>
            )}
          </div>
          <div>
            {results.map((p) => (
              <PlanCard key={p.plan_id} p={p} />
            ))}
            {results.length === 0 && plans && (
              <p className="muted">No plans match that search. Try fewer or different words.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
