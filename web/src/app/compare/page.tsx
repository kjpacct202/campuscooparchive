import type { Metadata } from "next";
import { CompareClient } from "@/components/CompareClient";

export const metadata: Metadata = {
  title: "Compare plans",
  description:
    "Compare campus continuity plans side by side: benchmark score, the 22 continuity components, coverage, and continuity treatment.",
};

export default function ComparePage() {
  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Side by side</div>
        <h1>Compare plans</h1>
        <p className="lead">
          Put up to four plans next to each other: benchmark score, the 22 continuity
          components, coverage, and continuity treatment. Two perfect-scoring
          exemplars are loaded to start; search to add or swap.
        </p>
      </div>
      <CompareClient />
    </div>
  );
}
