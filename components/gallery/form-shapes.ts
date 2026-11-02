import * as THREE from "three";
import { FontLoader, type Font } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { SVGLoader } from "three-stdlib";
import { experience, skillGroups } from "@/lib/content";
import { involuteGear } from "@/lib/gear";
import { stops } from "@/lib/gallery";

// Every shape the form takes is real geometry, and where possible real data:
// each train carriage is as long as the job it stands for, the toolbox holds one
// tool per skill group, the gears are true involute profiles.
//
// A shape is made of parts. Each part owns a share of the particles and a group
// number, which tells the shader how that part behaves: which embers rise, which
// tile grows next, which gear turns which way.

type Point = { position: THREE.Vector3; normal: THREE.Vector3 };

type Part = {
  share: number;
  group: number | ((point: THREE.Vector3, index: number) => number);
  shade?: number;
  geometry?: THREE.BufferGeometry;
  point?: (out: Point, index: number) => void;
};

const clean = (geometry: THREE.BufferGeometry) => {
  const flat = geometry.index ? geometry.toNonIndexed() : geometry;
  for (const name of Object.keys(flat.attributes)) {
    if (name !== "position" && name !== "normal") flat.deleteAttribute(name);
  }
  flat.computeVertexNormals();
  return flat;
};

const combine = (parts: THREE.BufferGeometry[]) => mergeGeometries(parts.map(clean))!;

const bevel = { bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.016, bevelSegments: 2, curveSegments: 10 };
const extrude = (shape: THREE.Shape, depth: number) => new THREE.ExtrudeGeometry(shape, { depth, ...bevel });

const box = (w: number, h: number, d: number, x = 0, y = 0, z = 0, turn = 0) => {
  const part = new THREE.BoxGeometry(w, h, d);
  part.rotateY(turn);
  part.translate(x, y, z);
  return part;
};

function word(font: Font, text: string, size: number, y = 0, depth = 0.07) {
  const part = new TextGeometry(text, { font, size, depth, curveSegments: 8, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.02, bevelSegments: 1 });
  part.computeBoundingBox();
  const bounds = part.boundingBox!;
  part.translate(-(bounds.max.x + bounds.min.x) / 2, y, 0);
  return part;
}

/** Centres a shape and scales it so its widest side is 2 units. */
function normalise(geometry: THREE.BufferGeometry) {
  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox!;
  const centre = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const scale = 2 / Math.max(size.x, size.y);
  geometry.translate(-centre.x, -centre.y, -centre.z);
  geometry.scale(scale, scale, scale);
  return geometry;
}

function monthsOf(job: { start: string; end: string }) {
  const end = job.end === "Present" ? Date.now() : Date.parse(`1 ${job.end}`);
  return Math.max(1, (end - Date.parse(`1 ${job.start}`)) / 2.63e9);
}

/** One carriage per job, newest behind the engine, each as long as the role. */
function layoutTrain() {
  const months = experience.map(monthsOf);
  const total = months.reduce((sum, value) => sum + value, 0);
  const engine = 0.5;
  const gap = 0.035;
  const base = 0.14;
  const spare = 2 - engine - (gap + base) * months.length;
  let right = 1 - engine - gap;
  const carriages = months.map((value) => {
    const length = base + (spare * value) / total;
    const carriage = { x: right - length / 2, length };
    right -= length + gap;
    return carriage;
  });
  const wheels = [0.88, 0.62, ...carriages.flatMap(({ x, length }) => [x + length / 2 - 0.055, x - length / 2 + 0.055])];
  return { carriages, wheels, wheelY: -0.17, chimney: [0.86, 0.32] as const };
}

export const TRAIN = layoutTrain();

function wheel(x: number) {
  const parts: THREE.BufferGeometry[] = [new THREE.TorusGeometry(0.055, 0.012, 8, 24)];
  for (const angle of [0, Math.PI / 3, (2 * Math.PI) / 3]) {
    const spoke = box(0.11, 0.012, 0.012);
    spoke.rotateZ(angle);
    parts.push(spoke);
  }
  const built = combine(parts);
  built.translate(x, TRAIN.wheelY, 0.09);
  return built;
}

