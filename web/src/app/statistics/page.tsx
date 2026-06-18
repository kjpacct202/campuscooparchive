import type { Metadata } from "next";
import Link from "next/link";
import { getStats } from "@/lib/data";
import { BarChart, type BarItem } from "@/components/BarChart";
import { componentLabel, BENCHMARK_MAX } from "@/lib/format";
import {
  coopSplit,
  altFacilityModels,
  mostMissing,
} from "@/lib/insights";

export const metadata: Metadata = {
  title: "Statistics",
  description:
    "Aggregate statistics across the catalog: plan-type mix, organizing structures, document types, currency, transparency by sector, and continuity-benchmark distribution.",
};

function toItems(
  map: Record<string, number>,
  opts: { topN?: number; relabel?: (k: string) => string } = {}
): BarItem[] {
  let entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
  if (opts.topN) entries = entries.slice(0, opts.topN);
  return entries.map(([k, v]) => ({
    label: opts.relabel ? opts.relabel(k) : k,
    value: v,
  }));
}

const FLAG_LABELS: Record<string, string> = {
  identifies_essential_functions: "Identifies essential functions",
  business_impact_analysis: "Business impact analysis",
  orders_of_succession: "Orders of succession",
  delegations_of_authority: "Delegations of authority",
  alternate_facilities: "Alternate facilities",
  continuity_communications: "Continuity communications",
  vital_records: "Vital records",
  defines_rto: "Defines RTO/RPO",
  tt_e_program: "Tests/training/exercises",
  devolution: "Devolution",
  reconstitution: "Reconstitution",
  addresses_academic_continuity: "Academic continuity",
  addresses_it_dr: "IT disaster recovery",
  references_fcd1: "Cites FCD 1",
  references_nist80034: "Cites NIST 800-34",
  references_iso22301: "Cites ISO 22301",
  public_redacted_version: "Public redacted version",
};

export default function StatisticsPage() {
  const stats = getStats();
  const totalPlans = stats.totals.plans;
  const deepCoded = stats.deep.deep_coded;
  const mean = stats.totals.mean_benchmark;

  // Deep-layer distributions from precomputed nested stats.
  const bandKeys = ["0-4", "5-9", "10-14", "15-19", "20-22"] as const;
  const bandItems: BarItem[] = bandKeys.map((k) => ({
    label: k.replace("-", "–"),
    value: stats.deep.score_band_distribution[k] || 0,
  }));

  const missItems = mostMissing(10).map((c) => ({
    label: componentLabel(c.label),
    value: c.value,
  }));

  const byStructure: BarItem[] = Object.entries(stats.deep.mean_by_organizing_structure)
    .map(([label, g]) => ({ label: `${label} (n=${g.n})`, value: g.mean }))
    .sort((a, b) => b.value - a.value);
  const byDocType: BarItem[] = Object.entries(stats.deep.mean_by_document_type)
    .map(([label, g]) => ({ label: `${label} (n=${g.n})`, value: g.mean }))
    .sort((a, b) => b.value - a.value);

  const coop = coopSplit();
  const altFacility = altFacilityModels();

  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">The shape of the field</div>
        <h1>Statistics</h1>
        <p className="lead">
          Aggregates across all {totalPlans} cataloged continuity plans.
          Catalog-stage framework flags are conservative lower bounds. The
          deep-analysis layer below replaces them with full-text-verified values.
        </p>
      </div>

      <h2>Catalog</h2>
      <div className="panels">
        <div className="panel">
          <h3>Plans by state (top 15)</h3>
          <BarChart items={toItems(stats.by_state, { topN: 15 })} />
        </div>
        <div className="panel">
          <h3>Institution type</h3>
          <BarChart items={toItems(stats.by_institution_type, { topN: 12 })} />
        </div>
        <div className="panel">
          <h3>Plan type</h3>
          <BarChart items={toItems(stats.by_plan_type)} />
        </div>
        <div className="panel">
          <h3>Document type</h3>
          <BarChart items={toItems(stats.by_document_type)} />
        </div>
        <div className="panel">
          <h3>Organizing structure</h3>
          <BarChart items={toItems(stats.by_organizing_structure)} />
        </div>
        <div className="panel">
          <h3>Control</h3>
          <BarChart items={toItems(stats.by_control)} />
        </div>
        <div className="panel">
          <h3>Verification</h3>
          <BarChart items={toItems(stats.by_verification)} color="green" />
        </div>
        <div className="panel">
          <h3>File format</h3>
          <BarChart items={toItems(stats.by_file_format)} />
        </div>
        <div className="panel">
          <h3>Framework flags (lower bounds)</h3>
          <BarChart
            items={toItems(stats.framework_flags, { relabel: (k) => FLAG_LABELS[k] || k })}
            max={totalPlans}
          />
          <p className="sub">Out of {totalPlans} plans · catalog-stage minimums.</p>
        </div>
      </div>

      <h2 style={{ marginTop: 34 }}>Deep-analysis insights</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        {deepCoded} of {totalPlans} plans read in full and scored against the{" "}
        <Link href="/benchmark/">{BENCHMARK_MAX}-component continuity benchmark</Link> (mean{" "}
        {mean.toFixed(1)}/{BENCHMARK_MAX}).
      </p>
      <div className="panels">
        <div className="panel">
          <h3>Benchmark score (/{BENCHMARK_MAX}) distribution</h3>
          <BarChart items={bandItems} color="violet" />
          <p className="sub">Plans per score band.</p>
        </div>
        <div className="panel">
          <h3>Most-missing benchmark components</h3>
          <BarChart items={missItems} color="amber" />
          <p className="sub">Of {deepCoded} deep-coded plans.</p>
        </div>
        <div className="panel">
          <h3>Full-text coverage</h3>
          <BarChart
            items={[
              { label: "Deep-coded", value: deepCoded },
              { label: "Catalog-only", value: totalPlans - deepCoded },
            ]}
            max={totalPlans}
          />
          <p className="sub">Benchmark vs. catalog-level.</p>
        </div>
      </div>

      <h2 style={{ marginTop: 34 }}>Inside the {deepCoded} deep-coded plans</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        What full-text reading reveals: how continuity is housed, which
        alternate-facility models plans rely on, and which structures score best.
        See the{" "}
        <Link href="/insights/">narrative findings</Link> and the{" "}
        <Link href="/insights/notable-decisions/">notable-decisions gallery</Link>.
      </p>
      <div className="panels">
        <div className="panel">
          <h3>How continuity is housed</h3>
          <BarChart items={coop} max={deepCoded} color="green" />
          <p className="sub">Across {deepCoded} deep-coded plans.</p>
        </div>
        <div className="panel">
          <h3>Continuity-facility models</h3>
          <BarChart items={altFacility} max={deepCoded} color="amber" />
          <p className="sub">Across {deepCoded} deep-coded plans.</p>
        </div>
        <div className="panel">
          <h3>Mean score by organizing structure</h3>
          <BarChart items={byStructure} max={BENCHMARK_MAX} color="violet" />
          <p className="sub">Mean benchmark /{BENCHMARK_MAX} (n = plans in group).</p>
        </div>
        <div className="panel">
          <h3>Mean score by document type</h3>
          <BarChart items={byDocType} max={BENCHMARK_MAX} color="violet" />
          <p className="sub">Full plans score far higher than guides/templates.</p>
        </div>
      </div>
    </div>
  );
}
