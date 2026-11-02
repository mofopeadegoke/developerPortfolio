import * as THREE from "three";
import { FontLoader, type Font } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { SVGLoader } from "three-stdlib";
import { experience } from "@/lib/content";
import { involuteGear } from "@/lib/gear";
import { stops } from "@/lib/gallery";

// Every shape the form takes is real geometry, and where possible real data:
// each train carriage is as long as the job it stands for, the gears are true
// involute profiles. Models are solid: every point keeps its surface normal, so
// the shader can light it live and hide the side facing away.
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
  const engine = 0.62;
  const gap = 0.05;
  const base = 0.3;
  const spare = 3.4 - engine - (gap + base) * months.length;
  let front = 1 - engine - gap;
  const carriages = months.map((value) => {
    const length = base + (spare * value) / total;
    const carriage = { z: front - length / 2, length };
    front -= length + gap;
    return carriage;
  });
  const wheels = [0.82, 0.5, ...carriages.flatMap(({ z, length }) => [z + length / 2 - 0.1, z - length / 2 + 0.1])];
  return { carriages, wheels, wheelY: -0.2, chimney: [0.48, 0.84] as const, pitch: 0.5 };
}

export const TRAIN = layoutTrain();

function wheelPair(z: number) {
  const side = (x: number) => {
    const parts: THREE.BufferGeometry[] = [new THREE.TorusGeometry(0.075, 0.016, 8, 26), new THREE.CylinderGeometry(0.03, 0.03, 0.03, 12).rotateX(Math.PI / 2)];
    for (const angle of [0, Math.PI / 3, (2 * Math.PI) / 3]) parts.push(box(0.15, 0.014, 0.014).rotateZ(angle));
    return combine(parts).rotateY(Math.PI / 2).translate(x, TRAIN.wheelY, z);
  };
  return combine([side(0.23), side(-0.23)]);
}

/** Experience: a steam train driving down its track towards the viewer. */
function experienceParts(): Part[] {
  const along = (geometry: THREE.BufferGeometry) => geometry.rotateX(Math.PI / 2);
  const boiler = along(new THREE.CylinderGeometry(0.2, 0.2, 0.5, 32)).translate(0, 0.06, 0.74);
  const smokebox = along(new THREE.CylinderGeometry(0.21, 0.21, 0.05, 32)).translate(0, 0.06, 1);
  const chimney = new THREE.CylinderGeometry(0.075, 0.05, 0.2, 18).translate(0, TRAIN.chimney[0] - 0.1, TRAIN.chimney[1]);
  const dome = new THREE.SphereGeometry(0.08, 16, 12).translate(0, 0.28, 0.62);
  const cowcatcher = new THREE.ConeGeometry(0.26, 0.26, 4).rotateY(Math.PI / 4).rotateX(Math.PI / 2).scale(1, 0.55, 1).translate(0, -0.2, 1.06);
  const engine = [boiler, smokebox, chimney, dome, cowcatcher, box(0.5, 0.42, 0.3, 0, 0.1, 0.34), box(0.56, 0.03, 0.4, 0, 0.33, 0.34), box(0.46, 0.06, 0.74, 0, -0.14, 0.66)];
  const roofs = TRAIN.carriages.map(({ z, length }) => new THREE.CylinderGeometry(0.25, 0.25, length, 26, 1, false, -Math.PI / 2, Math.PI).rotateZ(Math.PI / 2).rotateY(Math.PI / 2).scale(1, 0.3, 1));
  const carriages = TRAIN.carriages.flatMap(({ z, length }, i) => [box(0.5, 0.36, length, 0, 0.04, z), roofs[i].rotateX(Math.PI / 2).rotateZ(0).translate(0, 0.22, z), box(0.44, 0.05, length * 0.9, 0, -0.16, z)]);
  const windows = TRAIN.carriages.flatMap(({ z, length }) => {
    const count = Math.max(1, Math.floor(length / 0.2));
    return Array.from({ length: count }, (_, i) => {
      const at = z - length / 2 + (length * (i + 0.5)) / count;
      return [box(0.012, 0.13, 0.1, 0.255, 0.08, at), box(0.012, 0.13, 0.1, -0.255, 0.08, at)];
    }).flat();
  });
  const sleepers: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 46; i++) sleepers.push(box(0.68, 0.025, 0.07, 0, -0.3, 4.2 - i * 0.26));
  return [
    { share: 0.298, group: 0, geometry: combine(engine) },
    { share: 0.3, group: 1, geometry: combine(carriages) },
    { share: 0.08, group: 1, shade: 1, geometry: combine(windows) },
    { share: 0.012, group: 0, shade: 1, geometry: new THREE.SphereGeometry(0.035, 12, 10).translate(0, 0.08, 1.04) },
    ...TRAIN.wheels.map((z, i) => ({ share: 0.008, group: 10 + i, geometry: wheelPair(z) })),
    { share: 0.07, group: 2, geometry: combine([box(0.025, 0.03, 12.4, 0.23, -0.27, -1.8), box(0.025, 0.03, 12.4, -0.23, -0.27, -1.8)]) },
    { share: 0.09, group: 3, geometry: combine(sleepers) },
    {
      share: 0.05,
      group: 4,
      shade: 0.6,
      point: ({ position: at, normal }) => {
        at.set(0, TRAIN.chimney[0], TRAIN.chimney[1]);
        normal.set(0, 0, 0);
      },
    },
  ];
}

