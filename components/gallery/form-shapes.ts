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
// each group, the gear is the same involute profile as the Gear Library.

type Part = THREE.BufferGeometry;

const clean = (geometry: Part) => {
  const flat = geometry.index ? geometry.toNonIndexed() : geometry;
  for (const name of Object.keys(flat.attributes)) {
    if (name !== "position" && name !== "normal") flat.deleteAttribute(name);
  }
  flat.computeVertexNormals();
  return flat;
};

const combine = (parts: Part[]) => mergeGeometries(parts.map(clean))!;

const bevel = { bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.04, bevelSegments: 2, curveSegments: 10 };
const extrude = (shape: THREE.Shape, depth: number) => new THREE.ExtrudeGeometry(shape, { depth, ...bevel });

const box = (w: number, h: number, d: number, x = 0, y = 0, z = 0, turn = 0) => {
  const part = new THREE.BoxGeometry(w, h, d);
  part.rotateY(turn);
  part.translate(x, y, z);
  return part;
};

function word(font: Font, text: string, size: number, y = 0, centre = true) {
  const part = new TextGeometry(text, { font, size, depth: 0.07, curveSegments: 8, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.02, bevelSegments: 1 });
  if (centre) {
    part.computeBoundingBox();
    const box3 = part.boundingBox!;
    part.translate(-(box3.max.x + box3.min.x) / 2, y, 0);
  }
  return part;
}

function monthsOf(job: { start: string; end: string }) {
  const end = job.end === "Present" ? Date.now() : Date.parse(`1 ${job.end}`);
  return Math.max(1, (end - Date.parse(`1 ${job.start}`)) / 2.63e9);
}

function experienceShape() {
  const slabs = experience.map(monthsOf);
  return combine(slabs.map((months, i) => box(0.5 + months * 0.34, 0.3, 0.9, 0, (slabs.length - 1 - i) * 0.52, 0, i * 0.45)));
}

function pageShape() {
  const page = new THREE.Shape();
  page.moveTo(-1, -1.4).lineTo(0.55, -1.4).lineTo(1, -0.95).lineTo(1, 1.4).lineTo(-1, 1.4).closePath();
  for (const [y, width] of [[0.95, 1.5], [0.55, 1.15], [-0.45, 1.5], [-0.85, 0.9]]) {
    const slot = new THREE.Path();
    slot.moveTo(-0.72, y).lineTo(-0.72 + width, y).lineTo(-0.72 + width, y + 0.14).lineTo(-0.72, y + 0.14).closePath();
    page.holes.push(slot);
  }
  const cut = new THREE.Path();
  cut.moveTo(-0.72, -0.05).lineTo(0.78, -0.05).lineTo(0.78, 0.2).lineTo(-0.72, 0.2).closePath();
  page.holes.push(cut);
  // The line that was cut drifts away from the page.
  const strip = box(1.38, 0.2, 0.1, 1.5, 0.3, 0.3);
  strip.rotateZ(-0.2);
  return combine([extrude(page, 0.12), strip]);
}

function bookmarkShape() {
  const ribbon = new THREE.BoxGeometry(1.44, 3, 0.1, 32, 64, 1);
  const position = ribbon.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const bottom = -1.5 + (1 - Math.abs(x) / 0.72) * 0.68;
    const y = bottom + ((1.5 - bottom) * (position.getY(i) + 1.5)) / 3;
    position.setY(i, y);
    position.setZ(i, position.getZ(i) + Math.sin(y * 1.5) * 0.3 + x * x * 0.22);
  }
  return clean(ribbon);
}

function modulesShape() {
  const parts: Part[] = [box(3.05, 3.05, 0.1, 0, 0, -0.3)];
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      const rise = Math.max(0, Math.sin((x + y) * 0.9)) * 0.8;
      parts.push(box(0.46, 0.46, 0.2 + rise, (x - 2) * 0.58, (y - 2) * 0.58, rise / 2));
    }
  }
  return combine(parts);
}

