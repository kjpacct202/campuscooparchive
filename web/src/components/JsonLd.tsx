// Renders a JSON-LD <script> for structured data. Server-only, static-export safe.
// Data is maintainer/build-time controlled (never user input).
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
