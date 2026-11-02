"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { Edges, Environment, Lightformer, MeshReflectorMaterial, MeshTransmissionMaterial, PerformanceMonitor, useFBO } from "@react-three/drei";
import { ShaderGradient } from "@shadergradient/react";
import * as THREE from "three";
import { CAMERA_DISTANCE, CAMERA_FOV, PHONE_DISTANCE, STOP_SPACING, caseLayout, caseSize, roomColors, stopZ, stops, walkPosition, type Tier } from "@/lib/gallery";
import { Sculpture } from "@/components/gallery/sculptures";
import { createLiquidMetal, liquidTime } from "@/components/gallery/liquid-metal";

// ShaderGradient's shaders include chunks that newer Three.js removed. None of
// them affect its output, so they resolve to nothing.
const chunks = THREE.ShaderChunk as Record<string, string>;
for (const name of ["uv2_pars_vertex", "uv2_pars_fragment", "uv2_vertex", "encodings_fragment", "transmissionmap_fragment", "transmissionmap_pars_fragment", "cube_uv_reflection_fragment"]) {
  chunks[name] ??= "";
}

const ROOM_WIDTH = 15;
const ROOM_HEIGHT = 8;
const DOOR_WIDTH = 4.4;
const DOOR_HEIGHT = 5.4;
/** How bright a room is once the camera has left it: a glow, not a competitor. */
const AWAY_LIGHT = 0.5;

const roomLight = (distance: number) => THREE.MathUtils.lerp(1, AWAY_LIGHT, THREE.MathUtils.smoothstep(distance, 0.45, 1.1));

/** ShaderGradient renders off-screen, and its light washes every wall. */
function useWallLight(enabled: boolean) {
  const target = useFBO(512, 512, { depthBuffer: true });
  const scene = useMemo(() => new THREE.Scene(), []);
  const camera = useMemo(() => new THREE.PerspectiveCamera(45, 1, 0.1, 100), []);
  const { gl } = useThree();
  const tick = useRef(0);

  useFrame(() => {
    tick.current += 1;
    if (!enabled || tick.current % 2 === 0) return;
    const current = gl.getRenderTarget();
    gl.setRenderTarget(target);
    gl.render(scene, camera);
    gl.setRenderTarget(current);
  });

  const portal = enabled
    ? createPortal(
        <ShaderGradient
          control="props"
          type="plane"
          animate="on"
          uSpeed={0.14}
          uStrength={2.6}
          uDensity={1.2}
          uFrequency={5}
          color1="#ffffff"
          color2="#7f86a0"
          color3="#c9cde0"
          lightType="3d"
          brightness={1.35}
          cDistance={3.4}
          cAzimuthAngle={180}
          cPolarAngle={90}
          grain="off"
        />,
        scene,
        { camera },
      )
    : null;

  return { texture: enabled ? target.texture : null, portal };
}

