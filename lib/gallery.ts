// The walk down the page: one entry per shape the form takes. `data-stop`
// attributes in the page match these ids.

export type Stop = {
  id: string;
  /** Which side of the viewport the text sits on; the form takes the other. */
  label: "left" | "right";
  /** Text column width in rem. */
  width: number;
};

export const stops: Stop[] = [
  { id: "top", label: "left", width: 31 },
  { id: "experience", label: "right", width: 43 },
  { id: "uncooked", label: "left", width: 31 },
  { id: "smart-bookmarks", label: "right", width: 31 },
  { id: "omniplexus", label: "left", width: 31 },
  { id: "inscribe", label: "right", width: 31 },
  { id: "gear", label: "left", width: 31 },
  { id: "wormhole", label: "right", width: 31 },
  { id: "skills", label: "right", width: 43 },
  { id: "about", label: "left", width: 43 },
  { id: "contact", label: "right", width: 31 },
];

export const CAMERA_DISTANCE = 10;
export const CAMERA_FOV = 35;

/** Where the form sits at a stop, in the space the text leaves free. */
export function formLayout(stop: Stop, width: number, height: number, phone: boolean) {
  const visibleHeight = 2 * Math.tan((CAMERA_FOV / 2) * (Math.PI / 180)) * CAMERA_DISTANCE;
  const visibleWidth = visibleHeight * (width / height);
  if (phone) return { x: 0, y: visibleHeight * 0.24, scale: visibleWidth * (stop.id === "top" ? 0.4 : 0.32) };
  if (stop.id === "top") return { x: 0, y: visibleHeight * 0.2, scale: Math.min(visibleWidth * 0.44, visibleHeight * 0.72) };
  const gutter = Math.max(16, Math.min(56, width * 0.04));
  const textEdge = stop.width * 16 + gutter;
  const free = visibleWidth * (1 - Math.min(0.62, textEdge / width));
  const x = ((visibleWidth - free) / 2) * (stop.label === "left" ? 1 : -1);
  return { x, y: 0, scale: Math.min(free * 0.4, visibleHeight * 0.34) };
}

/** Progress through the shapes, in stop units, from page scroll. */
export function walkPosition(scroll: number, anchors: number[], viewport: number) {
  if (anchors.length === 0 || scroll <= anchors[0]) return 0;
  for (let i = 0; i < anchors.length - 1; i++) {
    const next = anchors[i + 1];
    if (scroll >= next) continue;
    // Hold the shape while reading, then rebuild during the last viewport.
    const moveStart = Math.max(anchors[i], next - viewport * 0.9);
    const t = Math.min(1, Math.max(0, (scroll - moveStart) / (next - moveStart)));
    return i + t * t * (3 - 2 * t);
  }
  return anchors.length - 1;
}

export type Tier = "full" | "phone" | "still";

/** Picks how much of the form this device should run. */
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
