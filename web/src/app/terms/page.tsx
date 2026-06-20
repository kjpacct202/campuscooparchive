import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "How you may use the Campus COOP Archive and its data, plus what we do and do not promise about accuracy.",
};

export default function Page() {
  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Terms</div>
        <h1>Terms of use</h1>
        <p className="lead">
          How you may use the archive and its data, in plain language.
        </p>
      </div>
      <div className="prose">
        <h2>The data</h2>
        <p>
          The Campus COOP Archive is a research index built over continuity
          documents that institutions have already published publicly: COOP and
          business continuity plans, academic continuity plans, and IT disaster
          recovery plans.
        </p>
        <p>
          We catalog, score, and link to those documents. We do not host or
          redistribute them. Each source document remains the work and property
          of the institution that produced it, and we point you to the primary
          source so you can read it where it lives.
        </p>

        <h2>Fair use &amp; citation</h2>
        <p>
          You are welcome to read the archive, quote from it, and cite it in
          your own work, whether that is journalism, scholarship, planning, a
          class project, or simple curiosity. Linking to pages here is always
          fine.
        </p>
        <p>
          When you use what you find, please do two things: cite the Campus COOP
          Archive so others can retrace your steps, and link to the primary
          source document so readers can verify the underlying record for
          themselves. Verifiability is the whole point of this project.
        </p>
        <div className="callout">
          Please cite us. If our scoring or links helped your work, name the
          Campus COOP Archive and link straight to the institution&apos;s
          original document. A citation costs you nothing and keeps the chain of
          evidence intact.
        </div>

        <h2>No warranties</h2>
        <p>
          The archive is provided as-is. We work carefully, but we do not
          guarantee that every entry, score, link, or date is accurate or
          current. Documents move, get revised, or come down. Our reading of a
          plan against the 22-component benchmark is a considered judgment, not
          an official rating.
        </p>
        <p>
          Before you rely on anything here for a decision that matters, verify it
          against the primary source. If something looks wrong, the source
          document wins, and we would be glad to hear about it.
        </p>

        <h2>Acceptable use</h2>
        <p>
          A few simple asks. Do not present the archive&apos;s scores or notes
          as official records of any institution: they are our independent
          analysis, not statements from the schools themselves. Do not use the
          data to mislead, and do not imply that an institution endorsed or
          reviewed our coverage of it.
        </p>
        <p>
          Please also be a good neighbor technically. Do not scrape the site
          abusively or in a way that degrades it for others. The dataset is open
          (see below), so there is no need to hammer the pages: take the data at
          the source instead.
        </p>

        <h2>Open source</h2>
        <p>
          The code that runs this site and the dataset behind it both live on
          GitHub. You can read how the scoring works, check the records, open an
          issue, or suggest a correction there.
        </p>
        <p>
          Browse the repository at{" "}
          <a
            href="https://github.com/kjpacct202/campuscooparchive"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/kjpacct202/campuscooparchive
          </a>
          . For questions, corrections, or contact, please go through GitHub.
        </p>
        <p>
          Curious how we read the plans? See the{" "}
          <Link href="/methodology">methodology</Link> or start from the{" "}
          <Link href="/">homepage</Link>.
        </p>
      </div>
    </div>
  );
}