/** Experience: a steam train chugging along, sleepers rushing past beneath it. */
function experienceParts(): Part[] {
  const boiler = new THREE.CylinderGeometry(0.1, 0.1, 0.36, 24);
  boiler.rotateZ(Math.PI / 2);
  boiler.translate(0.8, 0, 0);
  const chimney = new THREE.CylinderGeometry(0.05, 0.035, 0.16, 16);
  chimney.translate(TRAIN.chimney[0], TRAIN.chimney[1] - 0.14, 0);
  const engine = [boiler, chimney, box(0.2, 0.3, 0.2, 0.6, 0.05, 0), box(0.26, 0.03, 0.26, 0.6, 0.215, 0)];
  const carriages = TRAIN.carriages.map(({ x, length }) => {
    const side = new THREE.Shape();
    side.moveTo(-length / 2, -0.1).lineTo(length / 2, -0.1).lineTo(length / 2, 0.12).lineTo(-length / 2, 0.12).closePath();
    const windows = Math.max(1, Math.floor(length / 0.15));
    for (let i = 0; i < windows; i++) {
      const centre = -length / 2 + (length * (i + 0.5)) / windows;
      const pane = new THREE.Path();
      pane.moveTo(centre - 0.04, 0.0).lineTo(centre + 0.04, 0.0).lineTo(centre + 0.04, 0.08).lineTo(centre - 0.04, 0.08).closePath();
      side.holes.push(pane);
    }
    const body = extrude(side, 0.16);
    body.translate(x, 0, -0.08);
    return body;
  });
  const sleepers: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 18; i++) sleepers.push(box(0.05, 0.015, 0.3, -1.15 + i * 0.1353, -0.25, 0));
  return [
    { share: 0.28, group: 0, geometry: combine(engine) },
    { share: 0.41, group: 0, geometry: combine(carriages) },
    ...TRAIN.wheels.map((x, i) => ({ share: 0.006, group: 10 + i, shade: 0.6, geometry: wheel(x) })),
    { share: 0.05, group: 2, shade: 0.5, geometry: combine([box(2.3, 0.012, 0.02, 0, -0.235, 0.09), box(2.3, 0.012, 0.02, 0, -0.235, -0.09)]) },
    { share: 0.07, group: 3, shade: 0.45, geometry: combine(sleepers) },
    {
      share: 0.116,
      group: 4,
      shade: 0.6,
      point: ({ position: at, normal }) => {
        at.set(TRAIN.chimney[0], TRAIN.chimney[1], 0);
        normal.set(0, 0, 1);
      },
    },
  ];
}

/** Uncooked: a frying pan tosses a resume like a pancake. It lands uncooked. */
export const PAN = { x: -0.32, y: -0.62, tilt: 0.45 };

function uncookedParts(): Part[] {
  const profile = [[0, 0], [0.66, 0], [0.74, 0.03], [0.78, 0.2], [0.8, 0.21]].map(([x, y]) => new THREE.Vector2(x, y));
  const bowl = new THREE.LatheGeometry(profile, 56);
  const pan = combine([bowl, box(0.62, 0.05, 0.1, 1.09, 0.17, 0)]);
  pan.rotateX(PAN.tilt);
  pan.translate(PAN.x, PAN.y, 0);

  const page = new THREE.Shape();
  page.moveTo(-0.46, -0.58).lineTo(0.28, -0.58).lineTo(0.46, -0.4).lineTo(0.46, 0.58).lineTo(-0.46, 0.58).closePath();
  [[0.36, 0.7], [0.16, 0.5], [-0.04, 0.7], [-0.24, 0.6], [-0.44, 0.38]].forEach(([y, width]) => {
    const slot = new THREE.Path();
    slot.moveTo(-0.34, y).lineTo(-0.34 + width, y).lineTo(-0.34 + width, y + 0.09).lineTo(-0.34, y + 0.09).closePath();
    page.holes.push(slot);
  });
  const resume = extrude(page, 0.03);
  resume.translate(0, 0, -0.015);

  return [
    { share: 0.5, group: 0, geometry: pan },
    { share: 0.4, group: 1, geometry: resume },
    {
      share: 0.1,
      group: 2,
      shade: 1,
      point: ({ position: at, normal }) => {
        const angle = Math.random() * Math.PI * 2;
        at.set(PAN.x + Math.cos(angle) * 0.55, PAN.y + 0.15, Math.sin(angle) * 0.4);
        normal.set(0, 1, 0);
      },
    },
  ];
}

