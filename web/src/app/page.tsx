import Link from "next/link";
import { StatChip } from "@/components/StatChip";
import { PlanCard } from "@/components/PlanCard";
import { getStats, getDeepList, getSlim } from "@/lib/data";
import { SITE_NAME, SITE_TAGLINE, SITE_EYEBROW, SITE_URL } from "@/lib/format";
import type { SlimPlan } from "@/lib/types";

export default function HomePage() {
  const stats = getStats();
  const deep = getDeepList();
  const meanScore = stats.totals.mean_benchmark;
  const confirmed = stats.totals.opened_and_confirmed;

  // Featured = the two perfect 22/22 continuity exemplars.
  const featured = [
    "california-state-university-bakersfield",
    "university-of-houston-downtown",
  ]
    .map((id) => getSlim(id))
    .filter(Boolean) as SlimPlan[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: SITE_NAME,
    description: SITE_TAGLINE,
    url: SITE_URL,
    creator: { "@type": "Organization", name: "Campus Alert Archive" },
    distribution: [
      { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: `${SITE_URL}/downloads/campus-coop-archive-everything.json` },
      { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `${SITE_URL}/downloads/plans.csv` },
    ],
    keywords: ["continuity of operations plan", "COOP", "business continuity", "higher education", "academic continuity", "IT disaster recovery", "FCD 1", "ISO 22301"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="hero">
        <div className="eyebrow">{SITE_EYEBROW}</div>
        <h1>The continuity plans US campuses actually publish, read, scored, and free to download.</h1>
        <p className="lead">
          {SITE_TAGLINE} Every record links to its primary source and a verbatim evidence
          quote. A growing subset is read in full and scored against the 22-component
          continuity benchmark, and the whole dataset is yours to export and analyze.
        </p>
        <div className="cta-row">
          <Link href="/browse/" className="btn btn-primary" style={{ padding: "11px 18px" }}>
            Browse {stats.totals.plans} plans &rarr;
          </Link>
          <Link href="/downloads/" className="btn" style={{ padding: "11px 18px" }}>
            Download the data
          </Link>
        </div>
      </section>

      {/* At a glance */}
      <section>
        <h2 className="section-eyebrow">The Archive at a glance</h2>
        <div className="statgrid">
          <StatChip value={stats.totals.plans} label="Plans cataloged" />
          <StatChip value={`${stats.totals.states_covered}`} label="States + DC" />
          <StatChip value={confirmed} label="Opened & confirmed" />
          <StatChip value={deep.length} label="Deep-coded in full" />
          <StatChip value={`${meanScore.toFixed(1)}/22`} label="Mean benchmark" />
        </div>
      </section>

      {/* The bigger idea */}
      <section className="bigidea">
        <h2>The bigger idea</h2>
        <p>
          Most campus continuity plans sit in administrative PDFs nobody compares. There is
          no shared format, no registry, and no easy way to ask &ldquo;who does this well?&rdquo;
          Reading and coding hundreds of them by hand would take a team months.
        </p>
        <p>
          AI changes the economics of that work. Every plan in this Archive was found on an
          official source, captured with a verbatim quote a skeptic can check, and a subset
          has been read end-to-end and scored against the same continuity standard,
          so a continuity planner can finally <em>learn from the field</em> instead of
          starting from a blank page.
        </p>
      </section>

      {/* How it works */}
      <section>
        <h2 className="section-eyebrow">How it works</h2>
        <div className="steps">
          <div className="step">
            <span className="step-n">1</span>
            <h3>Browse &amp; filter</h3>
            <p>Search every continuity plan by state, document type, organizing structure, control, recency, and verification, or jump to any institution with ⌘K.</p>
            <Link href="/browse/">Browse the catalog &rarr;</Link>
          </div>
          <div className="step">
            <span className="step-n">2</span>
            <h3>Download</h3>
            <p>Export the whole dataset (or just your filtered slice) as CSV, JSON, or Excel. Free, no signup.</p>
            <Link href="/downloads/">Take the data with you &rarr;</Link>
          </div>
          <div className="step">
            <span className="step-n">3</span>
            <h3>Analyze with your AI</h3>
            <p>Drop the file into ChatGPT, Claude, NotebookLM, or Copilot and ask your own continuity questions, with prompt starters included.</p>
            <Link href="/downloads/">See prompt starters &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Featured exemplars */}
      {featured.length > 0 && (
        <section>
          <h2 className="section-eyebrow">Featured exemplars</h2>
          <p className="muted" style={{ marginTop: 0 }}>
            Plans that score a perfect 22/22 against the continuity benchmark: a good place to
            see what a complete campus COOP looks like.
          </p>
          {featured.map((p) => (
            <PlanCard key={p.plan_id} p={p} />
          ))}
        </section>
      )}

      {/* Take the data with you */}
      <section className="callout" style={{ borderLeftColor: "var(--green)" }}>
        <h2 style={{ marginTop: 0 }}>Take the data with you</h2>
        <p style={{ marginBottom: 12 }}>
          Every plan, every field, every citation: free to export in one click. Pull the
          whole archive or filter to the slice you want, then analyze it with your own tools.
        </p>
        <Link href="/downloads/" className="btn btn-primary" style={{ padding: "10px 16px" }}>
          Download the dataset &rarr;
        </Link>
      </section>

      {/* Explore */}
      <section>
        <h2 className="section-eyebrow">Explore</h2>
        <div className="entrygrid">
          <Link href="/wisdom/" className="entry">
            <h3>Wisdom</h3>
            <p>The best transferable lessons synthesized from the whole corpus, each backed by a verbatim quote.</p>
          </Link>
          <Link href="/insights/" className="entry">
            <h3>Insights</h3>
            <p>What reading every deep-coded plan reveals: findings plus a gallery of notable design decisions.</p>
          </Link>
          <Link href="/chapters/" className="entry">
            <h3>Chapters</h3>
            <p>Curated collections: perfect 22/22 plans, full-COOP documents, IT-DR plans, academic-continuity plans, and templates.</p>
          </Link>
          <Link href="/compare/" className="entry">
            <h3>Compare</h3>
            <p>Put up to four plans side by side across the 22 continuity components.</p>
          </Link>
          <Link href="/statistics/" className="entry">
            <h3>Statistics</h3>
            <p>Document-type mix, organizing-structure patterns, framework alignment, currency, and benchmark distribution.</p>
          </Link>
          <Link href="/benchmark/" className="entry">
            <h3>The benchmark</h3>
            <p>The 22-component continuity standard (FCD&nbsp;1/2, FEMA&nbsp;CGC, NIST&nbsp;800-34, ISO&nbsp;22301, NFPA&nbsp;1600), fully cited.</p>
          </Link>
          <Link href="/institutions/" className="entry">
            <h3>Institutions</h3>
            <p>The full roster of {stats.totals.institutions} institutions across 47 states and DC.</p>
          </Link>
          <Link href="/methodology/" className="entry">
            <h3>Methodology</h3>
            <p>What qualifies, how each record is verified, and an honest account of the limits.</p>
          </Link>
        </div>
      </section>
    </>
  );
}