import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInstitutions, getInstitution, getSlim } from "@/lib/data";
import { PlanCard } from "@/components/PlanCard";
import { CopyButton } from "@/components/CopyButton";
import { SITE_URL } from "@/lib/format";
import type { SlimPlan } from "@/lib/types";

export function generateStaticParams() {
  return getInstitutions().map((i) => ({ id: i.institution_id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const inst = getInstitution(params.id);
  if (!inst) return { title: "Institution not found" };
  return {
    title: inst.institution_name,
    description: `${inst.institution_name} (${inst.state}) — institution profile and its publicly published continuity plans.`,
  };
}

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}

export default function InstitutionPage({ params }: { params: { id: string } }) {
  const inst = getInstitution(params.id);
  if (!inst) notFound();

  // Resolve each plan_id to the slim shape PlanCard consumes.
  const plans: SlimPlan[] = (inst.plan_ids ?? [])
    .map((pid) => getSlim(pid))
    .filter(Boolean) as SlimPlan[];

  return (
    <article>
      <Link className="backlink" href="/institutions/">
        &larr; All institutions
      </Link>
      <div className="page-head">
        <h1>{inst.institution_name}</h1>
        <p className="lead">
          {inst.institution_type} · {inst.state}
          {inst.system_affiliation ? ` · ${inst.system_affiliation}` : ""}
        </p>
        <div className="pill-row">
          <CopyButton
            text={`${SITE_URL}/institutions/${inst.institution_id}/`}
            label="Copy link"
          />
        </div>
      </div>

      <section className="section">
        <h2>Institution</h2>
        <dl className="kv">
          <Row label="State" value={inst.state} />
          <Row label="City" value={inst.city} />
          <Row label="Control" value={inst.control} />
          <Row label="Institution type" value={inst.institution_type} />
          <Row label="System affiliation" value={inst.system_affiliation} />
          <Row
            label="Enrollment"
            value={inst.enrollment ? inst.enrollment.toLocaleString() : null}
          />
        </dl>
      </section>

      <section className="section">
        <h2>
          Published plans
          {plans.length ? ` (${plans.length})` : ""}
        </h2>
        {plans.length ? (
          <div className="grid">
            {plans.map((p) => (
              <PlanCard key={p.plan_id} p={p} />
            ))}
          </div>
        ) : (
          <p className="muted">No linked plan records found.</p>
        )}
      </section>
    </article>
  );
}
