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
// the experience slabs are as long as each job, the skills columns as tall as
// each group, the gears are true involute profiles that really mesh.
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

function word(font: Font, text: string, size: number, y = 0) {
  const part = new TextGeometry(text, { font, size, depth: 0.07, curveSegments: 8, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.02, bevelSegments: 1 });
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

function experienceParts(): Part[] {
  const slabs = experience.map(monthsOf);
  return [{ share: 1, group: 0, geometry: normalise(combine(slabs.map((months, i) => box(0.5 + months * 0.34, 0.3, 0.9, 0, (slabs.length - 1 - i) * 0.52, 0, i * 0.45)))) }];
}

/** Uncooked: a resume whose untrue lines burn away while the true ones hold. */
function uncookedParts(): Part[] {
  const lines = [
    { y: 0.62, width: 1.05, burns: false },
    { y: 0.36, width: 0.8, burns: false },
    { y: 0.1, width: 1.05, burns: true },
    { y: -0.16, width: 0.9, burns: false },
    { y: -0.42, width: 1.05, burns: true },
    { y: -0.68, width: 0.62, burns: false },
  ];
  const page = new THREE.Shape();
  page.moveTo(-0.72, -1).lineTo(0.42, -1).lineTo(0.72, -0.7).lineTo(0.72, 1).lineTo(-0.72, 1).closePath();
  for (const line of lines) {
    const slot = new THREE.Path();
    slot.moveTo(-0.53, line.y).lineTo(-0.53 + line.width, line.y).lineTo(-0.53 + line.width, line.y + 0.11).lineTo(-0.53, line.y + 0.11).closePath();
    page.holes.push(slot);
  }
  const bars = (burns: boolean) => combine(lines.filter((line) => line.burns === burns).map((line) => box(line.width, 0.1, 0.05, -0.53 + line.width / 2, line.y + 0.055)));
  return [
    { share: 0.56, group: 0, geometry: extrude(page, 0.05) },
    { share: 0.14, group: 2, shade: 0.55, geometry: bars(false) },
    { share: 0.3, group: 1, shade: 1, geometry: bars(true) },
  ];
}

/** Smart Bookmarks: a storm of links is drawn in and tightens into one ribbon. */
function bookmarkParts(): Part[] {
  const ribbon = new THREE.BoxGeometry(1.0, 2, 0.06, 32, 64, 1);
  const position = ribbon.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const bottom = -1 + (1 - Math.abs(x) / 0.5) * 0.46;
    const y = bottom + ((1 - bottom) * (position.getY(i) + 1)) / 2;
    position.setY(i, y);
    position.setZ(i, position.getZ(i) + Math.sin(y * 2.2) * 0.2 + x * x * 0.3);
  }
  return [
    { share: 0.55, group: 0, geometry: clean(ribbon) },
    {
      share: 0.45,
      group: 1,
      shade: 0.8,
      point: ({ position: out, normal }) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.5 + Math.random() * 0.65;
        out.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 1.8, Math.sin(angle) * radius * 0.6);
        normal.set(0, 0, 1);
      },
    },
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

/** The script Inscribe's pen writes. The shader traces this same curve. */
export function inkPoint(u: number, out = new THREE.Vector2()) {
  const loops = u * Math.PI * 2 * 7;
  return out.set(-1 + 1.5 * u - 0.1 * Math.sin(loops), -0.5 + 0.2 * Math.cos(loops) * (0.72 + 0.28 * Math.sin(u * Math.PI * 4)));
}

/** Inscribe: a pen writes a glowing line of script in the air, stroke by stroke. */
function inscribeParts(): Part[] {
  const nib = new THREE.Shape();
  nib.moveTo(0, 0);
  nib.bezierCurveTo(0.08, 0.28, 0.37, 0.54, 0.31, 0.86);
  nib.lineTo(0.21, 1.24);
  nib.lineTo(-0.21, 1.24);
  nib.lineTo(-0.31, 0.86);
  nib.bezierCurveTo(-0.37, 0.54, -0.08, 0.28, 0, 0);
  const eye = new THREE.Path();
  eye.absarc(0, 0.78, 0.07, 0, Math.PI * 2, true);
  nib.holes.push(eye);
  const slit = new THREE.Path();
  slit.moveTo(-0.018, 0.16).lineTo(0.018, 0.16).lineTo(0.018, 0.72).lineTo(-0.018, 0.72).closePath();
  nib.holes.push(slit);
  const pen = extrude(nib, 0.05);
  pen.scale(0.7, 0.7, 0.7);
  pen.rotateZ(-0.32);
  const start = inkPoint(0);
  pen.translate(start.x, start.y, 0);

  const ink = new THREE.Vector2();
  return [
    { share: 0.42, group: 0, geometry: pen },
    {
      share: 0.58,
      group: (_, index) => 1 + (index % 1000),
      shade: 0.62,
      point: ({ position: out, normal }, index) => {
        inkPoint((index % 1000) / 999, ink);
        out.set(ink.x + (Math.random() - 0.5) * 0.024, ink.y + (Math.random() - 0.5) * 0.024, (Math.random() - 0.5) * 0.02);
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

/** Wormhole: sampled as rings, but the shader opens them around the viewer. */
function wormholeParts(): Part[] {
  const rings: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 9; i++) {
    const ring = new THREE.TorusGeometry(1 - i * 0.09, 0.03, 10, 96);
    ring.translate(0, 0, 0.7 - i * 0.2);
    rings.push(ring);
  }
  return [{ share: 1, group: 0, geometry: combine(rings) }];
}

function skillsParts(): Part[] {
  const columns = skillGroups.map((group, i) => {
    const angle = (i / skillGroups.length) * Math.PI * 2;
    const height = group.skills.length * 0.28;
    const column = new THREE.CylinderGeometry(0.24, 0.24, height, 32);
    column.translate(Math.cos(angle) * 0.92, height / 2, Math.sin(angle) * 0.92);
    return column;
  });
  return [{ share: 1, group: 0, geometry: normalise(combine(columns)) }];
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
    inscribe: inscribeParts,
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
