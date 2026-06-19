/* Pure-SVG inline sparkline — hook-free, server-safe. Renders a value series as
 * a smooth trend line tinted with the accent color. Used on Statistics. */
export default function Sparkline({
  values,
  width = 96,
  height = 24,
  ariaLabel,
}: {
  values: number[];
  width?: number;
  height?: number;
  ariaLabel: string;
}) {
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);
  const pt = (v: number, i: number) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };
  const points = values.map(pt).join(" ");
  const areaPath = `M 0,${height} L ` + values.map(pt).join(" L ") + ` L ${width},${height} Z`;
  const lastX = (values.length - 1) * stepX;
  const lastY = height - ((values[values.length - 1] - min) / range) * (height - 4) - 2;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      style={{ color: "var(--accent)", overflow: "visible" }}
    >
      <path d={areaPath} fill="currentColor" opacity="0.12" />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={lastX} cy={lastY} r="2" fill="currentColor" />
    </svg>
  );
}
