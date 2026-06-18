import type { Metadata } from "next";
import Link from "next/link";
import { getInstitutions } from "@/lib/data";

export const metadata: Metadata = {
  title: "Institutions",
  description:
    "The full roster of cataloged US colleges and universities with a publicly published continuity plan.",
};

export default function InstitutionsPage() {
  const institutions = [...getInstitutions()].sort((a, b) =>
    a.institution_name.localeCompare(b.institution_name)
  );

  return (
    <div>
      <div className="page-head">
        <div className="eyebrow">Index</div>
        <h1>Institutions</h1>
        <p className="lead">
          {institutions.length} cataloged institutions across 47 states and DC,
          each with at least one publicly published continuity plan.
        </p>
      </div>

      <div className="table-scroll">
        <table className="table">
        <thead>
          <tr>
            <th>Institution</th>
            <th>State</th>
            <th>Type</th>
            <th>Control</th>
            <th>Plans</th>
            <th>Most recent</th>
          </tr>
        </thead>
        <tbody>
          {institutions.map((i) => (
            <tr key={i.institution_id}>
              <td>
                <Link href={`/institutions/${i.institution_id}/`}>
                  {i.institution_name}
                </Link>
              </td>
              <td>{i.state}</td>
              <td>{i.institution_type}</td>
              <td>{i.control}</td>
              <td>{i.plan_count}</td>
              <td>{i.most_recent_year ?? "—"}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}
