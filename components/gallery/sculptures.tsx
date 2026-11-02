"use client";

import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, Text3D } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three-stdlib";
import { experience, skillGroups } from "@/lib/content";
import { involuteGear } from "@/lib/gear";

// Sculptures are generated from code, and where possible from real data: the
// experience slabs are as long as each job, the skills columns as tall as each
// group, the gear is the same involute profile as the Gear Library.

const FONT = "/fonts/gallery-display.json";

type SculptureProps = { material: THREE.Material; active: boolean };

const bevel = { bevelEnabled: true, bevelSize: 0.035, bevelThickness: 0.05, bevelSegments: 4, curveSegments: 10 };
const extrude = (depth: number) => ({ depth, ...bevel });

function Word({ material, text, size, depth = 0.24 }: { material: THREE.Material; text: string; size: number; depth?: number }) {
  return (
    <Text3D font={FONT} size={size} height={depth} letterSpacing={0.07} material={material} {...bevel}>
      {text}
    </Text3D>
  );
}

function Spin({ active, speed = 0.25, swing = 0, children }: { active: boolean; speed?: number; swing?: number; children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!active || !group.current) return;
    if (swing > 0) group.current.rotation.y = Math.sin(state.clock.elapsedTime * speed) * swing;
    else group.current.rotation.y += delta * speed;
  });
  return <group ref={group}>{children}</group>;
}

function NameSculpture({ material, active, stacked }: SculptureProps & { stacked: boolean }) {
  return (
    <Spin active={active} speed={0.3} swing={0.16}>
      <Center>
        {stacked ? (
          <group>
            <group position={[0, 1.15, 0]}>
              <Word material={material} text="DANIEL" size={0.76} />
            </group>
            <Word material={material} text="ADEGOKE" size={0.62} />
          </group>
        ) : (
          <group>
            <group position={[0, 1.42, 0]}>
              <Word material={material} text="DANIEL" size={1.04} />
            </group>
            <Word material={material} text="ADEGOKE" size={0.88} />
          </group>
        )}
      </Center>
    </Spin>
  );
}

function monthsOf(job: { start: string; end: string }) {
  const end = job.end === "Present" ? Date.now() : Date.parse(`1 ${job.end}`);
  return Math.max(1, (end - Date.parse(`1 ${job.start}`)) / 2.63e9);
}

function ExperienceSculpture({ material, active }: SculptureProps) {
  const slabs = useMemo(() => experience.map(monthsOf), []);
  return (
    <Spin active={active} speed={0.22}>
      <group position={[0, -1.05, 0]}>
        {slabs.map((months, i) => (
          <mesh key={i} material={material} position={[0, (slabs.length - 1 - i) * 0.52, 0]} rotation={[0, i * 0.5, 0]}>
            <boxGeometry args={[0.45 + months * 0.32, 0.3, 0.9]} />
          </mesh>
        ))}
      </group>
    </Spin>
  );
}

function UncookedSculpture({ material, active }: SculptureProps) {
  const strip = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const page = new THREE.Shape();
    page.moveTo(-1, -1.4).lineTo(0.55, -1.4).lineTo(1, -0.95).lineTo(1, 1.4).lineTo(-1, 1.4).closePath();
    for (const [y, width] of [[0.95, 1.5], [0.55, 1.15], [-0.45, 1.5], [-0.85, 0.9]]) {
      const slot = new THREE.Path();
      slot.moveTo(-0.72, y).lineTo(-0.72 + width, y).lineTo(-0.72 + width, y + 0.13).lineTo(-0.72, y + 0.13).closePath();
      page.holes.push(slot);
    }
    const cut = new THREE.Path();
    cut.moveTo(-0.72, -0.05).lineTo(0.78, -0.05).lineTo(0.78, 0.2).lineTo(-0.72, 0.2).closePath();
    page.holes.push(cut);
    return new THREE.ExtrudeGeometry(page, extrude(0.14));
  }, []);

  useFrame((state) => {
    if (!active || !strip.current) return;
    strip.current.position.x = 1.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.14;
    strip.current.rotation.z = -0.22 + Math.sin(state.clock.elapsedTime * 0.35) * 0.07;
  });

  return (
    <group>
      <Spin active={active} speed={0.4} swing={0.42}>
        <mesh geometry={geometry} material={material} position={[-0.25, 0, -0.07]} />
      </Spin>
      <mesh ref={strip} material={material} position={[1.15, 0.1, 0.45]} rotation={[0, 0, -0.22]}>
        <boxGeometry args={[1.38, 0.2, 0.1]} />
      </mesh>
    </group>
  );
}

function BookmarkSculpture({ material, active }: SculptureProps) {
  const geometry = useMemo(() => {
    const ribbon = new THREE.Shape();
    ribbon.moveTo(-0.72, 1.5).lineTo(0.72, 1.5).lineTo(0.72, -1.5).lineTo(0, -0.82).lineTo(-0.72, -1.5).closePath();
    const built = new THREE.ExtrudeGeometry(ribbon, { ...extrude(0.14), steps: 1 });
    const position = built.attributes.position;
    for (let i = 0; i < position.count; i++) {
      position.setZ(i, position.getZ(i) + Math.sin(position.getY(i) * 1.5) * 0.3 + position.getX(i) ** 2 * 0.22);
    }
    built.computeVertexNormals();
    return built;
  }, []);
  return (
    <Spin active={active} speed={0.45} swing={0.55}>
      <mesh geometry={geometry} material={material} />
    </Spin>
  );
}

