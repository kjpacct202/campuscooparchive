export function EvidenceQuote({ quote }: { quote?: string | null }) {
  if (!quote) return null;
  return <blockquote className="quote">&ldquo;{quote}&rdquo;</blockquote>;
}