function Walls({ wallLight, position }: { wallLight: THREE.Texture | null; position: { current: number } }) {
  const walls = useMemo(() => stops.map((stop) => new THREE.MeshBasicMaterial({ color: roomColors[stop.room], toneMapped: false })), []);
  const floors = useMemo(
    () => stops.map((stop) => new THREE.MeshStandardMaterial({ color: new THREE.Color(roomColors[stop.room]).multiplyScalar(0.42), roughness: 0.34, metalness: 0.15 })),
    [],
  );
  const base = useMemo(() => stops.map((stop) => new THREE.Color(roomColors[stop.room])), []);

  useEffect(() => {
    for (const material of walls) {
      material.map = wallLight;
      material.needsUpdate = true;
    }
  }, [walls, wallLight]);

  useFrame(() => {
    walls.forEach((material, i) => {
      const light = roomLight(Math.abs(position.current - i));
      material.color.copy(base[i]).multiplyScalar(light);
      floors[i].color.copy(base[i]).multiplyScalar(0.42 * light);
    });
  });

  const doors = useMemo(() => stops.flatMap((stop, i) => (stops[i + 1] && stops[i + 1].room !== stop.room ? [i] : [])), []);
  const pier = (ROOM_WIDTH - DOOR_WIDTH) / 2;

  return (
    <group>
      {stops.map((stop, i) => (
        <group key={stop.id} position={[0, 0, stopZ(i)]}>
          {/* Every other wall is mirrored so the wash runs across the joins. */}
          <mesh material={walls[i]} rotation={[0, Math.PI / 2, 0]} scale={[i % 2 ? -1 : 1, 1, 1]} position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]}>
            <planeGeometry args={[STOP_SPACING + 0.02, ROOM_HEIGHT]} />
          </mesh>
          <mesh material={walls[i]} rotation={[0, -Math.PI / 2, 0]} scale={[i % 2 ? -1 : 1, 1, 1]} position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, 0]}>
            <planeGeometry args={[STOP_SPACING + 0.02, ROOM_HEIGHT]} />
          </mesh>
          <mesh material={walls[i]} rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_HEIGHT, 0]}>
            <planeGeometry args={[ROOM_WIDTH, STOP_SPACING + 0.02]} />
          </mesh>
          <mesh material={floors[i]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[ROOM_WIDTH, STOP_SPACING + 0.02]} />
          </mesh>
        </group>
      ))}

      {doors.map((i) => (
        <group key={i} position={[0, 0, stopZ(i) - STOP_SPACING / 2]}>
          {[-1, 1].map((side) => (
            <mesh key={side} material={walls[i]} position={[side * (DOOR_WIDTH / 2 + pier / 2), ROOM_HEIGHT / 2, 0]}>
              <boxGeometry args={[pier, ROOM_HEIGHT, 0.4]} />
            </mesh>
          ))}
          <mesh material={walls[i]} position={[0, (ROOM_HEIGHT + DOOR_HEIGHT) / 2, 0]}>
            <boxGeometry args={[DOOR_WIDTH, ROOM_HEIGHT - DOOR_HEIGHT, 0.4]} />
          </mesh>
        </group>
      ))}

      {/* The far wall, so the walk ends in a room. */}
      <mesh material={walls[walls.length - 1]} position={[0, ROOM_HEIGHT / 2, stopZ(stops.length - 1) - STOP_SPACING / 2]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
      </mesh>
    </group>
  );
}

