import type { Metadata } from "next";
import Link from "next/link";
import { getStats, getDeepList } from "@/lib/data";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/format";

export const metadata: Metadata = {
  title: "About / how this was built",
  description:
    "Provenance, the confirmed-vs-link-only distinction, and the session-by-session history of how the Campus COOP Archive was built.",
};

export default function AboutPage() {
  const stats = getStats();
  const deep = getDeepList();

  return (
    <div className="prose">
      <div className="page-head">
        <div className="eyebrow">Provenance</div>
        <h1>How this was built</h1>
        <p className="lead">
          {SITE_NAME} is {SITE_TAGLINE.charAt(0).toLowerCase() + SITE_TAGLINE.slice(1)}{" "}
          It is a sibling project to the{" "}
          <a href="https://campusalertarchive.com" target="_blank" rel="noopener noreferrer">
            Campus Alert Archive
          </a>{" "}
          and the{" "}
          <a href="https://campus-eop-archive.vercel.app" target="_blank" rel="noopener noreferrer">
            Higher Ed EOP Atlas
          </a>
          . It currently holds {stats.totals.plans} plans across{" "}
          {stats.totals.states_covered} states and DC, {deep.length} of them read in full
          and scored against the continuity benchmark.
        </p>
      </div>

      <h2>An AI-assisted, source-anchored build</h2>
      <p>
        The catalog was compiled with AI research agents that searched official{" "}
        <code>.edu</code> hosts and public-safety pages, opened candidate documents, and
        returned structured records, each with a verbatim evidence quote. A
        deterministic Python pipeline de-duplicates and normalizes those records into the
        master datasets that drive this site. No datapoint is published without a primary
        source: see the <Link href="/methodology/">methodology</Link>.
      </p>

      <h2>Confirmed vs. link-only</h2>
      <p>
        Nothing is hidden behind a single &ldquo;verified&rdquo; label. Of the{" "}
        {stats.totals.plans} records,{" "}
        <strong>{stats.totals.opened_and_confirmed || 0}</strong> are
        opened-and-confirmed (a researcher read the evidence quote directly from the
        document or its official page) and{" "}
        <strong>{stats.by_verification["link-only"] || 0}</strong> are link-only (the
        URL resolves on an official host but the bytes were not personally rendered).
        Readers can weight each record by how it was confirmed.
      </p>

      <h2>How it was assembled</h2>
      <ul>
        <li>
          <strong>Discovery waves.</strong> Successive parallel research passes swept
          distinct lanes (US regions, private/liberal-arts, community colleges and
          system offices, and gap-filling sweeps for HBCUs, HSIs, tribal colleges, and
          specialized institutions), growing the catalog to national coverage across{" "}
          {stats.totals.states_covered} states and DC.
        </li>
        <li>
          <strong>The continuity benchmark.</strong> A fully cited reference catalogs the
          federal and consensus continuity doctrine, drawing on FCD&nbsp;1, FCD&nbsp;2, the
          FEMA Continuity Guidance Circular (CGC), NIST&nbsp;SP&nbsp;800-34, ISO&nbsp;22301,
          and NFPA&nbsp;1600, and synthesizes them into a 22-component scoring checklist.
        </li>
        <li>
          <strong>Deep-analysis layer.</strong> A growing subset of plans is read in
          full and coded against that benchmark, with essential-function inventories,
          alternate-facility models, and notable decisions, each backed by an evidence
          quote.
        </li>
      </ul>

      <h2>Provenance and ethics</h2>
      <p>
        AI-assisted compilation; sources linked, not redistributed. Source documents
        remain the work of their respective institutions. This is a research index and
        analysis layer over
        publicly available material, not a census: institutions that keep their plans
        internal are absent, and that absence is not evidence they lack a plan.
      </p>
    </div>
  );
}
