// The form's two shapes: the name in the hero, then a field of stars behind the
// rest of the page. `data-stop` attributes in the page match these ids: the hero
// carries "top" and the first section after it carries "field".

export type Stop = {
  id: "top" | "field";
  /** The name, or loose stars at rest behind the page. */
  form: "name" | "rest";
};

export const stops: Stop[] = [
  { id: "top", form: "name" },
  { id: "field", form: "rest" },
];

export const CAMERA_DISTANCE = 10;
export const CAMERA_FOV = 35;

/** Where the form sits at a stop. */
export function formLayout(stop: Stop, width: number, height: number) {
  const visibleHeight = 2 * Math.tan((CAMERA_FOV / 2) * (Math.PI / 180)) * CAMERA_DISTANCE;
  const visibleWidth = visibleHeight * (width / height);
  // Stars are spread over the whole screen, behind everything.
  if (stop.form === "rest") return { x: 0, y: 0, scale: visibleHeight / 2 };
  // The name spans most of the width, in the upper part of the hero, clear of
  // the words in its lower third.
  // Centred in the band between the corner labels and the headline at the foot.
  return { x: 0, y: visibleHeight * 0.1, scale: Math.min(visibleWidth * 0.44, visibleHeight * 0.72) };
}

/** The share of the way from one stop to the next over which the form rebuilds. */
const POUR = 0.6;

/** Progress through the shapes, in stop units, from page scroll. */
export function walkPosition(scroll: number, anchors: number[]) {
  if (anchors.length === 0 || scroll <= anchors[0]) return 0;
  for (let i = 0; i < anchors.length - 1; i++) {
    const next = anchors[i + 1];
    if (scroll >= next) continue;
    // Hold the shape at first, then rebuild across the last part of the way.
    const moveStart = anchors[i] + (next - anchors[i]) * (1 - POUR);
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