/** Smart Bookmarks: a paper plane lands in a book, which snaps shut on it. */
function bookmarkParts(): Part[] {
  const half = (sign: number) => box(1, 1.4, 0.05, sign * 0.5, 0, 0);
  const lines = (sign: number) => {
    const rows: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 7; i++) rows.push(box(0.68, 0.05, 0.02, sign * 0.5, 0.48 - i * 0.16, 0.04));
    return combine(rows);
  };
  const dart = new THREE.BufferGeometry();
  const [nose, inner, keel] = [[0.42, 0, 0], [-0.3, 0, 0], [-0.4, -0.13, 0]];
  dart.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array([...nose, -0.42, 0.05, 0.32, ...inner, ...nose, ...inner, -0.42, 0.05, -0.32, ...nose, ...inner, ...keel]), 3),
  );
  dart.computeVertexNormals();
  dart.rotateX(0.7);

  const tag = () => {
    const label = new THREE.Shape();
    label.moveTo(-0.15, -0.08).lineTo(0.08, -0.08).lineTo(0.16, 0).lineTo(0.08, 0.08).lineTo(-0.15, 0.08).closePath();
    const hole = new THREE.Path();
    hole.absarc(0.07, 0, 0.022, 0, Math.PI * 2, true);
    label.holes.push(hole);
    return extrude(label, 0.02);
  };

  return [
    { share: 0.24, group: 0, geometry: half(-1) },
    { share: 0.08, group: 0, shade: 0.85, geometry: lines(-1) },
    { share: 0.24, group: 1, geometry: half(1) },
    { share: 0.08, group: 1, shade: 0.85, geometry: lines(1) },
    { share: 0.12, group: 2, shade: 0.9, geometry: dart },
    { share: 0.06, group: 3, shade: 0.9, geometry: box(0.2, 0.52, 0.02, 0, -0.96, 0.05) },
    ...[4, 5, 6, 7, 8].map((group) => ({ share: 0.036, group, geometry: tag() })),
  ];
}

/** Omniplexus: a module grows its own control panel, tile by tile. */
function omniplexusParts(): Part[] {
  const parts: Part[] = [{ share: 0.2, group: 0, geometry: box(0.5, 0.5, 0.5) }];
  const size = 5;
  // Tiles wake in order of distance from the module, so the panel grows outward.
  const tiles: [number, number][] = [];
  for (let x = 0; x < size; x++) for (let y = 0; y < size; y++) if (x !== 2 || y !== 2) tiles.push([x - 2, y - 2]);
  tiles.sort((a, b) => Math.hypot(...a) - Math.hypot(...b));
  tiles.forEach(([x, y], order) => {
    const height = 0.08 + ((Math.abs(x * 3 + y * 5) % 4) * 0.09);
    parts.push({ share: 0.8 / tiles.length, group: order + 1, geometry: box(0.31, 0.31, height, x * 0.38, y * 0.38, height / 2) });
  });
  return parts;
}

/** Inscribe: a rubber stamp hammers the real install count onto a page. */
export const STAMP = { tilt: 0.8, y: -0.4 };

function inscribeParts(font: Font): Part[] {
  const place = (geometry: THREE.BufferGeometry) => {
    const flat = clean(geometry);
    flat.rotateX(STAMP.tilt);
    flat.translate(0, STAMP.y, 0);
    return flat;
  };
  const neck = new THREE.CylinderGeometry(0.1, 0.15, 0.34, 28);
  neck.translate(0, 0.31, 0);
  const knob = new THREE.SphereGeometry(0.24, 28, 20);
  knob.scale(1, 0.8, 1);
  knob.translate(0, 0.6, 0);
  const printed = word(font, "4,000+", 0.32, 0, 0.012);
  printed.rotateX(-Math.PI / 2);
  printed.translate(0, 0.03, 0.14);
  const ring = new THREE.Vector3();
  return [
    { share: 0.28, group: 0, geometry: place(box(2, 0.02, 1.2)) },
    { share: 0.3, group: 1, shade: 0.95, geometry: place(printed) },
    { share: 0.34, group: 2, geometry: place(combine([box(1.5, 0.14, 0.66, 0, 0.09, 0), neck, knob])) },
    {
      share: 0.08,
      group: 3,
      shade: 1,
      point: ({ position: at, normal }) => {
        const angle = Math.random() * Math.PI * 2;
        ring.set(Math.cos(angle), 0.02, Math.sin(angle) * 0.6).applyAxisAngle(new THREE.Vector3(1, 0, 0), STAMP.tilt);
        at.set(ring.x, ring.y + STAMP.y, ring.z);
        normal.set(0, 0, 1);
      },
    },
  ];
}

/** Three gears on real pitch circles, phased so their teeth genuinely mesh. */
const GEAR_MODULE = 0.056;

