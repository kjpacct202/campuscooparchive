import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlans, getPlan, getDeep, getInstitution, getRelated } from "@/lib/data";
import { Badge } from "@/components/Badge";
import { VerificationBadge } from "@/components/VerificationBadge";
import { EvidenceQuote } from "@/components/EvidenceQuote";
import { SourceLinks } from "@/components/SourceLinks";
import { CopyButton } from "@/components/CopyButton";
import { PlanCard } from "@/components/PlanCard";
import CiteCard from "@/components/CiteCard";
import {
  ALL_COMPONENT_KEYS,
  componentLabel,
  scoreTier,
  verificationLabel,
  SITE_NAME,
  SITE_URL,
} from "@/lib/format";

export function generateStaticParams() {
  return getPlans().map((p) => ({ id: p.plan_id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const plan = getPlan(params.id);
  if (!plan) return { title: "Plan not found" };
  const deepNote = getDeep(params.id) ? " Deep-coded against the 22-component continuity benchmark." : "";
  return {
    title: `${plan.institution_name}: ${plan.plan_type}`,
    description: `${plan.institution_name} (${plan.state}) ${plan.plan_type}. Sourced from a publicly published document with a verbatim evidence quote.${deepNote}`,
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

export default function PlanPage({ params }: { params: { id: string } }) {
  const plan = getPlan(params.id);
  if (!plan) notFound();
  const deep = getDeep(params.id);
  const inst = getInstitution(params.id);
  const structure = deep?.organizing_structure_confirmed || plan.organizing_structure;

  const missingSet = new Set(deep?.benchmark_missing || []);
  const present = ALL_COMPONENT_KEYS.filter((k) => !missingSet.has(k));
  const citation = `${plan.institution_name}. ${plan.plan_type}. ${plan.source_url} (accessed ${plan.date_accessed}). Via ${SITE_NAME}, ${SITE_URL}/plans/${plan.plan_id}/`;
  const related = getRelated(params.id, 4);

  return (
    <article>
      <Link className="backlink" href="/browse/">
        &larr; Back to browse
      </Link>

      <div className="page-head">
        <div className="top" style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
          <div>
            <h1 style={{ marginBottom: 4 }}>{plan.institution_name}</h1>
            <p className="lead" style={{ marginBottom: 10 }}>
              {plan.plan_type}
            </p>
          </div>
          <VerificationBadge v={plan.verification} />
        </div>
        <div className="badges">
          <Badge variant="state">{plan.state}</Badge>
          <Badge>{plan.institution_type}</Badge>
          <Badge>{plan.plan_type}</Badge>
          {plan.document_type && plan.document_type !== "full-coop" && (
            <Badge variant="doctype">{plan.document_type}</Badge>
          )}
          {structure && <Badge>{structure}</Badge>}
          {plan.recency_year ? <Badge>{plan.recency_year}</Badge> : null}
          {plan.file_format && <Badge>{plan.file_format}</Badge>}
          {deep && <Badge variant="score">Benchmark {deep.benchmark_present}/22</Badge>}
        </div>
      </div>

      <div className="detail-grid">
        <div>
          <EvidenceQuote quote={plan.evidence_quote} />
          <SourceLinks
            sourceUrl={plan.source_url}
            landingUrl={plan.landing_page_url}
            dateAccessed={plan.date_accessed}
          />

          <section className="section">
            <h2>Overview</h2>
            <dl className="kv">
              <Row label="City" value={plan.city} />
              <Row label="Control" value={plan.control} />
              <Row label="Institution type" value={plan.institution_type} />
              <Row label="System affiliation" value={plan.system_affiliation} />
              <Row
                label="Enrollment"
                value={plan.enrollment ? plan.enrollment.toLocaleString() : null}
              />
              <Row label="Plan type" value={plan.plan_type} />
              <Row label="Document type" value={plan.document_type} />
              <Row label="Organizing structure" value={structure} />
              <Row label="Framework alignment" value={plan.framework_alignment} />
              <Row label="Published / revised" value={plan.published_revised || "undated"} />
              <Row label="Version" value={plan.version} />
            </dl>
          </section>

          {plan.catalog_notes && (
            <section className="section">
              <h2>Catalog notes</h2>
              <p className="muted">{plan.catalog_notes}</p>
            </section>
          )}

          {deep ? (
            <section className="section">
              <h2>Continuity benchmark</h2>
              <div className="scoremeter" style={{ marginBottom: 16 }}>
                <span className={"num " + scoreTier(deep.benchmark_present)}>
                  {deep.benchmark_present}
                  <span style={{ fontSize: "1rem", color: "var(--muted)" }}>/22</span>
                </span>
                <span className="muted small">
                  Full text read
                  {deep.read_confidence ? ` · ${deep.read_confidence} confidence` : ""}. Scored
                  against the{" "}
                  <Link href="/benchmark/">22-component continuity benchmark</Link>.
                </span>
              </div>

              <div className="panels">
                <div className="panel">
                  <h3>Present ({present.length})</h3>
                  <div className="tags">
                    {present.map((k) => (
                      <span className="tag" key={k} style={{ color: "var(--green)" }}>
                        &#10003; {componentLabel(k)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="panel">
                  <h3>Missing ({missingSet.size})</h3>
                  <div className="tags">
                    {[...missingSet].map((k) => (
                      <span className="tag" key={k}>
                        &#10007; {componentLabel(k)}
                      </span>
                    ))}
                    {missingSet.size === 0 && (
                      <span className="muted small">Nothing missing. A perfect 22/22.</span>
                    )}
                  </div>
                </div>
              </div>

              <dl className="kv" style={{ marginTop: 18 }}>
                <Row label="COOP treatment" value={deep.coop_treatment} />
                <Row label="Alternate-facility model" value={deep.alternate_facility_model} />
                <Row label="Confidence" value={deep.read_confidence} />
              </dl>

              {deep.essential_functions && deep.essential_functions.length > 0 && (
                <>
                  <h3 style={{ marginTop: 16 }}>Essential functions</h3>
                  <ul className="tags">
                    {deep.essential_functions.map((f, i) => (
                      <li className="tag" key={i}>
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {deep.rto_tiers && (
                <>
                  <h3 style={{ marginTop: 16 }}>RTO tiers</h3>
                  <p className="muted small">{deep.rto_tiers}</p>
                </>
              )}
              {deep.succession_depth && (
                <>
                  <h3 style={{ marginTop: 16 }}>Orders of succession</h3>
                  <p className="muted small">{deep.succession_depth}</p>
                </>
              )}
              {deep.vital_records_approach && (
                <>
                  <h3 style={{ marginTop: 16 }}>Vital records</h3>
                  <p className="muted small">{deep.vital_records_approach}</p>
                </>
              )}
              {deep.tte_cadence && (
                <>
                  <h3 style={{ marginTop: 16 }}>TT&amp;E cadence</h3>
                  <p className="muted small">{deep.tte_cadence}</p>
                </>
              )}
              {deep.devolution_treatment && (
                <>
                  <h3 style={{ marginTop: 16 }}>Devolution</h3>
                  <p className="muted small">{deep.devolution_treatment}</p>
                </>
              )}
              {deep.reconstitution_treatment && (
                <>
                  <h3 style={{ marginTop: 16 }}>Reconstitution</h3>
                  <p className="muted small">{deep.reconstitution_treatment}</p>
                </>
              )}
              {deep.academic_continuity_treatment && (
                <>
                  <h3 style={{ marginTop: 16 }}>Academic continuity</h3>
                  <p className="muted small">{deep.academic_continuity_treatment}</p>
                </>
              )}
              {deep.it_continuity_treatment && (
                <>
                  <h3 style={{ marginTop: 16 }}>IT continuity</h3>
                  <p className="muted small">{deep.it_continuity_treatment}</p>
                </>
              )}
              {deep.interdependencies_treatment && (
                <>
                  <h3 style={{ marginTop: 16 }}>Interdependencies</h3>
                  <p className="muted small">{deep.interdependencies_treatment}</p>
                </>
              )}

              {deep.unusual_decisions && deep.unusual_decisions.length > 0 && (
                <>
                  <h3 style={{ marginTop: 20 }}>Notable decisions</h3>
                  {deep.unusual_decisions.map((u, i) => (
                    <div className="unusual" key={i}>
                      <div className="obs">{u.decision}</div>
                      <div className="ev">&ldquo;{u.quote}&rdquo;</div>
                    </div>
                  ))}
                </>
              )}

              {deep.analyst_notes && (
                <>
                  <h3 style={{ marginTop: 20 }}>Analyst notes</h3>
                  <p className="muted small">{deep.analyst_notes}</p>
                </>
              )}
            </section>
          ) : (
            <section className="section">
              <h2>Continuity benchmark</h2>
              <p className="muted small">
                Not yet deep-coded. This plan is catalogued from its published source with a
                verbatim evidence quote, but has not yet been read in full against the{" "}
                <Link href="/benchmark/">22-component continuity benchmark</Link>.
              </p>
            </section>
          )}
        </div>

        <aside>
          <div className="sidecard">
            <h3>Source &amp; verification</h3>
            <p style={{ margin: "0 0 10px" }}>
              <VerificationBadge v={plan.verification} />{" "}
              <span className="muted small">{verificationLabel(plan.verification)}</span>
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {plan.source_url && (
                <a
                  className="btn btn-primary"
                  href={plan.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textAlign: "center" }}
                >
                  View source document &#8599;
                </a>
              )}
              {plan.landing_page_url && plan.landing_page_url !== plan.source_url && (
                <a
                  className="btn"
                  href={plan.landing_page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textAlign: "center" }}
                >
                  Official page &#8599;
                </a>
              )}
            </div>
            <hr className="divider" />
            <dl className="kv" style={{ gridTemplateColumns: "1fr", gap: 8 }}>
              <Row label="Accessed" value={plan.date_accessed} />
              <Row label="Most recent version" value={plan.recency_year} />
              <Row label="Document type" value={plan.document_type} />
            </dl>
            {inst && (
              <p style={{ marginTop: 12 }}>
                <Link href={`/institutions/${inst.institution_id}/`}>
                  View institution &rarr;
                </Link>
              </p>
            )}
            <hr className="divider" />
            <CopyButton text={citation} label="Copy citation" />
          </div>
        </aside>
      </div>

      <section className="section">
        <h2>Cite this record</h2>
        <CiteCard
          planId={plan.plan_id}
          institution={plan.institution_name}
          planType={plan.plan_type}
          url={plan.source_url}
          year={plan.recency_year}
          accessed={plan.date_accessed}
        />
      </section>

      {related.length > 0 && (
        <section className="section">
          <h2>More plans from {plan.state}</h2>
          {related.map((r) => (
            <PlanCard key={r.plan_id} p={r} />
          ))}
        </section>
      )}
    </article>
  );
}
