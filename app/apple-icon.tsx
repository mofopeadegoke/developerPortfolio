import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#0b0807", color: "#e8894f", fontSize: 92, fontWeight: 700 }}>
      DA
    </div>,
    size,
  );
}