/** One soft diagonal sheen across the front pane, drawn once and shared. */
function createSheen() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const context = canvas.getContext("2d")!;
  const gradient = context.createLinearGradient(0, 0, 256, 256);
  gradient.addColorStop(0.1, "rgba(255,255,255,0)");
  gradient.addColorStop(0.36, "rgba(255,255,255,0.16)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.03)");
  gradient.addColorStop(0.62, "rgba(255,255,255,0.1)");
  gradient.addColorStop(0.85, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

function VitrineGlass({ size, full, sheen }: { size: [number, number, number]; full: boolean; sheen: THREE.Texture }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={size} />
        {full ? (
          <MeshTransmissionMaterial transmissionSampler thickness={0.35} roughness={0} ior={1.28} chromaticAberration={0.035} anisotropy={0.2} distortion={0.16} distortionScale={0.4} temporalDistortion={0.06} attenuationColor="#ffffff" color="#ffffff" />
        ) : (
          <meshPhysicalMaterial transparent opacity={0.1} roughness={0.05} metalness={0} color="#ffffff" depthWrite={false} />
        )}
        <Edges color="#ffffff" threshold={20} transparent opacity={0.28} />
      </mesh>
      <mesh position={[0, 0, size[2] / 2 + 0.01]}>
        <planeGeometry args={[size[0], size[1]]} />
        <meshBasicMaterial map={sheen} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

type CaseProps = {
  index: number;
  full: boolean;
  phone: boolean;
  position: { current: number };
  material: THREE.Material;
  sheen: THREE.Texture;
  caseX: { current: number[] };
};

function Case({ index, full, phone, position, material, sheen, caseX }: CaseProps) {
  const stop = stops[index];
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  const [state, setState] = useState({ near: index === 0, active: index === 0 });

  useFrame(() => {
    const distance = Math.abs(position.current - index);
    // Neighbouring cases only appear on the walk between stops.
    const near = distance < 0.92;
    const active = distance < 0.6;
    if (near !== state.near || active !== state.active) setState({ near, active });
  });

  const size = caseSize(stop, phone);
  const { x, fit, tie } = caseLayout(stop, width, height, phone);
  caseX.current[index] = x;

  // The hairline on the label ends on this case, at any screen width.
  useEffect(() => {
    document.querySelector<HTMLElement>(`[data-stop="${stop.id}"]`)?.style.setProperty("--tie", `${tie}px`);
  }, [stop.id, tie]);

  const baseHeight = phone ? 1.6 : 0.95;
  const plinth: [number, number] = [(size[0] + 0.3) * fit, (size[2] + 0.3) * fit];
  const isName = stop.id === "top";

  return (
    <group position={[x, 0, stopZ(index)]} visible={state.near}>
      <mesh position={[0, baseHeight / 2, 0]}>
        <boxGeometry args={[plinth[0], baseHeight, plinth[1]]} />
        <meshStandardMaterial color="#14151c" roughness={0.3} metalness={0.2} />
      </mesh>
      {full && state.active ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, baseHeight + 0.004, 0]}>
          <planeGeometry args={plinth} />
          <MeshReflectorMaterial resolution={512} mirror={0.55} mixStrength={1.6} blur={[120, 40]} mixBlur={0.7} roughness={0.35} metalness={0.3} color="#1b1c24" />
        </mesh>
      ) : null}
      <group position={[0, baseHeight + (size[1] / 2) * fit, 0]} scale={fit}>
        {/* Mounting rods, so each sculpture stands rather than floats. */}
        {(isName ? [-1.7, 1.7] : [0]).map((rod) => (
          <mesh key={rod} material={material} position={[rod, -size[1] / 4 - 0.2, 0]}>
            <cylinderGeometry args={[0.03, 0.03, size[1] / 2 - 0.4, 12]} />
          </mesh>
        ))}
        {state.near && (
          <Suspense fallback={null}>
            <group scale={isName ? 1 : 0.86}>
              <Sculpture id={stop.id} material={material} active={state.active} stacked={phone} />
            </group>
          </Suspense>
        )}
        <VitrineGlass size={size} full={full && state.active} sheen={sheen} />
      </group>
    </group>
  );
}