function meshGears() {
  const teeth = [20, 12, 15];
  const radius = teeth.map((z) => (z * GEAR_MODULE) / 2);
  const directions = [0.42, -0.95];
  const centres = [{ x: 0, y: 0 }];
  const phases = [0];
  directions.forEach((theta, i) => {
    const distance = radius[i] + radius[i + 1];
    centres.push({ x: centres[i].x + Math.cos(theta) * distance, y: centres[i].y + Math.sin(theta) * distance });
    // A tooth of one gear must meet a gap of the next along the line between them.
    phases.push(theta + Math.PI - (Math.PI - teeth[i] * (theta - phases[i])) / teeth[i + 1]);
  });
  // Centre the group, so it sits in the space the words leave free.
  const reach = (axis: "x" | "y", sign: number) => Math.max(...centres.map((centre, i) => sign * centre[axis] + radius[i]));
  const middle = { x: (reach("x", 1) - reach("x", -1)) / 2, y: (reach("y", 1) - reach("y", -1)) / 2 };
  for (const centre of centres) {
    centre.x -= middle.x;
    centre.y -= middle.y;
  }
  // Meshed neighbours turn opposite ways, at the ratio of their teeth.
  const speeds = teeth.map((z, i) => ((i % 2 === 0 ? 1 : -1) * teeth[0]) / z);
  return { teeth, centres, phases, speeds };
}

export const GEARS = meshGears();

function gearParts(): Part[] {
  const area = GEARS.teeth.reduce((sum, z) => sum + z * z, 0);
  return GEARS.teeth.map((z, i) => {
    const { outline } = involuteGear(z, GEAR_MODULE);
    const parsed = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${outline}"/></svg>`);
    const shape = SVGLoader.createShapes(parsed.paths[0] as THREE.ShapePath)[0];
    const bore = new THREE.Path();
    bore.absarc(0, 0, z * GEAR_MODULE * 0.14, 0, Math.PI * 2, true);
    shape.holes.push(bore);
    const gear = extrude(shape, 0.16);
    gear.rotateZ(GEARS.phases[i]);
    gear.translate(GEARS.centres[i].x, GEARS.centres[i].y, -0.08);
    return { share: (z * z) / area, group: i, geometry: clean(gear) };
  });
}

/** Wormhole: calm breathing rings, until a visitor asks to go through. */
function wormholeParts(): Part[] {
  return Array.from({ length: 9 }, (_, i) => {
    const ring = new THREE.TorusGeometry(1 - i * 0.09, 0.03, 10, 96);
    ring.translate(0, 0, 0.7 - i * 0.2);
    return { share: 1 / 9, group: i, geometry: ring };
  });
}

/** One tool for each skill group, drawn upright around its own centre. */
const TOOLS: (() => THREE.BufferGeometry)[] = [
  // Hammer
  () => combine([box(0.07, 0.62, 0.07), box(0.32, 0.13, 0.13, 0.04, 0.28, 0)]),
  // Screwdriver
  () => {
    const grip = new THREE.CylinderGeometry(0.055, 0.045, 0.28, 16);
    grip.translate(0, -0.17, 0);
    const shaft = new THREE.CylinderGeometry(0.016, 0.016, 0.34, 10);
    shaft.translate(0, 0.14, 0);
    return combine([grip, shaft, box(0.05, 0.05, 0.012, 0, 0.32, 0)]);
  },
  // Wrench
  () => {
    const head = new THREE.Shape();
    head.absarc(0, 0.27, 0.12, -0.75 + Math.PI / 2 + 1.5, Math.PI / 2 - 0.75 + 0.0 + Math.PI * 2 - 1.5 + 1.5, false);
    head.lineTo(0, 0.25);
    head.closePath();
    const built = extrude(head, 0.05);
    return combine([built, box(0.09, 0.5, 0.05, 0, -0.08, 0.025)]);
  },
  // Pliers
  () => {
    const arm = (lean: number) => {
      const part = box(0.055, 0.66, 0.04);
      part.rotateZ(lean);
      return part;
    };
    const pivot = new THREE.CylinderGeometry(0.05, 0.05, 0.05, 16);
    pivot.rotateX(Math.PI / 2);
    pivot.translate(0, 0.1, 0);
    const a = arm(0.2);
    const b = arm(-0.2);
    a.translate(0, 0.1, 0);
    b.translate(0, 0.1, 0);
    return combine([a, b, pivot]);
  },
  // Paintbrush
  () => combine([box(0.05, 0.4, 0.05, 0, -0.1, 0), box(0.14, 0.09, 0.06, 0, 0.13, 0), box(0.17, 0.2, 0.05, 0, 0.27, 0)]),
  // Ruler
  () => {
    const ticks: THREE.BufferGeometry[] = [box(0.13, 0.66, 0.02)];
    for (let i = 0; i < 9; i++) ticks.push(box(i % 2 ? 0.05 : 0.08, 0.012, 0.03, -0.03, -0.28 + i * 0.07, 0.01));
    return combine(ticks);
  },
];

