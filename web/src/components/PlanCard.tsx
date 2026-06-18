import Link from "next/link";
import { Badge } from "./Badge";
import { VerificationBadge } from "./VerificationBadge";
import type { SlimPlan } from "@/lib/types";

export function PlanCard({ p }: { p: SlimPlan }) {
  return (
    <Link className="card" href={`/plans/${p.plan_id}/`}>
      <div className="top">
        <div>
          <div className="name">{p.institution_name}</div>
          <div className="doc">{p.plan_type}</div>
        </div>
        <VerificationBadge v={p.verification} />
      </div>
      <div className="badges">
        <Badge variant="state">{p.state}</Badge>
        {p.institution_type && <Badge>{p.institution_type}</Badge>}
        {p.plan_type && <Badge>{p.plan_type}</Badge>}
        {p.document_type && p.document_type !== "full-coop" && (
          <Badge variant="doctype">{p.document_type}</Badge>
        )}
        {p.organizing_structure && <Badge>{p.organizing_structure}</Badge>}
        {p.recency_year ? <Badge>{p.recency_year}</Badge> : null}
        {p.file_format && <Badge>{p.file_format}</Badge>}
        {p.benchmark_present != null && (
          <Badge variant="score">Benchmark {p.benchmark_present}/22</Badge>
        )}
      </div>
    </Link>
  );
}
