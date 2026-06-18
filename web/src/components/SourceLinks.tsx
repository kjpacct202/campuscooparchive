export function SourceLinks({
  sourceUrl,
  landingUrl,
  dateAccessed,
}: {
  sourceUrl?: string | null;
  landingUrl?: string | null;
  dateAccessed?: string | null;
}) {
  return (
    <div className="source-links">
      {sourceUrl && (
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
          View source document &#8599;
        </a>
      )}
      {landingUrl && landingUrl !== sourceUrl && (
        <a href={landingUrl} target="_blank" rel="noopener noreferrer">
          Official page &#8599;
        </a>
      )}
      {dateAccessed && <span className="muted small">Accessed {dateAccessed}</span>}
    </div>
  );
}
