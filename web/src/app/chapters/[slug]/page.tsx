import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CHAPTERS, getChapter, chapterMembers } from "@/lib/chapters";
import { PlanCard } from "@/components/PlanCard";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getChapter(params.slug);
  if (!c) return { title: "Chapter not found" };
  return { title: c.title, description: c.blurb };
}

export default function ChapterPage({ params }: { params: { slug: string } }) {
  const ch = getChapter(params.slug);
  if (!ch) notFound();
  const members = chapterMembers(params.slug);

  return (
    <div>
      <Link className="backlink" href="/chapters/">
        &larr; All chapters
      </Link>
      <div className="page-head">
        <div className="eyebrow">Collection</div>
        <h1>{ch.title}</h1>
        <p className="lead">{ch.blurb}</p>
        <p className="muted small">
          {members.length} {members.length === 1 ? "plan" : "plans"}
        </p>
      </div>
      {members.map((p) => (
        <PlanCard key={p.plan_id} p={p} />
      ))}
      {members.length === 0 && (
        <p className="muted">No plans match this collection yet.</p>
      )}
    </div>
  );
}
