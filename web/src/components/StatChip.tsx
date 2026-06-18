export function StatChip({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="statchip">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}
