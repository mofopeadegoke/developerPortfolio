import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#1b2fd0", color: "#fbfbf9", fontSize: 19, fontWeight: 700 }}>
      DA
    </div>,
    size,
  );
}