function OmniplexusSculpture({ material, active }: SculptureProps) {
  const instanced = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const size = 5;
  useFrame((state) => {
    const mesh = instanced.current;
    if (!mesh || (!active && state.frameloop === "always" && mesh.userData.placed)) return;
    const t = active ? state.clock.elapsedTime : 0;
    for (let i = 0; i < size * size; i++) {
      const x = i % size;
      const y = Math.floor(i / size);
      const wave = Math.max(0, Math.sin(t * 0.8 - (x + y) * 0.55));
      dummy.position.set((x - 2) * 0.58, (y - 2) * 0.58, wave * 0.5);
      dummy.scale.set(1, 1, 1 + wave * 1.4);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.userData.placed = true;
  });
  return (
    <Spin active={active} speed={0.3} swing={0.5}>
      <instancedMesh ref={instanced} args={[undefined, material, size * size]}>
        <boxGeometry args={[0.48, 0.48, 0.24]} />
      </instancedMesh>
      <mesh material={material} position={[0, 0, -0.34]}>
        <boxGeometry args={[3.05, 3.05, 0.14]} />
      </mesh>
    </Spin>
  );
}

function NibSculpture({ material, active }: SculptureProps) {
  const geometry = useMemo(() => {
    const nib = new THREE.Shape();
    nib.moveTo(0, -1.65);
    nib.bezierCurveTo(0.2, -0.95, 0.92, -0.3, 0.78, 0.5);
    nib.lineTo(0.52, 1.45);
    nib.lineTo(-0.52, 1.45);
    nib.lineTo(-0.78, 0.5);
    nib.bezierCurveTo(-0.92, -0.3, -0.2, -0.95, 0, -1.65);
    const eye = new THREE.Path();
    eye.absarc(0, 0.28, 0.17, 0, Math.PI * 2, true);
    nib.holes.push(eye);
    const slit = new THREE.Path();
    slit.moveTo(-0.022, -1.28).lineTo(0.022, -1.28).lineTo(0.022, 0.12).lineTo(-0.022, 0.12).closePath();
    nib.holes.push(slit);
    return new THREE.ExtrudeGeometry(nib, extrude(0.2));
  }, []);
  return (
    <Spin active={active} speed={0.42} swing={0.6}>
      <group rotation={[0, 0, -0.34]}>
        <mesh geometry={geometry} material={material} position={[0, 0, -0.1]} />
      </group>
    </Spin>
  );
}

function GearSculpture({ material, active }: SculptureProps) {
  const geometry = useMemo(() => {
    const { outline } = involuteGear(18, 0.16);
    const parsed = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${outline}"/></svg>`);
    const shape = SVGLoader.createShapes(parsed.paths[0] as THREE.ShapePath)[0];
    const bore = new THREE.Path();
    bore.absarc(0, 0, 0.36, 0, Math.PI * 2, true);
    shape.holes.push(bore);
    return new THREE.ExtrudeGeometry(shape, { ...extrude(0.42), bevelSize: 0.015, bevelThickness: 0.025 });
  }, []);
  const gear = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (active && gear.current) gear.current.rotation.z += delta * 0.3;
  });
  return (
    <group rotation={[0.25, -0.55, 0]}>
      <mesh ref={gear} geometry={geometry} material={material} position={[0, 0, -0.21]} />
    </group>
  );
}

function WormholeSculpture({ material, active }: SculptureProps) {
  const rings = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!active || !rings.current) return;
    rings.current.children.forEach((ring, i) => {
      ring.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + i * 0.5) * 0.3;
      ring.rotation.y = Math.cos(state.clock.elapsedTime * 0.4 + i * 0.5) * 0.3;
    });
  });
  return (
    <group ref={rings} rotation={[0, 0.45, 0]}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <mesh key={i} material={material} position={[0, 0, 0.9 - i * 0.34]}>
          <torusGeometry args={[1.5 - i * 0.18, 0.055, 16, 72]} />
        </mesh>
      ))}
    </group>
  );
}

function SkillsSculpture({ material, active }: SculptureProps) {
  return (
    <Spin active={active} speed={0.22}>
      <group position={[0, -1.4, 0]}>
        {skillGroups.map((group, i) => {
          const angle = (i / skillGroups.length) * Math.PI * 2;
          const height = group.skills.length * 0.27;
          return (
            <mesh key={group.name} material={material} position={[Math.cos(angle) * 0.92, height / 2, Math.sin(angle) * 0.92]}>
              <cylinderGeometry args={[0.24, 0.24, height, 36]} />
            </mesh>
          );
        })}
      </group>
    </Spin>
  );
}

function GradeSculpture({ material, active }: SculptureProps) {
  return (
    <Spin active={active} speed={0.36} swing={0.42}>
      <Center>
        <Word material={material} text="3.81" size={1.15} depth={0.5} />
      </Center>
    </Spin>
  );
}

function ContactSculpture({ material, active }: SculptureProps) {
  return (
    <Spin active={active} speed={0.4} swing={0.5}>
      <Center>
        <Word material={material} text="@" size={2.5} depth={0.5} />
      </Center>
    </Spin>
  );
}

export function Sculpture({ id, stacked, ...props }: SculptureProps & { id: string; stacked: boolean }) {
  switch (id) {
    case "top":
      return <NameSculpture {...props} stacked={stacked} />;
    case "experience":
      return <ExperienceSculpture {...props} />;
    case "uncooked":
      return <UncookedSculpture {...props} />;
    case "smart-bookmarks":
      return <BookmarkSculpture {...props} />;
    case "omniplexus":
      return <OmniplexusSculpture {...props} />;
    case "inscribe":
      return <NibSculpture {...props} />;
    case "gear":
      return <GearSculpture {...props} />;
    case "wormhole":
      return <WormholeSculpture {...props} />;
    case "skills":
      return <SkillsSculpture {...props} />;
    case "about":
      return <GradeSculpture {...props} />;
    case "contact":
      return <ContactSculpture {...props} />;
    default:
      return null;
  }
}
