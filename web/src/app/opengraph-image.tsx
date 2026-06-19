import { ImageResponse } from "next/og";

// Build-time social share card, emitted as a real PNG (most platforms don't render
// SVG OG images). Generated statically under output:"export"; no runtime involved.
export const runtime = "nodejs";
export const dynamic = "force-static";
export const alt =
  "Campus COOP Archive: a fully sourced catalog of US college & university continuity plans.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -160,
            width: 780,
            height: 720,
            display: "flex",
            background: "radial-gradient(circle at center, rgba(15,118,110,0.55), rgba(15,118,110,0) 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -300,
            right: -360,
            width: 760,
            height: 700,
            display: "flex",
            background: "radial-gradient(circle at center, rgba(107,63,176,0.42), rgba(107,63,176,0) 60%)",
          }}
        />
        <div
          style={{
            height: 10,
            width: "100%",
            display: "flex",
            background: "linear-gradient(90deg,#0f766e,#14b8a6,#6b3fb0)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, padding: "0 96px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg,#0f766e,#6b3fb0)",
                color: "#fff",
                fontSize: 17,
                fontWeight: 800,
              }}
            >
              COOP
            </div>
            <div style={{ marginLeft: 18, fontSize: 24, letterSpacing: 5, textTransform: "uppercase", color: "#5eead4" }}>
              22-component continuity benchmark
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 86, fontWeight: 700, lineHeight: 1.04, letterSpacing: -2 }}>
            <div style={{ display: "flex" }}>Campus COOP</div>
            <div style={{ display: "flex" }}>Archive</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 30, color: "#9aa0aa", marginTop: 34, lineHeight: 1.35 }}>
            <div style={{ display: "flex" }}>A fully sourced catalog of US college &amp; university</div>
            <div style={{ display: "flex" }}>continuity plans — read, scored, and free to download.</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