export const TOOL_COUNT = Math.max(TOOLS.length, skillGroups.length);

/** Skills: a toolbox bursts open and its tools fly out to orbit it. */
function skillsParts(): Part[] {
  const body = box(1.5, 0.52, 0.72, 0, -0.62, 0);
  const handle = new THREE.TorusGeometry(0.17, 0.022, 8, 28, Math.PI);
  handle.translate(0, -0.31, 0);
  const lid = combine([box(1.5, 0.08, 0.72, 0, -0.33, 0), handle]);
  return [
    { share: 0.3, group: 0, geometry: body },
    { share: 0.16, group: 1, geometry: lid },
    ...TOOLS.map((tool, i) => {
      const built = clean(tool());
      built.translate(-0.55 + 0.22 * i, -0.45, 0);
      return { share: 0.09, group: 2 + i, geometry: built };
    }),
  ];
}

const LIGHT = new THREE.Vector3(0.35, 0.65, 0.68).normalize();

function fillLayer(data: Float32Array, layer: number, count: number, parts: Part[]) {
  const offset = layer * count * 4;
  const point: Point = { position: new THREE.Vector3(), normal: new THREE.Vector3() };
  let written = 0;

  parts.forEach((part, index) => {
    const amount = index === parts.length - 1 ? count - written : Math.round(part.share * count);
    const sampler = part.geometry ? new MeshSurfaceSampler(new THREE.Mesh(clean(part.geometry))).build() : null;
    for (let i = 0; i < amount; i++) {
      if (sampler) sampler.sample(point.position, point.normal);
      else part.point!(point, i);
      const at = offset + written * 4;
      data[at] = point.position.x;
      data[at + 1] = point.position.y;
      data[at + 2] = point.position.z;
      const shade = part.shade ?? Math.max(0, point.normal.dot(LIGHT)) * 0.8 + 0.2;
      const group = typeof part.group === "function" ? part.group(point.position, i) : part.group;
      // Whole part is the group, fraction is how much the point faces the light.
      data[at + 3] = group + shade * 0.99;
      written += 1;
    }
  });

  // Particles keep their index across shapes, so shuffle to stop parts of one
  // shape travelling together into the same part of the next.
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    for (let k = 0; k < 4; k++) {
      const swap = data[offset + i * 4 + k];
      data[offset + i * 4 + k] = data[offset + j * 4 + k];
      data[offset + j * 4 + k] = swap;
    }
  }
}

/**
 * Samples every shape into one float array: side x side particles, one layer
 * per stop.
 */
export async function buildShapes(side: number, stacked: boolean, onFirst: (data: Float32Array) => void) {
  const font = new FontLoader().parse(await (await fetch("/fonts/gallery-display.json")).json());
  const count = side * side;
  const data = new Float32Array(count * 4 * stops.length);

  const name = stacked ? combine([word(font, "DANIEL", 1, 0.62), word(font, "ADEGOKE", 0.82, -0.5)]) : combine([word(font, "DANIEL ADEGOKE", 1)]);

  const build: Record<string, () => Part[]> = {
    top: () => [{ share: 1, group: 0, geometry: normalise(name) }],
    experience: experienceParts,
    uncooked: uncookedParts,
    "smart-bookmarks": bookmarkParts,
    omniplexus: omniplexusParts,
    inscribe: () => inscribeParts(font),
    gear: gearParts,
    wormhole: wormholeParts,
    skills: skillsParts,
    about: () => [{ share: 1, group: 0, geometry: normalise(clean(word(font, "3.81", 1))) }],
    contact: () => [{ share: 1, group: 0, geometry: normalise(clean(word(font, "@", 2))) }],
  };

  for (let layer = 0; layer < stops.length; layer++) {
    fillLayer(data, layer, count, build[stops[layer].id]());
    if (layer === 0) {
      // Until the rest arrive, every layer is the name, so the form shows now.
      for (let other = 1; other < stops.length; other++) data.copyWithin(other * count * 4, 0, count * 4);
      onFirst(data);
    }
    // Yield between shapes so sampling never blocks scrolling.
    await new Promise((resolve) => setTimeout(resolve));
  }
  return data;
}