function nibShape() {
  const nib = new THREE.Shape();
  nib.moveTo(0, -1.65);
  nib.bezierCurveTo(0.2, -0.95, 0.92, -0.3, 0.78, 0.5);
  nib.lineTo(0.52, 1.45);
  nib.lineTo(-0.52, 1.45);
  nib.lineTo(-0.78, 0.5);
  nib.bezierCurveTo(-0.92, -0.3, -0.2, -0.95, 0, -1.65);
  const eye = new THREE.Path();
  eye.absarc(0, 0.28, 0.18, 0, Math.PI * 2, true);
  nib.holes.push(eye);
  const slit = new THREE.Path();
  slit.moveTo(-0.06, -1.2).lineTo(0.06, -1.2).lineTo(0.06, 0.12).lineTo(-0.06, 0.12).closePath();
  nib.holes.push(slit);
  const part = extrude(nib, 0.16);
  part.rotateZ(-0.34);
  return clean(part);
}

function gearShape() {
  const { outline } = involuteGear(18, 0.16);
  const parsed = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${outline}"/></svg>`);
  const shape = SVGLoader.createShapes(parsed.paths[0] as THREE.ShapePath)[0];
  const bore = new THREE.Path();
  bore.absarc(0, 0, 0.36, 0, Math.PI * 2, true);
  shape.holes.push(bore);
  return clean(extrude(shape, 0.36));
}

function wormholeShape() {
  const rings: Part[] = [];
  for (let i = 0; i < 9; i++) {
    const ring = new THREE.TorusGeometry(1.5 - i * 0.14, 0.05, 10, 96);
    ring.rotateX(Math.sin(i * 0.6) * 0.16);
    ring.translate(Math.sin(i * 0.5) * 0.12, Math.cos(i * 0.5) * 0.12 - 0.12, 1 - i * 0.34);
    rings.push(ring);
  }
  return combine(rings);
}

function skillsShape() {
  return combine(
    skillGroups.map((group, i) => {
      const angle = (i / skillGroups.length) * Math.PI * 2;
      const height = group.skills.length * 0.28;
      const column = new THREE.CylinderGeometry(0.24, 0.24, height, 32);
      column.translate(Math.cos(angle) * 0.92, height / 2, Math.sin(angle) * 0.92);
      return column;
    }),
  );
}

/** Centres a shape and scales it so its widest side is 2 units. */
function normalise(geometry: Part) {
  geometry.computeBoundingBox();
  const box3 = geometry.boundingBox!;
  const centre = box3.getCenter(new THREE.Vector3());
  const size = box3.getSize(new THREE.Vector3());
  geometry.translate(-centre.x, -centre.y, -centre.z);
  geometry.scale(2 / Math.max(size.x, size.y), 2 / Math.max(size.x, size.y), 2 / Math.max(size.x, size.y));
  return geometry;
}

const LIGHT = new THREE.Vector3(0.35, 0.65, 0.68).normalize();

/**
 * Samples every shape into one float array: side x side particles, one layer
 * per stop. xyz is a point on the surface; w is how much that point faces the
 * light, which the shader uses to model the form.
 */
export async function buildShapes(side: number, stacked: boolean, onFirst: (data: Float32Array) => void) {
  const font = new FontLoader().parse(await (await fetch("/fonts/gallery-display.json")).json());
  const count = side * side;
  const data = new Float32Array(count * 4 * stops.length);

  const name = stacked
    ? combine([word(font, "DANIEL", 1, 0.62), word(font, "ADEGOKE", 0.82, -0.5)])
    : combine([word(font, "DANIEL ADEGOKE", 1)]);

  const build: Record<string, () => Part> = {
    top: () => name,
    experience: experienceShape,
    uncooked: pageShape,
    "smart-bookmarks": bookmarkShape,
    omniplexus: modulesShape,
    inscribe: nibShape,
    gear: gearShape,
    wormhole: wormholeShape,
    skills: skillsShape,
    about: () => clean(word(font, "3.81", 1)),
    contact: () => clean(word(font, "@", 2)),
  };

  const point = new THREE.Vector3();
  const normal = new THREE.Vector3();

  for (let layer = 0; layer < stops.length; layer++) {
    const sampler = new MeshSurfaceSampler(new THREE.Mesh(normalise(build[stops[layer].id]()))).build();
    const offset = layer * count * 4;
    for (let i = 0; i < count; i++) {
      sampler.sample(point, normal);
      data[offset + i * 4] = point.x;
      data[offset + i * 4 + 1] = point.y;
      data[offset + i * 4 + 2] = point.z;
      data[offset + i * 4 + 3] = Math.max(0, normal.dot(LIGHT)) * 0.8 + 0.2;
    }
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
