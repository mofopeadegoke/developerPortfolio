import { ImageResponse } from "next/og";
import { GearMark } from "./gear-mark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<GearMark size={32} stroke="#c23a2e" fill="#c23a2e" />, size);
}
