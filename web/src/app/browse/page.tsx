import type { Metadata } from "next";
import Link from "next/link";
import { BrowseClient } from "@/components/BrowseClient";

export const metadata: Metadata = {
  title: "Browse plans",
  description:
    "Search and filter every cataloged campus continuity plan by state, type, structure, control, recency, and verification. Export to CSV, Excel, or JSON.",
};

export default function BrowsePage() {
  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Catalog</div>
        <h1>Browse the catalog</h1>
        <p className="lead">
          Full-text search across institution, catalog notes, and the
          verbatim evidence quote. Combine filters, sort, and export the result set.
        </p>
        <p className="small">
          <Link href="/compare/">Compare plans side by side &rarr;</Link> &nbsp;·&nbsp;{" "}
          <Link href="/downloads/">Download the data &rarr;</Link>
        </p>
      </div>
      <BrowseClient />
    </div>
  );
}
