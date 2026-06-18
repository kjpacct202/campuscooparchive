import type { Metadata } from "next";
import Link from "next/link";
import { BENCHMARK_GROUPS, FRAMEWORK_SOURCES } from "@/lib/benchmark";
import { getDeepList } from "@/lib/data";
import { componentLabel, BENCHMARK_MAX } from "@/lib/format";

export const metadata: Metadata = {
  title: "The continuity benchmark",
  description:
    "The 22-component continuity benchmark synthesized from FCD 1, FCD 2, the FEMA Continuity Guidance Circular, NIST SP 800-34, ISO 22301, and NFPA 1600. It is the standard every deep-coded campus COOP is scored against, fully cited.",
};

export default function BenchmarkPage() {
  const deep = getDeepList();
  const mean = deep.length
    ? deep.reduce((s, d) => s + d.benchmark_present, 0) / deep.length
    : 0;
  const missCount: Record<string, number> = {};
  for (const d of deep)
    for (const k of d.benchmark_missing || []) missCount[k] = (missCount[k] || 0) + 1;
  const topMissing = Object.entries(missCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  let n = 0;

  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">The standard</div>
        <h1>The continuity benchmark</h1>
        <p className="lead">
          A &ldquo;complete&rdquo; higher-ed continuity plan contains the {BENCHMARK_MAX}{" "}
          components below: a {BENCHMARK_MAX}-component continuity benchmark synthesized
          from FCD&nbsp;1, FCD&nbsp;2, the FEMA Continuity Guidance Circular, NIST
          SP&nbsp;800-34, ISO&nbsp;22301, and NFPA&nbsp;1600. Each deep-coded plan is scored
          as the count of components clearly present: <code>benchmark_present = {BENCHMARK_MAX} −
          (distinct keys in benchmark_missing)</code>.
        </p>
      </div>

      <div className="callout">
        <strong>How the catalog scores.</strong> Across the {deep.length} plans read in
        full, the mean score is <strong>{mean.toFixed(1)}/{BENCHMARK_MAX}</strong>. The
        most commonly missing components are{" "}
        {topMissing.map(([k], i) => (
          <span key={k}>
            {i > 0 ? ", " : ""}
            {componentLabel(k)}
          </span>
        ))}
. Core continuity elements (identifying essential functions, orders of succession) are
        near-universal, while advanced practices like devolution and formal RTO targets are
        the rarest. Note that many publicly posted &ldquo;plans&rdquo; are framework
        summaries or base-document-only releases, so low scores are often document-scope
        artifacts. See the <Link href="/methodology/">methodology</Link>.
      </div>

      <h2 style={{ marginTop: 30 }}>The {BENCHMARK_MAX} components</h2>
      {BENCHMARK_GROUPS.map((g) => (
        <div className="bgroup" key={g.name}>
          <h3>{g.name}</h3>
          <p className="blurb">{g.blurb}</p>
          {g.components.map((c) => {
            n += 1;
            return (
              <div className="bcomp" key={c.key}>
                <div className="idx">{n}</div>
                <div>
                  <div className="lab">{c.label}</div>
                  <div className="desc">{c.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <hr className="divider" />

      <h2>Source frameworks</h2>
      <p className="muted">
        The benchmark synthesizes these federal, national, and international continuity
        standards. Each links to its primary source.
      </p>
      <div className="panels">
        {FRAMEWORK_SOURCES.map((f) => (
          <div className="panel" key={f.url}>
            <h3 style={{ textTransform: "none", color: "var(--ink)", fontSize: "0.98rem" }}>
              {f.name}
            </h3>
            <p className="muted small" style={{ margin: "0 0 8px" }}>
              {f.publisher} · {f.date}
            </p>
            <p style={{ fontSize: "0.9rem" }}>{f.summary}</p>
            <a href={f.url} target="_blank" rel="noopener noreferrer">
              Primary source &#8599;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
