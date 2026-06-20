import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "How to suggest a plan, report a broken link, or send a correction to the Campus COOP Archive.",
};

export default function Page() {
  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Contact</div>
        <h1>Get in touch</h1>
        <p className="lead">
          Corrections, suggestions, and questions are all welcome. This is a
          static site with no backend, so there is no contact form. Everything
          runs through GitHub, where the conversation stays public and easy to
          track.
        </p>
      </div>
      <div className="prose">
        <div className="callout">
          The best way to reach the archive is to open an issue on GitHub. It
          creates a public, trackable record, and it keeps every correction tied
          to the plan it is about. Start here:{" "}
          <a
            href="https://github.com/kjpacct202/campuscooparchive/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/kjpacct202/campuscooparchive/issues
          </a>
          .
        </div>

        <h2>Suggest a plan or a correction</h2>
        <p>
          Know of a continuity plan we have not cataloged, or spotted something
          we got wrong? Open an issue on the GitHub repo. This is the best
          channel by far, because it puts your suggestion on the public record
          and lets anyone follow the fix from start to finish.
        </p>
        <p>
          A good issue tells us a few things:
        </p>
        <ul>
          <li>The institution and the name of the plan.</li>
          <li>A link to the source document, if you have one.</li>
          <li>What should change, and why.</li>
        </ul>
        <p>
          Open one here:{" "}
          <a
            href="https://github.com/kjpacct202/campuscooparchive/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/kjpacct202/campuscooparchive/issues
          </a>
          .
        </p>

        <h2>Found a broken link or a wrong quote?</h2>
        <p>
          Source links rot and quotes get garbled, so please flag anything that
          looks off. Open an issue and include the plan it relates to and the
          source URL in question. That gives us enough to confirm the problem
          and post a fix quickly.
        </p>

        <h2>About the maintainer</h2>
        <p>
          The Campus COOP Archive is maintained by the same person behind the
          Campus Alert Archive, an AI-assisted research project. The work
          happens in the open: you can browse the data, the methods, and the
          full history of changes on{" "}
          <a
            href="https://github.com/kjpacct202/campuscooparchive"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          . If you have a question that is not a correction, an issue still works
          well, and it might help the next person with the same question.
        </p>
        <p>
          New here? Start with the{" "}
          <Link href="/about">about page</Link> or browse the{" "}
          <Link href="/plans">catalog of plans</Link>.
        </p>
      </div>
    </div>
  );
}
