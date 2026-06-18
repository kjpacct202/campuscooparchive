import { isConfirmed } from "@/lib/format";

export function VerificationBadge({ v }: { v?: string | null }) {
  return isConfirmed(v) ? (
    <span className="badge badge--ok" title="A researcher opened the document or its official page and read the evidence quote from it.">
      &#10003; Confirmed
    </span>
  ) : (
    <span className="badge badge--link" title="The direct URL resolves on an official host, but the document bytes were not personally rendered.">
      Link-only
    </span>
  );
}
