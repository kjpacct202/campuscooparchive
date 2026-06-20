"use client";

import { useState } from "react";
import { Copy, Check, Quote } from "lucide-react";

type Fmt = "APA" | "MLA" | "BibTeX";

export default function CiteCard({
  planId,
  institution,
  planType,
  url,
  year,
  accessed,
}: {
  planId: string;
  institution: string;
  planType: string;
  url: string;
  year?: number | null;
  accessed: string;
  siteUrl?: string;
}) {
  const [fmt, setFmt] = useState<Fmt>("APA");
  const [copied, setCopied] = useState(false);
  const yr = year ?? "n.d.";

  const citations: Record<Fmt, string> = {
    APA: `${institution}. (${yr}). ${planType} [Continuity plan]. Campus COOP Archive. ${url}`,
    MLA: `${institution}. "${planType}." Campus COOP Archive, ${yr}, ${url}. Accessed ${accessed}.`,
    BibTeX: `@misc{${planId},\n  author = {${institution}},\n  title = {${planType}},\n  year = {${yr}},\n  howpublished = {\\url{${url}}},\n  note = {Campus COOP Archive; accessed ${accessed}}\n}`,
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(citations[fmt]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="cite-card" style={{ border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "14px 16px", background: "var(--panel)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Quote className="h-4 w-4" style={{ color: "var(--accent)" }} aria-hidden="true" />
        <strong style={{ fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>
          Cite this record
        </strong>
        <span style={{ marginLeft: "auto", display: "inline-flex", gap: 4 }}>
          {(["APA", "MLA", "BibTeX"] as Fmt[]).map((f) => (
            <button
              key={f}
              onClick={() => setFmt(f)}
              className="btn"
              aria-pressed={fmt === f}
              style={{
                padding: "3px 9px",
                fontSize: "0.74rem",
                ...(fmt === f ? { background: "var(--accent-soft)", color: "var(--accent-ink)", borderColor: "var(--accent-border)" } : {}),
              }}
            >
              {f}
            </button>
          ))}
        </span>
      </div>
      <pre
        style={{
          fontFamily: "var(--mono)",
          fontSize: "0.78rem",
          lineHeight: 1.5,
          color: "var(--ink-soft)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          margin: 0,
        }}
      >
        {citations[fmt]}
      </pre>
      <button className="btn" onClick={copy} style={{ marginTop: 10, padding: "5px 11px", fontSize: "0.78rem" }}>
        {copied ? <Check className="mr-1 inline h-3.5 w-3.5 align-text-bottom" /> : <Copy className="mr-1 inline h-3.5 w-3.5 align-text-bottom" />}
        {copied ? "Copied" : `Copy ${fmt}`}
      </button>
    </div>
  );
}
