"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { SlimPlan } from "@/lib/types";
import {
  ALL_COMPONENT_KEYS,
  componentLabel,
  prettyTag,
  isConfirmed,
} from "@/lib/format";

const MAX = 4;

function mark(on: boolean | undefined, deep: boolean) {
  if (!deep) return <span className="muted">·</span>;
  return on ? (
    <span style={{ color: "var(--green)", fontWeight: 700 }}>✓</span>
  ) : (
    <span className="muted">No</span>
  );
}

export function CompareClient() {
  const [plans, setPlans] = useState<SlimPlan[] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/data/plans.slim.json")
      .then((r) => r.json())
      .then((d: SlimPlan[]) => {
        setPlans(d);
        const perfect = d
          .filter((p) => p.benchmark_present === 22)
          .sort((a, b) => a.institution_name.localeCompare(b.institution_name));
        setSelected(perfect.slice(0, 2).map((p) => p.plan_id));
      })
      .catch(() => setPlans([]));
  }, []);

  const byId = useMemo(
    () => new Map((plans || []).map((p) => [p.plan_id, p])),
    [plans]
  );
  const cols = selected.map((id) => byId.get(id)).filter(Boolean) as SlimPlan[];

  const matches = useMemo(() => {
    if (!plans) return [];
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return plans
      .filter(
        (p) =>
          !selected.includes(p.plan_id) &&
          `${p.institution_name} ${p.state}`.toLowerCase().includes(query)
      )
      .slice(0, 8);
  }, [plans, q, selected]);

  const add = (id: string) => {
    if (selected.length < MAX && !selected.includes(id)) setSelected([...selected, id]);
    setQ("");
  };
  const remove = (id: string) => setSelected(selected.filter((s) => s !== id));

  if (!plans) return <p className="muted">Loading the catalog…</p>;

  const deepOf = (c: SlimPlan) => c.benchmark_present != null;

  return (
    <div>
      <div className="controls" style={{ marginBottom: 10 }}>
        <input
          className="search-input"
          placeholder={
            selected.length >= MAX
              ? `Max ${MAX} plans, remove one to add another`
              : "Search to add a plan to compare…"
          }
          value={q}
          onChange={(e) => setQ(e.target.value)}
          disabled={selected.length >= MAX}
        />
      </div>
      {matches.length > 0 && (
        <div className="compare-matches">
          {matches.map((m) => (
            <button key={m.plan_id} className="btn" onClick={() => add(m.plan_id)}>
              + {m.institution_name} <span className="muted">({m.state})</span>
            </button>
          ))}
        </div>
      )}

      {cols.length === 0 ? (
        <p className="muted">Search above to add up to {MAX} plans, then compare them side by side.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="table compare-table">
            <thead>
              <tr>
                <th />
                {cols.map((c) => (
                  <th key={c.plan_id}>
                    <Link href={`/plans/${c.plan_id}/`}>{c.institution_name}</Link>{" "}
                    <button
                      className="compare-x"
                      onClick={() => remove(c.plan_id)}
                      aria-label={`Remove ${c.institution_name}`}
                    >
                      ×
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Benchmark</td>
                {cols.map((c) => (
                  <td key={c.plan_id}>
                    {c.benchmark_present != null ? `${c.benchmark_present}/22` : "n/a"}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Structure</td>
                {cols.map((c) => (
                  <td key={c.plan_id}>{c.organizing_structure || "n/a"}</td>
                ))}
              </tr>
              <tr>
                <td>Plan type</td>
                {cols.map((c) => (
                  <td key={c.plan_id}>{c.plan_type || "n/a"}</td>
                ))}
              </tr>
              <tr>
                <td>Document type</td>
                {cols.map((c) => (
                  <td key={c.plan_id}>{c.document_type || "n/a"}</td>
                ))}
              </tr>
              <tr>
                <td>State</td>
                {cols.map((c) => (
                  <td key={c.plan_id}>{c.state}</td>
                ))}
              </tr>
              <tr>
                <td>Verification</td>
                {cols.map((c) => (
                  <td key={c.plan_id}>{isConfirmed(c.verification) ? "Confirmed" : "Link-only"}</td>
                ))}
              </tr>

              <tr className="compare-sec">
                <td colSpan={cols.length + 1}>Continuity benchmark components</td>
              </tr>
              {ALL_COMPONENT_KEYS.map((k) => (
                <tr key={k}>
                  <td>{componentLabel(k)}</td>
                  {cols.map((c) => {
                    const deep = deepOf(c);
                    const present = deep && !(c.benchmark_missing || []).includes(k);
                    return <td key={c.plan_id}>{mark(present, deep)}</td>;
                  })}
                </tr>
              ))}

              <tr className="compare-sec">
                <td colSpan={cols.length + 1}>Continuity coverage</td>
              </tr>
              <tr>
                <td>COOP treatment</td>
                {cols.map((c) => (
                  <td key={c.plan_id}>
                    {c.coop_treatment
                      ? prettyTag(c.coop_treatment)
                      : deepOf(c)
                      ? "n/a"
                      : <span className="muted">·</span>}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Alternate-facility model</td>
                {cols.map((c) => (
                  <td key={c.plan_id}>
                    {c.alternate_facility_model
                      ? prettyTag(c.alternate_facility_model)
                      : deepOf(c)
                      ? "n/a"
                      : <span className="muted">·</span>}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Essential functions</td>
                {cols.map((c) => {
                  const fns = c.essential_functions || [];
                  return (
                    <td key={c.plan_id}>
                      {deepOf(c)
                        ? fns.length
                          ? `${fns.length} identified`
                          : "n/a"
                        : <span className="muted">·</span>}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
          <p className="muted small" style={{ marginTop: 10 }}>
            <strong>·</strong> = not deep-coded (only the full-text-read subset has
            component and continuity-coverage detail).
          </p>
        </div>
      )}
    </div>
  );
}
