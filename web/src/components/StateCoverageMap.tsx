/**
 * Tile-grid cartogram of the US: every state/DC is a same-size tile at its
 * recognizable position on the standard 8-row x 11-col grid (NPR/Datawrapper
 * layout). Shaded by plan count. Pure server-rendered HTML/CSS, no client JS.
 * Each tile links to Browse filtered to that state. A visually-hidden table
 * carries the full data for screen readers.
 */

const STATE_NAME: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon",
  PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota",
  TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia",
  WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

// [code, row(1-based), col(1-based)] on an 8-row x 11-col grid.
const LAYOUT: [string, number, number][] = [
  ["AK", 1, 1], ["ME", 1, 11],
  ["WI", 2, 6], ["VT", 2, 10], ["NH", 2, 11],
  ["WA", 3, 1], ["ID", 3, 2], ["MT", 3, 3], ["ND", 3, 4], ["MN", 3, 5],
  ["IL", 3, 6], ["MI", 3, 7], ["NY", 3, 9], ["MA", 3, 10], ["RI", 3, 11],
  ["OR", 4, 1], ["NV", 4, 2], ["WY", 4, 3], ["SD", 4, 4], ["IA", 4, 5],
  ["IN", 4, 6], ["OH", 4, 7], ["PA", 4, 8], ["NJ", 4, 9], ["CT", 4, 10],
  ["CA", 5, 1], ["UT", 5, 2], ["CO", 5, 3], ["NE", 5, 4], ["MO", 5, 5],
  ["KY", 5, 6], ["WV", 5, 7], ["VA", 5, 8], ["MD", 5, 9], ["DE", 5, 10],
  ["AZ", 6, 2], ["NM", 6, 3], ["KS", 6, 4], ["AR", 6, 5], ["TN", 6, 6],
  ["NC", 6, 7], ["SC", 6, 8], ["DC", 6, 9],
  ["OK", 7, 4], ["LA", 7, 5], ["MS", 7, 6], ["AL", 7, 7], ["GA", 7, 8],
  ["HI", 8, 1], ["TX", 8, 4], ["FL", 8, 9],
];

const GRID_COLS = 11;
const GRID_ROWS = 8;

// Buckets tuned to COOP's range (max state count ~21).
const LEGEND_BUCKETS = [
  { label: "None", level: 0 },
  { label: "1-2", level: 0.28 },
  { label: "3-5", level: 0.5 },
  { label: "6-10", level: 0.72 },
  { label: "11+", level: 1 },
] as const;

function tileLevel(n: number): number {
  if (!n) return 0;
  if (n >= 11) return 1;
  if (n >= 6) return 0.72;
  if (n >= 3) return 0.5;
  return 0.28;
}

function tileStyle(n: number): React.CSSProperties {
  const level = tileLevel(n);
  if (!level) {
    return {
      backgroundColor: "var(--surface)",
      color: "var(--text-secondary)",
      borderColor: "var(--border-strong)",
      borderWidth: 1,
    };
  }
  return {
    backgroundColor: `color-mix(in srgb, var(--accent) ${Math.round(level * 100)}%, var(--surface))`,
    color: level >= 1 ? "var(--on-accent)" : level >= 0.72 ? "#0b0b0e" : "var(--text-primary)",
    borderColor: "transparent",
    borderWidth: 1,
    boxShadow: level >= 1 ? "0 2px 8px color-mix(in srgb, var(--accent) 35%, transparent)" : undefined,
  };
}

export default function StateCoverageMap({ counts }: { counts: Record<string, number> }) {
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const coveredCount = sorted.length;
  return (
    <section className="mb-4" aria-labelledby="coverage-map-heading" data-reveal>
      <div className="mb-5">
        <p className="mb-1.5 font-mono text-xs uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>
          Geographic coverage
        </p>
        <h2 id="coverage-map-heading" className="font-display text-section" style={{ color: "var(--text-primary)" }}>
          Coverage by state
        </h2>
        <p className="mt-1.5 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
          {coveredCount} states &amp; DC documented · darker tile = more plans · tap a tile to browse its plans
        </p>
      </div>
      <div
        role="group"
        aria-label={`US tile-grid map of continuity plans across ${coveredCount} states and DC`}
        className="mx-auto grid w-full max-w-[680px] gap-1 sm:gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_ROWS}, auto)`,
        }}
      >
        {LAYOUT.map(([code, row, col]) => {
          const n = counts[code] ?? 0;
          const name = STATE_NAME[code] ?? code;
          const label = `${name} (${code}): ${n} plan${n === 1 ? "" : "s"} · view in Browse`;
          return (
            <a
              key={code}
              href={`/browse/?state=${code}`}
              title={label}
              aria-label={label}
              className="flex aspect-square flex-col items-center justify-center rounded-[4px] border leading-none transition-all duration-150 hover:z-10 hover:scale-[1.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
              style={{ gridRow: row, gridColumn: col, position: "relative", ...tileStyle(n) }}
            >
              <span className="sr-only">{code}: {n} plan{n === 1 ? "" : "s"}</span>
              <span className="select-none font-mono font-semibold" style={{ fontSize: "clamp(0.5rem, 1.7vw, 0.72rem)" }} aria-hidden="true">
                {code}
              </span>
              <span className="select-none font-mono tabular-nums" style={{ fontSize: "clamp(0.42rem, 1.4vw, 0.6rem)" }} aria-hidden="true">
                {n}
              </span>
            </a>
          );
        })}
      </div>
      <div className="mx-auto mt-5 max-w-[680px]">
        <div className="flex flex-wrap items-center gap-2.5" aria-label="Map legend" role="list">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
            Plans:
          </span>
          {LEGEND_BUCKETS.map(({ label, level }) => {
            const bg = level === 0 ? "var(--surface)" : `color-mix(in srgb, var(--accent) ${Math.round(level * 100)}%, var(--surface))`;
            const border = level === 0 ? "1px solid var(--border-strong)" : "1px solid transparent";
            return (
              <div key={label} className="flex items-center gap-1.5" role="listitem">
                <span className="inline-block h-3.5 w-3.5 rounded-[3px]" style={{ backgroundColor: bg, border }} aria-hidden="true" />
                <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <table className="sr-only">
        <caption>Continuity plans per state</caption>
        <thead>
          <tr><th>State</th><th>Plans</th></tr>
        </thead>
        <tbody>
          {sorted.map(([code, n]) => (
            <tr key={code}><td>{code}</td><td>{n}</td></tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
