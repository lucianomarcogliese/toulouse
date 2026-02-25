import { ImageResponse } from "next/og";

export const alt = "Toulouse — Diseño de interiores";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fafaf9 0%, #e7e5e4 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "#1c1917",
            marginBottom: 12,
          }}
        >
          TOULOUSE
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#57534e",
            maxWidth: 560,
            textAlign: "center",
          }}
        >
          Diseño de interiores con calma y carácter
        </div>
      </div>
    ),
    { ...size }
  );
}
