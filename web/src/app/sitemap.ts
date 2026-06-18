import type { MetadataRoute } from "next";
import { getPlans, getInstitutions } from "@/lib/data";
import { CHAPTERS } from "@/lib/chapters";
import { SITE_URL } from "@/lib/format";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const staticPaths = [
    "",
    "browse",
    "compare",
    "institutions",
    "chapters",
    "wisdom",
    "insights",
    "insights/notable-decisions",
    "statistics",
    "benchmark",
    "downloads",
    "methodology",
    "about",
  ];
  const top: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${base}/${p}${p ? "/" : ""}`,
    priority: p === "" ? 1 : 0.7,
  }));
  const chapters: MetadataRoute.Sitemap = CHAPTERS.map((c) => ({
    url: `${base}/chapters/${c.slug}/`,
    priority: 0.6,
  }));
  const plans: MetadataRoute.Sitemap = getPlans().map((p) => ({
    url: `${base}/plans/${p.plan_id}/`,
    priority: 0.6,
  }));
  const institutions: MetadataRoute.Sitemap = getInstitutions().map((i) => ({
    url: `${base}/institutions/${i.institution_id}/`,
    priority: 0.5,
  }));
  return [...top, ...chapters, ...plans, ...institutions];
}
