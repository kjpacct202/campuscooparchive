import type { Metadata } from "next";
import Link from "next/link";
import { getStats, getDeepList } from "@/lib/data";
import { componentLabel, BENCHMARK_MAX } from "@/lib/format";
import { BarChart, type BarItem } from "@/components/BarChart";
import { StatChip } from "@/components/StatChip";
import {
  coopSplit,
  altFacilityModels,
  meanScoreByStructure,
  meanScoreByDocType,
  mostMissing,
  notableDecisions,
} from "@/lib/insights";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "What reading every deep-coded campus continuity (COOP) plan in full reveals: where the field's coverage breaks down, how document type and organizing structure track with benchmark maturity, how continuity is housed, and a gallery of notable design decisions.",
};

export default function InsightsPage() {
  const stats = getStats();
  const deep = getDeepList();
  const scored = deep.filter((d) => typeof d.benchmark_present === "number");
  const scores = scored.map((d) => d.benchmark_present as number);
  const mean = stats.totals.mean_benchmark;
  const min = scores.length ? Math.min(...scores) : 0;
  const max = scores.length ? Math.max(...scores) : 0;
  const perfect = scored.filter((d) => d.benchmark_present === BENCHMARK_MAX).length;
  const deepCoded = stats.deep.deep_coded;
  const totalPlans = stats.totals.plans;

  // (1) The field's blind spot: most commonly missing benchmark components.
  const miss = mostMissing(8);
  const missItems: BarItem[] = miss.map((m) => ({
    label: componentLabel(m.label),
    value: m.value,
  }));
  const topMissing = miss.slice(0, 4);

  // (2) Document type drives the score.
  const docMeans = meanScoreByDocType();
  const docItems: BarItem[] = docMeans.map((d) => ({
    label: `${d.label} (n=${d.n})`,
    value: d.value,
  }));
  const topDoc = docMeans[0];
  const bottomDoc = docMeans[docMeans.length - 1];

  // (3) Structure tracks with maturity.
  const structMeans = meanScoreByStructure();
  const structItems: BarItem[] = structMeans.map((s) => ({
    label: `${s.label} (n=${s.n})`,
    value: s.value,
  }));
  const topStruct = structMeans[0];

  // (4) How continuity is housed.
  const coop = coopSplit();
  // (5) Continuity-facility models.
  const altFacility = altFacilityModels();

  // (6) A handful of notable design decisions, spread across the gallery.
  const allDecisions = notableDecisions();
  const highlights = [0, 0.28, 0.55, 0.82]
    .map((f) => allDecisions[Math.floor(f * allDecisions.length)])
    .filter(Boolean);

  return (
    <div className="prose">
      <div className="page-head">
        <div className="eyebrow">What the plans reveal</div>
        <h1>Insights</h1>
        <p className="lead">
          {deepCoded} of the {totalPlans} cataloged continuity plans have been read
          end-to-end and scored against the{" "}
          <Link href="/benchmark/">{BENCHMARK_MAX}-component continuity benchmark</Link>.
          Here is what that full-text reading shows. Every figure is computed live from
          the dataset; see <Link href="/statistics/">Statistics</Link> for the full charts.
        </p>
      </div>

      <div className="statgrid" style={{ margin: "8px 0 24px" }}>
        <StatChip value={`${mean.toFixed(1)}/${BENCHMARK_MAX}`} label="Mean benchmark" />
        <StatChip value={`${min}–${max}`} label="Score range" />
        <StatChip value={perfect} label={`Perfect ${BENCHMARK_MAX}/${BENCHMARK_MAX}`} />
        <StatChip value={`${deepCoded} of ${totalPlans}`} label="Deep-coded" />
      </div>

      <h2>The field&rsquo;s blind spot is devolution</h2>
      <p>
        Across the deep-coded corpus, the components plans most often <em>fail</em> to
        address are the ones that keep an institution running when its leaders and its
        primary site are unavailable. The most commonly missing are{" "}
        {topMissing.map((m, i) => (
          <span key={m.label}>
            {i > 0 ? (i === topMissing.length - 1 ? ", and " : ", ") : ""}
            <strong>{componentLabel(m.label).toLowerCase()}</strong> ({m.value})
          </span>
        ))}
        . Succession, delegation, and devolution planning are precisely what a continuity
        program exists to provide, yet they are the first things public plans leave
        out.
      </p>
      {missItems.length > 0 && (
        <div className="panel">
          <h3>Most commonly missing benchmark components</h3>
          <BarChart items={missItems} color="amber" />
        </div>
      )}

      <h2>Document type drives the score</h2>
      <p>
        What a document is called matters less than what kind of document it is. Purpose-built{" "}
        <strong>full continuity-of-operations plans</strong> score far higher than narrower
        instruments:{" "}
        {topDoc && bottomDoc ? (
          <>
            <strong>{topDoc.label}</strong> documents average{" "}
            <strong>
              {topDoc.value}/{BENCHMARK_MAX}
            </strong>{" "}
            ({topDoc.n} plans), while <strong>{bottomDoc.label}</strong> documents average just{" "}
            <strong>
              {bottomDoc.value}/{BENCHMARK_MAX}
            </strong>{" "}
            ({bottomDoc.n}), low by design, since they cover a single slice of continuity.
          </>
        ) : (
          <>full plans score far higher than narrower, single-purpose documents.</>
        )}{" "}
        A low score usually reflects a narrow scope, not a weak program.
      </p>
      {docItems.length > 0 && (
        <div className="panel">
          <h3>Mean benchmark by document type</h3>
          <BarChart items={docItems} max={BENCHMARK_MAX} color="green" />
        </div>
      )}

      <h2>Structure tracks with maturity</h2>
      <p>
        How a plan is organized is a reliable tell. Among deep-coded plans, the
        highest-scoring organizing structure is{" "}
        <strong>{topStruct?.label}</strong> (mean{" "}
        <strong>
          {topStruct?.value}/{BENCHMARK_MAX}
        </strong>{" "}
        across {topStruct?.n} plans). Building a plan around an explicit inventory of
        essential functions (rather than around departments or incident phases)
        is generally the mark of a more developed program. Explore them in the{" "}
        <Link href="/chapters/essential-functions-based/">essential-functions-based exemplars</Link> chapter.
      </p>
      {structItems.length > 0 && (
        <div className="panel">
          <h3>Mean benchmark by organizing structure</h3>
          <BarChart items={structItems} max={BENCHMARK_MAX} color="violet" />
        </div>
      )}

      <h2>How continuity is housed</h2>
      <p>
        Institutions disagree about where continuity should live. Some fold it into a
        broader emergency plan, some maintain a standalone COOP document, and some run a
        program that governs many unit-level plans. The split across the deep-coded corpus:
      </p>
      {coop.length > 0 && (
        <div className="panel">
          <h3>Continuity treatment</h3>
          <BarChart items={coop} />
        </div>
      )}

      <h2>Continuity-facility models</h2>
      <p>
        When the primary site is lost, where does the work go? Plans name a range of
        strategies (physical alternate sites, distributed telework, reciprocal
        mutual-aid arrangements, and cloud-hosted operations), and a notable share
        state no model at all.
      </p>
      {altFacility.length > 0 && (
        <div className="panel">
          <h3>Alternate-facility model</h3>
          <BarChart items={altFacility} />
        </div>
      )}

      <h2>Notable design decisions</h2>
      <p>
        The real payoff of reading plans in full is the transferable ideas. A few examples
        (each quoted verbatim from its source), then the full gallery:
      </p>
      {highlights.length > 0 ? (
        highlights.map((d) => (
          <div className="unusual" key={d.plan_id + d.decision.slice(0, 24)}>
            <div className="obs">
              {d.decision},{" "}
              <Link href={`/plans/${d.plan_id}/`} style={{ fontWeight: 400 }}>
                {d.institution_name}
              </Link>
            </div>
            <div className="ev">&ldquo;{d.quote}&rdquo;</div>
          </div>
        ))
      ) : (
        <p className="muted">No notable decisions have been coded yet.</p>
      )}
      {allDecisions.length > 0 && (
        <p>
          <Link
            href="/insights/notable-decisions/"
            className="btn btn-primary"
            style={{ padding: "10px 16px", display: "inline-block" }}
          >
            Explore all {allDecisions.length} notable decisions &rarr;
          </Link>
        </p>
      )}

      <div className="callout">
        These are observations from a fully sourced dataset: every figure traces back
        to a plan you can open, and every quote is verbatim. Want to run your own analysis?{" "}
        <Link href="/downloads/">Download the data</Link>.
      </div>
    </div>
  );
}
