import { ImageResponse } from "next/og";

export const alt =
  "Let Me Teach You AI — learn AI by building useful things";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #07152f 0%, #0d2451 58%, #2457ff 130%)",
          color: "white",
          padding: "64px 72px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "#2457ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 18,
              fontSize: 24,
              fontWeight: 900,
            }}
          >
            AI
          </div>
          LET ME TEACH YOU AI
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: "-0.045em",
            }}
          >
            Build useful things with AI.
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 34,
              lineHeight: 1.3,
              color: "#c8d5ea",
            }}
          >
            Practical lessons, real workflows, and a free AI Work Kit to get
            started.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#9bb7ff",
          }}
        >
          <span>Learn AI by building real things</span>
          <span>letmeteachyouai.com</span>
        </div>
      </div>
    ),
    size
  );
}
