import { ImageResponse } from "next/og";
import { getPlans, getPlan, getDeep } from "@/lib/data";

// Per-plan social share card, generated as a static PNG at build under
// output:"export". Next wires this as the og:image for /plans/[id]/.
export const runtime = "nodejs";
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "A continuity plan record in the Campus COOP Archive.";

export function generateStaticParams() {
  return getPlans().map((p) => ({ id: p.plan_id }));
}

export default function PlanOg({ params }: { params: { id: string } }) {
  const plan = getPlan(params.id);
  const deep = getDeep(params.id);
  const name = plan?.institution_name ?? "Campus COOP Archive";
  const sub = plan ? `${plan.plan_type}${plan.state ? ` · ${plan.state}` : ""}` : "";
  const score = deep ? `${deep.benchmark_present}/22` : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0b0b0e",
          color: "#f5f5f2",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -240,
            right: -180,
            width: 720,
            height: 680,
            display: "flex",
            background: "radial-gradient(circle at center, rgba(15,118,110,0.5), rgba(15,118,110,0) 60%)",
          }}
        />
        <div style={{ height: 10, width: "100%", display: "flex", background: "linear-gradient(90deg,#0f766e,#14b8a6,#6b3fb0)" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, padding: "0 90px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <div style={{ width: 40, height: 40, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#0f766e,#6b3fb0)", color: "#fff", fontSize: 15, fontWeight: 800 }}>
              COOP
            </div>
            <div style={{ fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#5eead4" }}>Campus COOP Archive</div>
          </div>
          <div style={{ display: "flex", fontSize: name.length > 40 ? 58 : 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 1000 }}>
            {name}
          </div>
          {sub && <div style={{ display: "flex", fontSize: 30, color: "#9aa0aa", marginTop: 26 }}>{sub}</div>}
          {score && (
            <div style={{ display: "flex", alignItems: "center", marginTop: 34 }}>
              <div style={{ display: "flex", alignItems: "center", padding: "10px 22px", borderRadius: 999, background: "rgba(94,234,212,0.14)", border: "1px solid rgba(94,234,212,0.4)", color: "#5eead4", fontSize: 26, fontWeight: 700 }}>
                Benchmark {score}
              </div>
              <div style={{ display: "flex", marginLeft: 18, fontSize: 22, color: "#9aa0aa" }}>continuity benchmark</div>
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
