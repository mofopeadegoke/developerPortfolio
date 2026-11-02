// The walk through the exhibition: one entry per stop on the camera's axis.
// `data-stop` attributes in the page match these ids.

export const roomColors = {
  ultramarine: "#1b2fd0",
  vermilion: "#e8552f",
  teal: "#0f7a6c",
} as const;

export type RoomColor = keyof typeof roomColors;

export type Stop = {
  id: string;
  room: RoomColor;
  /** Which side of the viewport the label sits on; the case takes the other. */
  label: "left" | "right";
};

export const stops: Stop[] = [
  { id: "top", room: "ultramarine", label: "left" },
  { id: "experience", room: "vermilion", label: "right" },
  { id: "uncooked", room: "teal", label: "left" },
  { id: "smart-bookmarks", room: "teal", label: "right" },
  { id: "omniplexus", room: "teal", label: "left" },
  { id: "inscribe", room: "teal", label: "right" },
  { id: "gear", room: "teal", label: "left" },
  { id: "wormhole", room: "teal", label: "right" },
  { id: "skills", room: "ultramarine", label: "right" },
  { id: "about", room: "vermilion", label: "left" },
  { id: "contact", room: "teal", label: "right" },
];

/** Distance between stops along the camera's axis, in scene units. */
export const STOP_SPACING = 14;
export const CAMERA_DISTANCE = 7.4;
export const CAMERA_FOV = 42;
export const PHONE_DISTANCE = 1.4;

export const caseSize = (stop: Stop, phone: boolean): [number, number, number] =>
  stop.id === "top" ? (phone ? [4.3, 2.7, 1.4] : [6.3, 3.5, 1.5]) : [3.7, 3.9, 3];

/** Places a case in the wall space its label leaves free at this screen size. */
export function caseLayout(stop: Stop, width: number, height: number, phone: boolean) {
  const size = caseSize(stop, phone);
  const distance = CAMERA_DISTANCE + (phone ? PHONE_DISTANCE : 0);
  const visibleWidth = 2 * Math.tan((CAMERA_FOV / 2) * (Math.PI / 180)) * distance * (width / height);
  const rem = stop.id === "experience" || stop.id === "skills" || stop.id === "about" ? 43 : 31;
  const gutter = Math.max(16, Math.min(56, width * 0.04));
  const labelEdge = rem * 16 + gutter;
  const free = phone ? visibleWidth : visibleWidth * (1 - Math.min(0.62, labelEdge / width));
  const fit = Math.min(stop.id === "top" ? 1 : 0.82, (free * (phone ? 0.76 : 0.88)) / (size[0] + 0.3));
  const x = phone ? 0 : ((visibleWidth - free) / 2) * (stop.label === "left" ? 1 : -1);
  // Length of the label's hairline, from its edge to the near side of the case.
  const caseEdge = (width * (visibleWidth / 2 + Math.abs(x) - (size[0] * fit) / 2)) / visibleWidth;
  return { x, fit, tie: Math.max(0, Math.round(caseEdge - labelEdge)) };
}

export const stopZ = (index: number) => -index * STOP_SPACING;

/** Camera position along the walk, in stop units, from page scroll. */
export function walkPosition(scroll: number, anchors: number[], viewport: number) {
  if (anchors.length === 0 || scroll <= anchors[0]) return 0;
  for (let i = 0; i < anchors.length - 1; i++) {
    const next = anchors[i + 1];
    if (scroll >= next) continue;
    // Hold at the case while reading, then walk during the last viewport.
    const moveStart = Math.max(anchors[i], next - viewport * 0.9);
    const t = Math.min(1, Math.max(0, (scroll - moveStart) / (next - moveStart)));
    return i + t * t * (3 - 2 * t);
  }
  return anchors.length - 1;
}

export type Tier = "full" | "phone" | "still";

/** Picks how much of the gallery this device should run. */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "full";
  const forced = new URLSearchParams(window.location.search).get("tier");
  if (forced === "full" || forced === "phone" || forced === "still") return forced;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "still";
  try {
    const canvas = document.createElement("canvas");
    if (!canvas.getContext("webgl2")) return "still";
  } catch {
    return "still";
  }
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const weak = (nav.deviceMemory ?? 8) <= 3 || navigator.hardwareConcurrency <= 4;
  if (coarse && weak) return "still";
  return coarse || window.innerWidth < 768 ? "phone" : "full";
}
