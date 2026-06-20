import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "What the Campus COOP Archive is, what it isn't, and how to use it responsibly.",
};

export default function Page() {
  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Disclaimer</div>
        <h1>Disclaimer</h1>
        <p className="lead">
          The Campus COOP Archive is a research index of US higher-education
          continuity plans (COOP, BCP, academic-continuity, and IT-DR
          documents). It is a finding aid that points you to primary sources. It
          is not an official record, and it is not a substitute for any
          institution's own current plan.
        </p>
      </div>
      <div className="prose">
        <div className="callout">
          This is a research index, not an official record. Every claim here is
          meant to be checked against the institution's own primary source, and
          the source link always wins.
        </div>

        <h2>Verification levels</h2>
        <p>
          The whole point of this project is that you do not have to take our
          word for anything. Every record carries three things: a verbatim
          evidence quote pulled from the source, a link to that source, and a
          verification badge that tells you how far we got.
        </p>
        <ul>
          <li>
            <strong>Opened-and-confirmed:</strong> a person opened the document
            or page, read it, and confirmed the evidence quote against the
            actual text. 175 of the 210 plans carry this badge.
          </li>
          <li>
            <strong>Link-only:</strong> the source link resolves and the record
            is grounded in it, but the full open-and-confirm pass has not been
            completed yet. Treat these as leads, and check the source yourself.
          </li>
        </ul>
        <p>
          When a badge and a source disagree, the source is correct. If you find
          a mismatch, please flag it on{" "}
          <a href="https://github.com/kjpacct202/campuscooparchive">GitHub</a>.
        </p>

        <h2>AI-assisted compilation</h2>
        <p>
          Discovery (finding the plans) and coding (scoring them against the
          22-component continuity benchmark) are AI-assisted. That speeds the
          work up, but it does not get the final say. Every record is
          independently checkable through its primary source, which is exactly
          why the evidence quote and the source link sit on every entry.
        </p>
        <p>
          The Python pipeline is the single source of truth. The numbers, badges,
          and scores you see on the site are generated from that pipeline, not
          hand-edited into the pages. If you want to audit how a record was
          produced, the code is public on{" "}
          <a href="https://github.com/kjpacct202/campuscooparchive">GitHub</a>.
        </p>

        <h2>Not professional advice</h2>
        <p>
          Nothing in this archive is legal advice, emergency-management advice,
          or continuity-planning advice for your institution. The benchmark is a
          research lens for comparing documents, not a compliance checklist and
          not a recommendation about what your campus should do.
        </p>
        <p>
          If you are building or revising a real plan, consult qualified
          professionals: your emergency management office, counsel, and the
          continuity standards that apply to your institution.
        </p>

        <h2>Point-in-time</h2>
        <p>
          Plans change. A document we captured may have since been revised,
          replaced, or pulled offline. Every record reflects what the source
          said at the moment it was reviewed, not necessarily what it says today.
        </p>
        <p>
          Before you rely on anything here, check the institution's current
          official version. If you spot a stale link or an updated plan, let us
          know on{" "}
          <a href="https://github.com/kjpacct202/campuscooparchive">GitHub</a>{" "}
          so the record can be refreshed.
        </p>

        <h2>Coverage is a sample, not a census</h2>
        <p>
          The archive currently holds 210 plans across 207 institutions in 47
          states plus DC, with 40 deep-coded against the full benchmark (mean
          score 13.1 of 22). That is a meaningful sample, but it is not the whole
          country.
        </p>
        <p>
          Absence of a plan here is not evidence that one does not exist. Many
          institutions keep their continuity documents behind logins or simply
          off the public web, so a blank is a gap in our coverage, not a verdict
          on the campus. Known gaps include Hawaii, Maine, and Wyoming.
        </p>
        <p>
          Want to fill a gap or correct a record? See{" "}
          <Link href="/methodology">the methodology</Link> for how records are
          built, or open an issue on{" "}
          <a href="https://github.com/kjpacct202/campuscooparchive">GitHub</a>.
        </p>
      </div>
    </div>
  );
}
