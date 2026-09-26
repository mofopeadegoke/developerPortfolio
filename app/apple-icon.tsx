import { ImageResponse } from "next/og";
import { GearMark } from "./gear-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#ecede8" }}>
        <GearMark size={132} stroke="#23262b" fill="#ecede8" />
      </div>
    ),
    size,
  );
}
