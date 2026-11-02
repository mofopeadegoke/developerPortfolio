import { ImageResponse } from "next/og";

export const alt = "Daniel Adegoke, Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "flex-end", padding: 64, background: "#0b0807" }}>
      <div style={{ display: "flex", flexDirection: "column", padding: "44px 52px", color: "#f4ece4" }}>
        <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1 }}>Daniel Adegoke</div>
        <div style={{ fontSize: 40, color: "#e8894f", marginTop: 14 }}>Software Engineer</div>
        <div style={{ fontSize: 28, marginTop: 34, maxWidth: 760, lineHeight: 1.3 }}>
          React and TypeScript in production. C++ geometry from first principles.
        </div>
      </div>
    </div>,
    size,
  );
}
