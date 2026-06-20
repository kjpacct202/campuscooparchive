import type { Metadata } from "next";
import Link from "next/link";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { DownloadCard, type DownloadItem } from "@/components/DownloadCard";
import { PromptStarter } from "@/components/PromptStarter";
import { getStats, getDeepList } from "@/lib/data";

export const metadata: Metadata = {
  title: "Download the data",
  description:
    "Download the entire Campus COOP Archive for free (CSV, JSON, Excel, or one combined file) and drop it into ChatGPT, Claude, NotebookLM, or Copilot to ask your own questions. No account needed.",
};

function loadManifest(): DownloadItem[] {
  const p = join(process.cwd(), "public", "downloads", "downloads-manifest.json");
  if (!existsSync(p)) return [];
  return JSON.parse(readFileSync(p, "utf-8")) as DownloadItem[];
}

const GROUPS: { name: string; blurb: string }[] = [
  { name: "Everything", blurb: "The whole archive (plans, deep analysis, institutions, and aggregate stats) in one file. Best for uploading to an AI tool." },
  { name: "Catalog", blurb: "The full catalog: one row per plan (210) and per institution, with every field and the verbatim evidence quote." },
  { name: "Deep analysis", blurb: "The plans read in full and scored against the 22-component continuity benchmark: essential functions, recovery time objectives, and notable decisions." },
  { name: "Reference", blurb: "A plain-language field guide so you (and your AI) interpret every column correctly." },
];

const PROMPTS = [
  "Here is a dataset of US college & university continuity of operations (COOP) plans. Compare how these campus continuity plans handle devolution, and quote the strongest examples with their source institutions.",
  "Which plans define recovery time objectives (RTOs), and how? Show how the approaches differ across institutions.",
  "Summarize the academic-continuity provisions across these COOPs. Which plans treat continuity of instruction most thoroughly, and what do they cover?",
  "Which organizing structure (essential-functions-based, FCD-element-based, phase-based, departmental) tends to score highest against the 22-component continuity benchmark in this data, and why?",
];

export default function DownloadsPage() {
  const manifest = loadManifest();
  const stats = getStats();
  const deep = getDeepList();
  const byGroup = (g: string) => manifest.filter((m) => m.group === g);

  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Open data · free · no account needed</div>
        <h1>Take the continuity data with you</h1>
        <p className="lead">
          The entire Archive ({stats.totals.plans} sourced plans, {deep.length} read in
          full against the 22-component continuity benchmark) is free to export in one
          click. Pull the whole dataset below, or filter to just the slice you want on{" "}
          <Link href="/browse/">Browse</Link>, then drop it into ChatGPT, Claude,
          Google NotebookLM, or Microsoft Copilot and ask your own questions.
        </p>
      </div>

      {GROUPS.map((g) => {
        const items = byGroup(g.name);
        if (items.length === 0) return null;
        return (
          <section className="section" key={g.name}>
            <h2>{g.name}</h2>
            <p className="muted" style={{ marginTop: 0, maxWidth: "75ch" }}>{g.blurb}</p>
            <div className="dl-grid">
              {items.map((m) => (
                <DownloadCard key={m.file} item={m} />
              ))}
            </div>
          </section>
        );
      })}

      <hr className="divider" />

      <section className="section">
        <h2>Use it with your AI</h2>
        <p className="lead" style={{ fontSize: "1rem" }}>
          Download a file above (the one-file <strong>Everything</strong> bundle is the
          easiest), upload it to your AI tool of choice, paste one of these starters,
          and go from there.
        </p>
        <div className="prompt-grid">
          {PROMPTS.map((p) => (
            <PromptStarter key={p} prompt={p} />
          ))}
        </div>
      </section>

      <div className="callout">
        <strong>Every datapoint is checkable.</strong> Each plan carries a direct{" "}
        <code>source_url</code>, the <code>date_accessed</code>, and a verbatim{" "}
        <code>evidence_quote</code>. Source documents remain the work of their
        institutions and are linked, not redistributed. See the{" "}
        <Link href="/methodology/">methodology</Link>. The download includes a{" "}
        <code>DATA_DICTIONARY.md</code> explaining every field.
      </div>
    </div>
  );
}
