// Curated editorial collections ("Chapters"): data-driven groupings over the
// catalog, resolved at build time. Predicates read the master + deep records.

import { getPlans, getDeep, getSlim } from "./data";
import type { Plan, DeepRecord, SlimPlan } from "./types";

export interface Chapter {
  slug: string;
  title: string;
  blurb: string;
  match: (plan: Plan, deep?: DeepRecord) => boolean;
}

export const CHAPTERS: Chapter[] = [
  {
    slug: "perfect-scores",
    title: "Perfect 22/22 plans",
    blurb:
      "Plans that satisfy every component of the 22-component continuity benchmark: the closest thing to a model campus COOP.",
    match: (_p, d) => d?.benchmark_present === 22,
  },
  {
    slug: "full-coop",
    title: "Full institutional COOPs",
    blurb:
      "Institution-wide continuity-of-operations plans: the genre with the broadest benchmark exposure (and the highest mean score).",
    match: (p) => p.document_type === "full-coop",
  },
  {
    slug: "with-devolution",
    title: "Plans that address devolution",
    blurb:
      "Devolution (transferring essential functions to a separate site or staff) is the field's single biggest blind spot (38 of 40 deep-coded plans miss it). These are the exceptions.",
    match: (_p, d) => !!d && !d.benchmark_missing.includes("devolution"),
  },
  {
    slug: "it-dr",
    title: "IT disaster-recovery plans",
    blurb:
      "IT disaster-recovery / system-contingency plans: the technical backbone of continuity, scored against the same benchmark.",
    match: (p) => p.document_type === "it-dr",
  },
  {
    slug: "academic-continuity",
    title: "Academic continuity plans",
    blurb:
      "Continuity of instruction / academic-continuity plans: the component that makes a plan a campus COOP rather than a generic government one.",
    match: (p) => p.document_type === "academic-continuity",
  },
  {
    slug: "templates",
    title: "Unit COOP templates",
    blurb:
      "Blank or sample continuity templates institutions publish for their departments to complete, a window into what each campus asks its units to plan for.",
    match: (p) => p.document_type === "template",
  },
  {
    slug: "essential-functions-based",
    title: "Essential-functions-based exemplars",
    blurb:
      "Plans architected around essential functions and their recovery: the FCD 2 / FEMA CGC model, and the highest-scoring structure in the corpus (mean 14.2/22).",
    match: (p, d) =>
      (d?.organizing_structure_confirmed || p.organizing_structure) ===
      "essential-functions-based",
  },
  {
    slug: "phase-based",
    title: "Four-phase plans",
    blurb:
      "Plans built around the four continuity phases (readiness → activation → continuity operations → reconstitution).",
    match: (p, d) =>
      (d?.organizing_structure_confirmed || p.organizing_structure) === "phase-based",
  },
  {
    slug: "web-published",
    title: "Web-published (HTML) plans",
    blurb:
      "Institutions that publish continuity as a living web page or tool instead of a static PDF: the majority of the corpus, reflecting continuity-as-program.",
    match: (p) => p.file_format === "HTML",
  },
  {
    slug: "community-colleges",
    title: "Community & technical colleges",
    blurb:
      "Two-year institutions that put their continuity plans in public, a distinct planning context from large universities.",
    match: (p) =>
      p.institution_type === "community college" ||
      p.institution_type === "technical college",
  },
  {
    slug: "hbcus",
    title: "HBCUs",
    blurb: "Historically Black colleges and universities with public continuity plans.",
    match: (p) => p.institution_type === "HBCU",
  },
  {
    slug: "hsis",
    title: "Hispanic-Serving Institutions",
    blurb: "Hispanic-Serving Institutions with public continuity plans.",
    match: (p) => p.institution_type === "HSI",
  },
  {
    slug: "tribal-colleges",
    title: "Tribal colleges",
    blurb: "Tribal colleges and universities with public continuity plans.",
    match: (p) => p.institution_type === "tribal college",
  },
  {
    slug: "r1-universities",
    title: "R1 research universities",
    blurb:
      "The largest, highest-research-activity institutions and how they plan continuity at scale.",
    match: (p) => p.institution_type === "R1 university",
  },
  {
    slug: "religiously-affiliated",
    title: "Religiously affiliated universities",
    blurb: "Faith-based institutions that publish their continuity plans.",
    match: (p) => p.institution_type === "religiously affiliated university",
  },
  {
    slug: "system-offices",
    title: "System & district offices",
    blurb: "System- and district-level programs that govern continuity across many campuses at once.",
    match: (p) => p.institution_type === "system office",
  },
];

export function getChapter(slug: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}

export function chapterMembers(slug: string): SlimPlan[] {
  const ch = getChapter(slug);
  if (!ch) return [];
  const out: SlimPlan[] = [];
  for (const p of getPlans()) {
    const d = getDeep(p.plan_id);
    if (ch.match(p, d)) {
      const s = getSlim(p.plan_id);
      if (s) out.push(s);
    }
  }
  return out.sort(
    (a, b) =>
      (b.benchmark_present ?? -1) - (a.benchmark_present ?? -1) ||
      a.institution_name.localeCompare(b.institution_name)
  );
}

export function chapterSummaries(): {
  slug: string;
  title: string;
  blurb: string;
  count: number;
}[] {
  return CHAPTERS.map((c) => ({
    slug: c.slug,
    title: c.title,
    blurb: c.blurb,
    count: chapterMembers(c.slug).length,
  }));
}
