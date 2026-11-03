import * as THREE from "three";
import { FontLoader, type Font } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { proofs } from "@/lib/content";
import { stops, type Stop } from "@/lib/gallery";

// The form only ever takes three kinds of shape: the name, a number that the
// words beside it prove, and loose dust at rest between them. Letters are solid:
// every point keeps its surface normal, so the shader can light it live and hide
// the side facing away.

type Point = { position: THREE.Vector3; normal: THREE.Vector3 };

type Part = {
  share: number;
  shade?: number;
  geometry?: THREE.BufferGeometry;
  point?: (out: Point) => void;
};

const clean = (geometry: THREE.BufferGeometry) => {
  const flat = geometry.index ? geometry.toNonIndexed() : geometry;
  for (const name of Object.keys(flat.attributes)) {
    if (name !== "position" && name !== "normal") flat.deleteAttribute(name);
  }
  flat.computeVertexNormals();
  return flat;
};

function word(font: Font, text: string, size: number, depth = 0.07) {
  const part = new TextGeometry(text, { font, size, depth, curveSegments: 8, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.02, bevelSegments: 1 });
  return clean(part);
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

/** Dust over the whole screen, in a thin slab behind the words. */
const dust: Part = {
  share: 1,
  shade: 0.3,
  point: ({ position, normal }) => {
    position.set((Math.random() * 2 - 1) * 2.3, (Math.random() * 2 - 1) * 1.15, -0.4 - Math.random() * 1.6);
    normal.set(0, 0, 0);
  },
};

const LIGHT = new THREE.Vector3(0.35, 0.65, 0.68).normalize();

function fillLayer(data: Float32Array, normals: Float32Array, layer: number, count: number, parts: Part[]) {
  const offset = layer * count * 4;
  const point: Point = { position: new THREE.Vector3(), normal: new THREE.Vector3() };
  let written = 0;

  parts.forEach((part, index) => {
    const amount = index === parts.length - 1 ? count - written : Math.round(part.share * count);
    const sampler = part.geometry ? new MeshSurfaceSampler(new THREE.Mesh(part.geometry)).build() : null;
    for (let i = 0; i < amount; i++) {
      if (sampler) sampler.sample(point.position, point.normal);
      else part.point!(point);
      const at = offset + written * 4;
      data[at] = point.position.x;
      data[at + 1] = point.position.y;
      data[at + 2] = point.position.z;
      // How much the point faces the light, unless the part fixes its shade.
      data[at + 3] = (part.shade ?? Math.max(0, point.normal.dot(LIGHT)) * 0.8 + 0.2) * 0.99;
      // A fixed shade means loose dust: nothing to turn.
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

function partsFor(stop: Stop, font: Font, name: () => THREE.BufferGeometry): Part[] {
  if (stop.form === "rest") return [dust];
  if (stop.form === "name") return [{ share: 1, geometry: name() }];
  return [{ share: 1, geometry: normalise(word(font, proofs[stop.id].figure.toUpperCase(), 1)) }];
}

/**
 * Samples every shape into one float array: side x side particles, one layer
 * per stop.
 */
export async function buildShapes(side: number, onFirst: (data: Float32Array, normals: Float32Array) => void) {
  const font = new FontLoader().parse(await (await fetch("/fonts/gallery-display.json")).json());
  const count = side * side;
  const data = new Float32Array(count * 4 * stops.length);
  const normals = new Float32Array(count * 4 * stops.length);
  const name = () => normalise(word(font, "DANIEL ADEGOKE", 1));

  for (let layer = 0; layer < stops.length; layer++) {
    fillLayer(data, normals, layer, count, partsFor(stops[layer], font, name));
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
