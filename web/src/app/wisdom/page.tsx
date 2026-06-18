import type { Metadata } from "next";
import Link from "next/link";
import { wisdom } from "@/lib/wisdom";
import { getDeepList, getStats } from "@/lib/data";

export const metadata: Metadata = {
  title: "Wisdom",
  description:
    "The best transferable lessons synthesized from every deep-coded campus continuity plan — each backed by a verbatim quote from its source.",
};

export default function WisdomPage() {
  const deep = getDeepList();
  const stats = getStats();

  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Best wisdom from the whole corpus</div>
        <h1>Wisdom</h1>
        <p className="lead">{wisdom.headline}</p>
      </div>

      <div className="callout">
        Synthesized from all <strong>{deep.length}</strong> plans read in full and scored
        against the federal benchmark (of {stats.totals.plans} cataloged). Every quote below is
        <strong> verbatim</strong> from its source plan and links to that plan. Go deeper in the{" "}
        <Link href="/insights/">findings</Link>, the{" "}
        <Link href="/insights/notable-decisions/">full decisions gallery</Link>, and the{" "}
        <Link href="/statistics/">statistics</Link> — or read the{" "}
        <Link href="/methodology/">methodology</Link>.
      </div>

      {wisdom.themes.map((t, i) => (
        <section className="wisdom-theme" key={i}>
          <div className="wisdom-cat">{t.category}</div>
          <h2>
            {i + 1}. {t.title}
          </h2>
          <p>{t.insight}</p>
          <p className="steal">
            <strong>Steal this:</strong> {t.takeaway}
          </p>
          <div className="wisdom-ev">
            {t.evidence.map((e, j) => (
              <blockquote className="quote" key={j}>
                &ldquo;{e.quote}&rdquo;
                <footer>
                  &mdash;{" "}
                  {e.link ? (
                    <Link href={`/plans/${e.plan_id}/`}>{e.institution}</Link>
                  ) : (
                    e.institution
                  )}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      ))}

      <div className="callout" style={{ borderLeftColor: "var(--green)" }}>
        <strong>Run your own synthesis.</strong> This page distills the dataset, but the data is
        yours: <Link href="/downloads/">download the full archive</Link> and ask your own
        questions with ChatGPT, Claude, or NotebookLM.
      </div>
    </div>
  );
}