/** Uncooked: a frying pan tosses a resume like a pancake. It lands uncooked. */
export const PAN = { x: -0.32, y: -0.62, tilt: 0.45 };

function uncookedParts(): Part[] {
  const profile = [[0, 0], [0.72, 0], [0.8, 0.05], [0.85, 0.26], [0.81, 0.28], [0.75, 0.1], [0.7, 0.06], [0, 0.06]].map(([x, y]) => new THREE.Vector2(x, y));
  const bowl = new THREE.LatheGeometry(profile, 64);
  const handle = new THREE.CylinderGeometry(0.055, 0.04, 0.62, 16).rotateZ(Math.PI / 2 - 0.12).translate(1.14, 0.24, 0);
  const rivets = [0.07, -0.07].map((z) => new THREE.SphereGeometry(0.022, 10, 8).translate(0.76, 0.2, z));
  const pan = combine([bowl, handle, ...rivets]);
  pan.rotateX(PAN.tilt);
  pan.rotateY(0.22);
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
        normal.set(0, 0, 0);
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
        normal.set(0, 0, 0);
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

/** Six solid tools, each built upright around its own centre. */
const TOOLS: (() => THREE.BufferGeometry)[] = [
  // Hammer
  () => combine([new THREE.CylinderGeometry(0.03, 0.04, 0.62, 14), new THREE.CylinderGeometry(0.07, 0.07, 0.3, 18).rotateZ(Math.PI / 2).translate(0.03, 0.29, 0)]),
  // Screwdriver
  () => combine([new THREE.CylinderGeometry(0.06, 0.05, 0.28, 8).translate(0, -0.17, 0), new THREE.CylinderGeometry(0.016, 0.016, 0.36, 10).translate(0, 0.14, 0), box(0.05, 0.05, 0.014, 0, 0.33, 0)]),
  // Wrench
  () => {
    const head = new THREE.Shape();
    head.absarc(0, 0.27, 0.13, Math.PI / 2 + 0.75, Math.PI * 2 + Math.PI / 2 - 0.75, false);
    head.lineTo(0, 0.25);
    head.closePath();
    return combine([extrude(head, 0.07).translate(0, 0, -0.035), box(0.09, 0.52, 0.07, 0, -0.08, 0)]);
  },
  // Pliers
  () => {
    const arm = (lean: number) => box(0.06, 0.66, 0.05).rotateZ(lean).translate(0, 0.1, 0);
    return combine([arm(0.2), arm(-0.2), new THREE.CylinderGeometry(0.055, 0.055, 0.09, 18).rotateX(Math.PI / 2).translate(0, 0.1, 0)]);
  },
  // Paintbrush
  () => combine([new THREE.CylinderGeometry(0.025, 0.04, 0.4, 14).translate(0, -0.1, 0), box(0.14, 0.09, 0.07, 0, 0.13, 0), box(0.18, 0.2, 0.06, 0, 0.27, 0)]),
  // Tape measure
  () => combine([new THREE.CylinderGeometry(0.17, 0.17, 0.09, 30).rotateX(Math.PI / 2), box(0.22, 0.05, 0.09, 0.05, -0.16, 0), box(0.09, 0.3, 0.012, 0.13, -0.3, 0)]),
];

/** Skills: a real hollow toolbox whose lid opens and whose tools tumble out. */
function skillsParts(): Part[] {
  const wall = 0.035;
  const [width, height, depth] = [1.5, 0.52, 0.76];
  const y = -0.62;
  const body = [
    box(width, wall, depth, 0, y - height / 2, 0),
    box(width, height, wall, 0, y, depth / 2),
    box(width, height, wall, 0, y, -depth / 2),
    box(wall, height, depth, width / 2, y, 0),
    box(wall, height, depth, -width / 2, y, 0),
    box(width + 0.04, 0.05, depth + 0.04, 0, y + height / 2 - 0.02, 0),
    box(0.14, 0.14, 0.03, 0.42, y + 0.14, depth / 2 + 0.02),
    box(0.14, 0.14, 0.03, -0.42, y + 0.14, depth / 2 + 0.02),
  ];
  const top = -0.3;
  const handle = new THREE.TorusGeometry(0.17, 0.024, 10, 30, Math.PI).translate(0, top + 0.03, 0.02);
  const lid = [
    box(width + 0.04, wall, depth + 0.04, 0, top, 0),
    box(width + 0.04, 0.09, wall, 0, top - 0.045, depth / 2 + 0.02),
    box(width + 0.04, 0.09, wall, 0, top - 0.045, -depth / 2 - 0.02),
    box(wall, 0.09, depth + 0.04, width / 2 + 0.02, top - 0.045, 0),
    box(wall, 0.09, depth + 0.04, -width / 2 - 0.02, top - 0.045, 0),
    handle,
  ];
  return [
    { share: 0.3, group: 0, geometry: combine(body) },
    { share: 0.16, group: 1, geometry: combine(lid) },
    ...TOOLS.map((tool, i) => {
      const built = clean(tool());
      built.translate(-0.55 + 0.22 * i, -0.45, 0);
      return { share: 0.09, group: 2 + i, geometry: built };
    }),
  ];
}

const LIGHT = new THREE.Vector3(0.35, 0.65, 0.68).normalize();

function fillLayer(data: Float32Array, normals: Float32Array, layer: number, count: number, parts: Part[]) {
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
      // A fixed shade means a light source or a loose spark: nothing to turn.
      const lit = part.shade === undefined;
      normals[at] = lit ? point.normal.x : 0;
      normals[at + 1] = lit ? point.normal.y : 0;
      normals[at + 2] = lit ? point.normal.z : 0;
      written += 1;
    }
  });

  // Particles keep their index across shapes, so shuffle to stop parts of one
  // shape travelling together into the same part of the next.
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    for (let k = 0; k < 4; k++) {
      for (const list of [data, normals]) {
        const swap = list[offset + i * 4 + k];
        list[offset + i * 4 + k] = list[offset + j * 4 + k];
        list[offset + j * 4 + k] = swap;
      }
    }
  }
}

/**
 * Samples every shape into one float array: side x side particles, one layer
 * per stop.
 */
export async function buildShapes(side: number, stacked: boolean, onFirst: (data: Float32Array, normals: Float32Array) => void) {
  const font = new FontLoader().parse(await (await fetch("/fonts/gallery-display.json")).json());
  const count = side * side;
  const data = new Float32Array(count * 4 * stops.length);
  const normals = new Float32Array(count * 4 * stops.length);

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
    fillLayer(data, normals, layer, count, build[stops[layer].id]());
    if (layer === 0) {
      // Until the rest arrive, every layer is the name, so the form shows now.
      for (let other = 1; other < stops.length; other++) {
        data.copyWithin(other * count * 4, 0, count * 4);
        normals.copyWithin(other * count * 4, 0, count * 4);
      }
      onFirst(data, normals);
    }
    // Yield between shapes so sampling never blocks scrolling.
    await new Promise((resolve) => setTimeout(resolve));
  }
  return data;
}
