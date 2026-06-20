import type { Metadata } from "next";
import Link from "next/link";
import { notableDecisions, notableDecisionsByPlan } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Notable decisions",
  description:
    "A gallery of transferable and unusual design decisions found by reading campus continuity plans in full, each backed by a verbatim quote and a link to its source plan.",
};

export default function NotableDecisionsPage() {
  const groups = notableDecisionsByPlan();
  const total = notableDecisions().length;

  return (
    <div>
      <Link className="backlink" href="/insights/">
        &larr; Back to insights
      </Link>
      <div className="page-head">
        <div className="eyebrow">The wisdom layer</div>
        <h1>Notable decisions</h1>
        <p className="lead">
          {total} notable design decisions captured with verbatim quotes across the
          corpus; this gallery shows those drawn from the {groups.length} deep-coded
          plans we read in full. Each is quoted verbatim from its source. Click any
          institution to open its plan.
        </p>
      </div>

      {groups.map((g) => (
        <section className="section" key={g.plan_id}>
          <h2 style={{ fontSize: "1.1rem", borderBottom: "none", marginBottom: 10 }}>
            <Link href={`/plans/${g.plan_id}/`}>{g.institution_name}</Link>
          </h2>
          {g.items.map((d, i) => (
            <div className="unusual" key={i}>
              <div className="obs">{d.decision}</div>
              <div className="ev">&ldquo;{d.quote}&rdquo;</div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