function Scene({ tier, onFallback }: { tier: Tier; onFallback: () => void }) {
  const phone = tier === "phone";
  const full = tier === "full";
  const { camera, size, scene } = useThree();
  const material = useMemo(createLiquidMetal, []);
  const sheen = useMemo(createSheen, []);
  // Under load the scene sheds effects one at a time, heaviest first, and only
  // drops to still images once there is nothing left to shed.
  const [shed, setShed] = useState(0);
  const setDpr = useThree((state) => state.setDpr);
  const { texture, portal } = useWallLight(full && shed < 3);
  const anchors = useRef<number[]>([]);
  const position = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const caseX = useRef<number[]>([]);
  const light = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  const glass = full && shed < 1;
  const white = useMemo(() => new THREE.Color("#ffffff"), []);
  const tints = useMemo(() => stops.map((stop) => new THREE.Color("#ffffff").lerp(new THREE.Color(roomColors[stop.room]), 0.16)), []);

  useEffect(() => {
    const measure = () => {
      anchors.current = stops.map((stop) => {
        const element = document.querySelector(`[data-stop="${stop.id}"]`);
        return element ? element.getBoundingClientRect().top + window.scrollY : 0;
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    const onPointer = (event: PointerEvent) => {
      pointer.current = { x: event.clientX / window.innerWidth - 0.5, y: event.clientY / window.innerHeight - 0.5 };
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  // Phones show the sculpture above the label, so the scene sits higher.
  useEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    if (phone) perspective.setViewOffset(size.width, size.height, 0, size.height * 0.22, size.width, size.height);
    else perspective.clearViewOffset();
  }, [camera, phone, size]);

  useFrame((_, delta) => {
    // Three.js ignores a material's envMapIntensity for scene.environment, so
    // the studio lighting belongs to the metal alone. Glass and walls stay clean.
    if (scene.environment && !material.envMap) {
      material.envMap = scene.environment;
      material.needsUpdate = true;
      scene.environment = null;
    }

    const goal = walkPosition(window.scrollY, anchors.current, window.innerHeight);
    position.current = THREE.MathUtils.damp(position.current, goal, 5, delta);
    liquidTime.value += Math.min(delta, 0.05);

    const z = -position.current * STOP_SPACING + CAMERA_DISTANCE + (phone ? PHONE_DISTANCE : 0);
    camera.position.set(
      THREE.MathUtils.damp(camera.position.x, pointer.current.x * 0.55, 3, delta),
      THREE.MathUtils.damp(camera.position.y, 2.75 - pointer.current.y * 0.3, 3, delta),
      z,
    );
    camera.lookAt(camera.position.x * 0.4, 2.75, z - 8);

    const index = Math.round(position.current);
    material.color.lerp(tints[index] ?? white, 1 - Math.exp(-3 * delta));
    const x = caseX.current[index] ?? 0;
    if (light.current) {
      light.current.position.set(x * 0.8, 7.4, stopZ(index) + 3);
      target.position.set(x, 1.6, stopZ(index));
    }
  });

  return (
    <>
      {portal}
      <PerformanceMonitor
        bounds={() => [22, 55]}
        flipflops={Infinity}
        onDecline={() =>
          setShed((level) => {
            if (level === 1) setDpr(1);
            if (level >= 3) onFallback();
            return level + 1;
          })
        }
      />
      <ambientLight intensity={0.5} />
      <primitive object={target} />
      <spotLight ref={light} target={target} intensity={70} angle={0.62} penumbra={0.9} distance={18} color="#ffffff" />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#171925"]} />
        <Lightformer form="rect" intensity={6} color="#ffffff" position={[0, 3.2, 8]} scale={[16, 3.4, 1]} />
        <Lightformer form="rect" intensity={7} color="#ffffff" position={[0, 7, 1]} scale={[16, 7, 1]} rotation={[Math.PI / 2, 0, 0]} />
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[-7, 1, 3]} scale={[6, 10, 1]} rotation={[0, Math.PI / 2, 0]} />
        <Lightformer form="rect" intensity={4} color="#ffffff" position={[7, 2, 3]} scale={[5, 10, 1]} rotation={[0, -Math.PI / 2, 0]} />
        <Lightformer form="rect" intensity={2} color="#ffffff" position={[0, -6, 3]} scale={[16, 6, 1]} rotation={[-Math.PI / 2, 0, 0]} />
      </Environment>
      <Walls wallLight={texture} position={position} />
      {stops.map((stop, index) => (
        <Case key={stop.id} index={index} full={full && glass} phone={phone} position={position} material={material} sheen={sheen} caseX={caseX} />
      ))}
    </>
  );
}

export default function GalleryCanvas({ tier, onFallback, onReady }: { tier: Tier; onFallback: () => void; onReady: () => void }) {
  return (
    <Canvas
      camera={{ fov: CAMERA_FOV, position: [0, 2.75, CAMERA_DISTANCE], near: 0.1, far: 120 }}
      dpr={tier === "full" ? [1, 1.75] : [1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={onReady}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={[roomColors.ultramarine]} />
      <Suspense fallback={null}>
        <Scene tier={tier} onFallback={onFallback} />
      </Suspense>
    </Canvas>
  );
}
