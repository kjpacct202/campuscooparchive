import type { Metadata } from "next";
import SearchClient from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search every US college and university continuity plan in the archive by institution, plan type, framework, or the exact words of a verbatim evidence quote.",
};

export default function SearchPage() {
  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Find a plan</div>
        <h1>Search</h1>
        <p className="lead">
          Search every institution, plan type, framework, and verbatim evidence quote across
          the archive. Results link straight to the sourced plan record.
        </p>
      </div>
      <SearchClient />
    </div>
  );
}
