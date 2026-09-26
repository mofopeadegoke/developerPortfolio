import { ImageResponse } from "next/og";
import { GearMark } from "./gear-mark";

export const alt = "Daniel Adegoke, Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 90px",
          background: "#ecede8",
          backgroundImage:
            "linear-gradient(to right, rgba(155,203,224,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(155,203,224,0.45) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          color: "#23262b",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>Daniel Adegoke</div>
          <div style={{ fontSize: 44, color: "#5e6269", marginTop: 16 }}>Software Engineer</div>
          <div style={{ fontSize: 30, marginTop: 48, maxWidth: 620, lineHeight: 1.3 }}>
            React and TypeScript in production. C++ geometry from first principles.
          </div>
        </div>
        <GearMark size={380} teeth={24} stroke="#23262b" fill="#ecede8" />
      </div>
    ),
    size,
  );
}
