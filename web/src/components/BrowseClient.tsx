"use client";

import { useEffect, useMemo, useState } from "react";
import type { SlimPlan } from "@/lib/types";
import { PlanCard } from "./PlanCard";
import { exportCSV, exportExcel, exportJSON } from "@/lib/export";

function uniq(plans: SlimPlan[], key: keyof SlimPlan): string[] {
  const set = new Set<string>();
  for (const p of plans) {
    const v = p[key];
    if (typeof v === "string" && v) set.add(v);
  }
  return [...set].sort();
}

type SortKey = "az" | "state" | "year" | "ver" | "bench" | "flags";

const FILTERS: { key: keyof SlimPlan; label: string; field: keyof SlimPlan }[] = [
  { key: "state", label: "State", field: "state" },
  { key: "control", label: "Control", field: "control" },
  { key: "institution_type", label: "Type", field: "institution_type" },
  { key: "plan_type", label: "Plan type", field: "plan_type" },
  { key: "document_type", label: "Doc type", field: "document_type" },
  { key: "organizing_structure", label: "Structure", field: "organizing_structure" },
  { key: "verification", label: "Verification", field: "verification" },
];

export function BrowseClient() {
  const [plans, setPlans] = useState<SlimPlan[] | null>(null);
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [deepOnly, setDeepOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("az");

  useEffect(() => {
    fetch("/data/plans.slim.json")
      .then((r) => r.json())
      .then((d: SlimPlan[]) => setPlans(d))
      .catch(() => setPlans([]));
  }, []);

  const options = useMemo(() => {
    const o: Record<string, string[]> = {};
    if (plans) for (const f of FILTERS) o[f.key as string] = uniq(plans, f.field);
    return o;
  }, [plans]);

  const view = useMemo(() => {
    if (!plans) return [];
    const query = q.trim().toLowerCase();
    let out = plans.filter((p) => {
      for (const f of FILTERS) {
        const want = filters[f.key as string];
        if (want && p[f.field] !== want) return false;
      }
      if (deepOnly && p.benchmark_present == null) return false;
      if (query) {
        const blob = [
          p.institution_name,
          p.state,
          p.institution_type,
          p.system_affiliation,
          p.plan_type,
          p.document_type,
          p.catalog_notes,
          p.framework_alignment,
          p.evidence_quote,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!blob.includes(query)) return false;
      }
      return true;
    });
    out = [...out].sort((a, b) => {
      switch (sort) {
        case "state":
          return (
            (a.state > b.state ? 1 : a.state < b.state ? -1 : 0) ||
            a.institution_name.localeCompare(b.institution_name)
          );
        case "year":
          return (b.recency_year || 0) - (a.recency_year || 0);
        case "ver":
          return (
            (a.verification === "opened-and-confirmed" ? 0 : 1) -
            (b.verification === "opened-and-confirmed" ? 0 : 1)
          );
        case "bench":
          return (
            (b.benchmark_present == null ? -1 : b.benchmark_present) -
            (a.benchmark_present == null ? -1 : a.benchmark_present)
          );
        case "flags":
          return (b.flags_present_count || 0) - (a.flags_present_count || 0);
        default:
          return a.institution_name.localeCompare(b.institution_name);
      }
    });
    return out;
  }, [plans, q, filters, deepOnly, sort]);

  const reset = () => {
    setQ("");
    setFilters({});
    setDeepOnly(false);
    setSort("az");
  };

  if (!plans) {
    return <p className="muted">Loading the catalog…</p>;
  }

  return (
    <div>
      <div className="controls">
        <input
          className="search-input"
          placeholder="Search institution, plan type, catalog notes, evidence quote…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {FILTERS.map((f) => (
          <select
            key={f.key as string}
            value={filters[f.key as string] || ""}
            aria-label={f.label}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, [f.key as string]: e.target.value }))
            }
          >
            <option value="">{f.label} (all)</option>
            {(options[f.key as string] || []).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        ))}
        <label className="deep-toggle">
          <input
            type="checkbox"
            checked={deepOnly}
            onChange={(e) => setDeepOnly(e.target.checked)}
          />
          Deep-coded only
        </label>
        <button className="btn" onClick={reset}>
          Reset
        </button>
      </div>

      <div className="resultmeta">
        <span>
          Showing <strong>{view.length}</strong> of {plans.length} plans
        </span>
        <span className="pill-row">
          <span>Export:</span>
          <button className="btn" onClick={() => exportCSV(view)}>
            CSV
          </button>
          <button className="btn" onClick={() => exportExcel(view)}>
            Excel
          </button>
          <button className="btn" onClick={() => exportJSON(view)}>
            JSON
          </button>
          <span style={{ marginLeft: 8 }}>Sort:</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="az">Institution A–Z</option>
            <option value="state">State</option>
            <option value="year">Newest first</option>
            <option value="ver">Confirmed first</option>
            <option value="bench">Benchmark score</option>
            <option value="flags">Flags present</option>
          </select>
        </span>
      </div>

      <div>
        {view.map((p) => (
          <PlanCard key={p.plan_id} p={p} />
        ))}
        {view.length === 0 && (
          <p className="muted">No plans match these filters.</p>
        )}
      </div>
    </div>
  );
}
