import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How the archive is built",
  description:
    "Almost all of the Campus COOP Archive was built with AI, under a strict verifiability standard, with every datapoint traceable to a primary source.",
};

export default function Page() {
  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">How it's built</div>
        <h1>How the archive is built</h1>
        <p className="lead">
          Almost all of this was built with AI, under a strict verifiability
          standard. The point is not that a machine did the work. The point is
          that you never have to take its word for anything.
        </p>
      </div>
      <div className="prose">
        <div className="callout">
          Every datapoint is traceable to a primary source a skeptic can check.
        </div>

        <h2>The pipeline</h2>
        <p>
          Behind the website sits a deterministic Python pipeline. It takes the
          raw discovery lanes (the lists of candidate institutions and the
          evidence gathered for each one) and turns them into the master
          datasets. Run it twice on the same inputs and you get the same output,
          every time.
        </p>
        <p>
          That pipeline is the single source of truth. The website does not
          compute anything of its own and it does not edit the data. It only
          reads the JSON the pipeline produces and renders it. If a number is
          wrong on a page, the fix happens upstream in the data, never by hand
          in the site.
        </p>

        <h2>AI-assisted, source-anchored</h2>
        <p>
          Research agents do the legwork. They look for candidate continuity
          plans on official .edu hosts, open the documents, and read them. For
          each plan that makes it in, an agent records three things: a verbatim
          evidence quote pulled straight from the document, the source URL it
          came from, and a verification badge noting whether the link was opened
          and confirmed to resolve.
        </p>
        <p>
          The rule that holds the whole thing together is simple: nothing is
          published without a primary source. No quote, no URL, no entry. Of the
          210 plans in the archive, 175 have been opened and confirmed against
          their live source. When a claim cannot be anchored to a document a
          reader can open, it does not go in.
        </p>

        <h2>The deep layer</h2>
        <p>
          A growing subset of the catalog goes further. These plans are read in
          full and scored against the 22-component continuity benchmark, the
          same rubric used across the archive so that any two plans can be
          compared on equal footing. So far 40 plans have been deep-coded this
          way, and the mean score across them is 13.1 out of 22.
        </p>
        <p>
          Deep coding is not just a number. When a plan makes a notable design
          decision (how it defines essential functions, how it sets recovery
          time objectives, how it handles delegations of authority) that
          decision is captured as a verbatim quote, so you can read what the
          plan actually says rather than how we summarized it.
        </p>

        <h2>Contributing</h2>
        <p>
          The project is open source. The data, the pipeline, and the website
          all live on{" "}
          <Link href="https://github.com/kjpacct202/campuscooparchive">
            GitHub
          </Link>
          , and the whole catalog is meant to be checked, challenged, and
          improved by people who know these plans better than any agent does.
        </p>
        <p>There are a few easy ways to help:</p>
        <ul>
          <li>
            Open an issue to suggest a plan we have missed. Point us at the .edu
            URL and we will run it through the pipeline.
          </li>
          <li>
            Open an issue for a correction. If a quote, a link, or a score looks
            wrong, tell us where and why.
          </li>
          <li>
            Open a pull request if you want to make the change yourself. The
            coding guide at <code>docs/CODING_GUIDE.md</code> in the repo
            documents the schema and includes a ready-to-run agent prompt, so
            your contribution lands in exactly the shape the pipeline expects.
          </li>
        </ul>
        <p>
          To keep contributions and questions in one public, trackable place, we
          route all contact through GitHub rather than email.
        </p>

        <h2>Siblings</h2>
        <p>
          This archive does not stand alone. It is built alongside the{" "}
          <Link href="/about">Campus Alert Archive</Link>, which catalogs how
          campuses warn their communities, and the Higher Ed EOP Atlas, which
          maps emergency operations plans. Same standard, same insistence on a
          source you can open, applied to a different corner of campus
          preparedness.
        </p>
      </div>
    </div>
  );
}
