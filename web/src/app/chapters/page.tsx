import type { Metadata } from "next";
import Link from "next/link";
import { chapterSummaries } from "@/lib/chapters";

export const metadata: Metadata = {
  title: "Chapters",
  description:
    "Curated collections of campus continuity (COOP) plans — perfect-scoring exemplars, essential-functions-based plans, IT disaster recovery, academic continuity, and more.",
};

export default function ChaptersPage() {
  const chapters = chapterSummaries().filter((c) => c.count > 0);
  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Curated collections</div>
        <h1>Chapters</h1>
        <p className="lead">
          Hand-picked slices of the catalog — entry points into the plans worth studying
          together. Every chapter is generated live from the dataset.
        </p>
      </div>
      <div className="entrygrid">
        {chapters.map((c) => (
          <Link key={c.slug} href={`/chapters/${c.slug}/`} className="entry">
            <h3>{c.title}</h3>
            <p>{c.blurb}</p>
            <p className="muted small" style={{ marginTop: 10 }}>
              {c.count} {c.count === 1 ? "plan" : "plans"} &rarr;
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
