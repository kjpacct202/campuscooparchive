import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "What qualifies for inclusion, how each record is verified, the confirmed-vs-link-only standard, and an honest account of the dataset's limits.",
};

export default function MethodologyPage() {
  return (
    <div className="prose">
      <div className="page-head">
        <div className="eyebrow">How this works</div>
        <h1>Methodology &amp; verification standard</h1>
        <p className="lead">
          This project catalogs real, publicly published continuity of operations
          plans from US colleges and universities and analyzes their structure and
          content. It inherits the core principle of its sister project, the Campus
          Alert Archive: <strong>every datapoint is traceable to a primary source that
          any skeptic can check.</strong>
        </p>
      </div>

      <h2>What qualifies for inclusion</h2>
      <p>
        A record must be a specific US institution&rsquo;s (or system&rsquo;s) own
        published continuity plan, publicly accessible online. Accepted plan types
        include the Continuity of Operations Plan (COOP), Business Continuity Plan
        (BCP), Business Continuity Program, Continuity Plan, Continuity of Instruction
        / Academic Continuity Plan, IT Disaster Recovery Plan, IT Continuity Plan, and
        a Continuity of Operations Guide/Template that an institution publishes as its
        own working framework.
      </p>
      <p>
        We classify each document by its form as well. The{" "}
        <strong>document type</strong> taxonomy is: <strong>full-coop</strong> (a
        complete, standalone continuity-of-operations plan);{" "}
        <strong>business-continuity-framework</strong> (a program-level or
        framework-style business continuity document);{" "}
        <strong>department-level</strong> (a continuity plan scoped to a single unit or
        division); <strong>academic-continuity</strong> (a continuity-of-instruction
        plan); <strong>it-dr</strong> (an IT disaster-recovery or IT continuity plan);
        and <strong>template</strong> (an institution&rsquo;s own published
        guide/template intended to be filled in by departments).
      </p>
      <p>
        Explicitly excluded: blank vendor templates and consultant samples; another
        agency&rsquo;s or state&rsquo;s plan; K-12 district plans; news articles and
        slide decks; single-building fire-evacuation sheets; and pages that merely
        mention a plan without a public document. Non-US institutions are out of scope.
      </p>

      <h2>How each record is verified</h2>
      <p>Every record carries three verification fields:</p>
      <ul>
        <li>
          <strong>Source URL</strong>: a direct link to the document (PDF/HTML/DOCX) on
          an official institutional host, or the plan page itself for HTML plans.
        </li>
        <li>
          <strong>Date accessed</strong>: the ISO date the record was checked.
        </li>
        <li>
          <strong>Evidence quote</strong>: a short verbatim excerpt from the document
          or its official hosting page (typically the title block, a promulgation line,
          or a framework-adoption sentence) that proves the document is what we say it
          is.
        </li>
      </ul>
      <p>Records are then graded with a verification badge:</p>
      <ul>
        <li>
          <span className="badge badge--ok">&#10003; Confirmed</span>,{" "}
          <strong>opened-and-confirmed</strong>: a researcher loaded the document or its
          official page and read the evidence quote directly from it.
        </li>
        <li>
          <span className="badge badge--link">Link-only</span>: the direct URL
          resolves on an official host and the title/quote are confirmed via a search
          index or landing page, but the document bytes were not personally rendered
          (usually a transient fetch limit or a viewer that blocks text extraction).
        </li>
      </ul>
      <p>
        Of the 210 plans across 207 institutions in this catalog, 175 are
        opened-and-confirmed; the remainder are link-only.
      </p>

      <h2>Honesty about the continuity flags</h2>
      <p>
        Each record carries seventeen boolean continuity flags drawn from the federal
        and consensus continuity frameworks: identifies essential functions, business
        impact analysis, orders of succession, delegations of authority, alternate
        facilities, continuity communications, vital records, defines RTO, a test /
        training / exercise (TT&amp;E) program, devolution, reconstitution, addresses
        academic continuity, addresses IT disaster recovery, references FCD&nbsp;1,
        references NIST&nbsp;SP&nbsp;800-34, references ISO&nbsp;22301, and a public
        redacted version. At the discovery stage these are derived from the brief text
        each researcher captured, not from a full read of every plan body. They are
        therefore <strong>conservative lower bounds</strong>: a flag only fires where
        the captured text shows it, so a plan can address a continuity element without
        the flag firing. The deep-analysis layer replaces these with
        full-text-verified values and per-claim evidence quotes.
      </p>

      <h2>The benchmark</h2>
      <p>
        For the 40 deep-coded plans we score each plan against a 22-component
        continuity benchmark drawn from the same framework family: FEMA&rsquo;s
        Continuity Guidance Circular (CGC) and Federal Continuity Directives,
        NIST&nbsp;SP&nbsp;800-34, ISO&nbsp;22301, and NFPA&nbsp;1600. A plan&rsquo;s
        score is the count of components present, from 0 to a maximum of 22. The
        benchmark is descriptive, not a compliance grade: it measures how completely a
        published plan addresses the recognized elements of continuity practice, not
        whether the institution is prepared.
      </p>

      <h2>Known limitations</h2>
      <ul>
        <li>
          <strong>Survivorship bias toward transparency.</strong> The dataset captures
          institutions that <em>publish</em> their plans. Many institutions (especially
          elite privates and several state systems) keep continuity plans internal or
          release only redacted versions; their absence is not evidence they lack a
          plan.
        </li>
        <li>
          <strong>Currency.</strong> Some posted plans are several years old. We record
          the most recent public version and the date as stated; institutions revise on
          different cycles.
        </li>
        <li>
          <strong>Public &ne; complete.</strong> A redacted public copy may omit
          sensitive annexes; these are flagged.
        </li>
      </ul>

      <h2>Use and attribution</h2>
      <p>
        Source documents remain the work of their respective institutions and are
        linked, not redistributed. This catalog is a research index and analysis layer
        over publicly available documents.
      </p>
    </div>
  );
}