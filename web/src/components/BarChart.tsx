export interface BarItem {
  label: string;
  value: number;
}

export function BarChart({
  items,
  max,
  color,
}: {
  items: BarItem[];
  max?: number;
  color?: "green" | "amber" | "violet";
}) {
  const m = max ?? Math.max(1, ...items.map((i) => i.value));
  return (
    <div>
      {items.map((i) => (
        <div className="bar" key={i.label}>
          <span className="lab" title={i.label}>
            {i.label}
          </span>
          <span className="track">
            <span
              className={"fill" + (color ? ` ${color}` : "")}
              style={{ width: `${Math.round((i.value / m) * 100)}%` }}
            />
          </span>
          <span className="n">{i.value}</span>
        </div>
      ))}
    </div>
  );
}
