// The walk down the page: one entry per shape the form takes. `data-stop`
// attributes in the page match these ids.

export type Stop = {
  id: string;
  /** Which side of the viewport the text sits on; the form takes the other. */
  label: "left" | "right";
  /** Text column width in rem. */
  width: number;
  /** The name, a number that proves something, or loose dust at rest. */
  form: "name" | "figure" | "rest";
};

export const stops: Stop[] = [
  { id: "top", label: "left", width: 31, form: "name" },
  { id: "experience", label: "right", width: 43, form: "figure" },
  { id: "uncooked", label: "left", width: 31, form: "rest" },
  { id: "smart-bookmarks", label: "right", width: 31, form: "rest" },
  { id: "omniplexus", label: "left", width: 31, form: "rest" },
  { id: "inscribe", label: "right", width: 31, form: "figure" },
  { id: "gear", label: "left", width: 31, form: "rest" },
  { id: "wormhole", label: "right", width: 31, form: "rest" },
  { id: "skills", label: "right", width: 43, form: "figure" },
  { id: "about", label: "left", width: 43, form: "figure" },
  { id: "awards", label: "right", width: 31, form: "figure" },
  { id: "contact", label: "left", width: 31, form: "rest" },
];

export const CAMERA_DISTANCE = 10;
export const CAMERA_FOV = 35;

/** How far the text column reaches in from its side of the screen, in pixels. */
function textEdge(stop: Stop, width: number) {
  return stop.width * 16 + Math.max(16, Math.min(56, width * 0.04));
}

/** The text column across the screen, from -1 at the left edge to 1 at the right. */
export function textBand(stop: Stop, width: number) {
  const reach = Math.min(2, (2 * textEdge(stop, width)) / width);
  return stop.label === "left" ? { min: -1, max: -1 + reach } : { min: 1 - reach, max: 1 };
}

/** Where the form sits at a stop, in the space the text leaves free. */
export function formLayout(stop: Stop, width: number, height: number) {
  const visibleHeight = 2 * Math.tan((CAMERA_FOV / 2) * (Math.PI / 180)) * CAMERA_DISTANCE;
  const visibleWidth = visibleHeight * (width / height);
  // Dust is spread over the whole screen, behind everything.
  if (stop.form === "rest") return { x: 0, y: 0, scale: visibleHeight / 2 };
  if (stop.id === "top") return { x: 0, y: visibleHeight * 0.2, scale: Math.min(visibleWidth * 0.44, visibleHeight * 0.72) };
  const free = visibleWidth * (1 - Math.min(0.62, textEdge(stop, width) / width));
  const x = ((visibleWidth - free) / 2) * (stop.label === "left" ? 1 : -1);
  return { x, y: 0, scale: Math.min(free * 0.4, visibleHeight * 0.34) };
}

/** Progress through the shapes, in stop units, from page scroll. */
export function walkPosition(scroll: number, anchors: number[], viewport: number) {
  if (anchors.length === 0 || scroll <= anchors[0]) return 0;
  for (let i = 0; i < anchors.length - 1; i++) {
    const next = anchors[i + 1];
    if (scroll >= next) continue;
    // Hold the shape while reading, then rebuild during the last half viewport.
    const moveStart = Math.max(anchors[i], next - viewport * 0.5);
    const t = next > moveStart ? Math.min(1, Math.max(0, (scroll - moveStart) / (next - moveStart))) : 1;
    return i + t * t * (3 - 2 * t);
  }
  return anchors.length - 1;
}

/** Full runs the form; Still is the plain page with no WebGL at all. */
export type Tier = "full" | "still";

/** The form only runs on a large screen driven by a mouse or trackpad. */
export const STAGE_QUERY = "(min-width: 1024px) and (pointer: fine)";

/** Picks whether this device runs the form. */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "still";
  const forced = new URLSearchParams(window.location.search).get("tier");
  if (forced === "full" || forced === "still") return forced;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "still";
  if (!window.matchMedia(STAGE_QUERY).matches) return "still";
  try {
    const canvas = document.createElement("canvas");
    if (!canvas.getContext("webgl2")) return "still";
  } catch {
    return "still";
  }
  return "full";
}
