"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor, useFBO } from "@react-three/drei";
import { ShaderGradient } from "@shadergradient/react";
import * as THREE from "three";
import { CAMERA_DISTANCE, CAMERA_FOV, formLayout, stops, walkPosition, type Tier } from "@/lib/gallery";
import { buildShapes } from "@/components/gallery/form-shapes";
import { createFormMaterial } from "@/components/gallery/form-material";

// ShaderGradient's shaders include chunks that newer Three.js removed. None of
// them affect its output, so they resolve to nothing.
const chunks = THREE.ShaderChunk as Record<string, string>;
for (const name of ["uv2_pars_vertex", "uv2_pars_fragment", "uv2_vertex", "encodings_fragment", "transmissionmap_fragment", "transmissionmap_pars_fragment", "cube_uv_reflection_fragment"]) {
  chunks[name] ??= "";
}

const GROUND = "#0b0807";

/** A slow copper glow behind the form, rendered off-screen by ShaderGradient. */
function Backdrop({ enabled }: { enabled: boolean }) {
  const target = useFBO(384, 384, { depthBuffer: true });
  const scene = useMemo(() => new THREE.Scene(), []);
  const camera = useMemo(() => new THREE.PerspectiveCamera(45, 1, 0.1, 100), []);
  const { gl } = useThree();
  const tick = useRef(0);

  useFrame(() => {
    tick.current += 1;
    if (!enabled || tick.current % 3 !== 0) return;
    const current = gl.getRenderTarget();
    gl.setRenderTarget(target);
    gl.render(scene, camera);
    gl.setRenderTarget(current);
  });

  if (!enabled) return null;
  return (
    <>
      {createPortal(
        <ShaderGradient
          control="props"
          type="plane"
          animate="on"
          uSpeed={0.12}
          uStrength={2.2}
          uDensity={1.1}
          uFrequency={4.5}
          color1="#0b0807"
          color2="#4a1a0a"
          color3="#1a0c07"
          lightType="3d"
          brightness={1.1}
          cDistance={3.4}
          cAzimuthAngle={180}
          cPolarAngle={90}
          grain="off"
        />,
        scene,
        { camera },
      )}
      <mesh position={[0, 0, -7]}>
        <planeGeometry args={[34, 20]} />
        <meshBasicMaterial map={target.texture} color="#3a3a3a" toneMapped={false} />
      </mesh>
    </>
  );
}

function Form({ tier, onFallback }: { tier: Tier; onFallback: () => void }) {
  const phone = tier === "phone";
  const side = phone ? 170 : 300;
  const size = useThree((state) => state.size);
  const setDpr = useThree((state) => state.setDpr);
  const { material, glow } = useMemo(() => createFormMaterial(side, Math.min(window.devicePixelRatio, 1.5)), [side]);
  const [ready, setReady] = useState(false);
  const [shed, setShed] = useState(0);

  const points = useRef<THREE.Group>(null);
  const anchors = useRef<number[]>([]);
  const position = useRef(0);
  const lastScroll = useRef(0);
  const velocity = useRef(0);
  const burst = useRef(0);
  const pointerGoal = useRef(new THREE.Vector3(99, 99, 0));
  const tilt = useRef({ x: 0, y: 0 });

  const geometry = useMemo(() => {
    const count = side * side;
    const built = new THREE.BufferGeometry();
    built.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) seeds[i] = Math.random();
    built.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return built;
  }, [side]);

  const glowGeometry = useMemo(() => {
    const built = new THREE.BufferGeometry();
    built.setAttribute("position", geometry.attributes.position);
    built.setAttribute("aSeed", geometry.attributes.aSeed);
    built.setDrawRange(0, Math.floor((side * side) / 6));
    return built;
  }, [geometry, side]);

  useEffect(() => {
    let cancelled = false;
    let texture: THREE.DataArrayTexture | null = null;
    buildShapes(side, phone, (data) => {
      if (cancelled) return;
      texture = new THREE.DataArrayTexture(data, side, side, stops.length);
      texture.format = THREE.RGBAFormat;
      texture.type = THREE.FloatType;
      texture.minFilter = texture.magFilter = THREE.NearestFilter;
      texture.needsUpdate = true;
      material.uniforms.uShapes.value = texture;
      setReady(true);
    }).then(() => {
      if (!cancelled && texture) texture.needsUpdate = true;
    });
    return () => {
      cancelled = true;
      texture?.dispose();
    };
  }, [material, phone, side]);

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

    const toWorld = (clientX: number, clientY: number, out: THREE.Vector3) => {
      const height = 2 * Math.tan((CAMERA_FOV / 2) * (Math.PI / 180)) * CAMERA_DISTANCE;
      out.set((clientX / window.innerWidth - 0.5) * height * (window.innerWidth / window.innerHeight), (0.5 - clientY / window.innerHeight) * height, 0);
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "mouse") toWorld(event.clientX, event.clientY, pointerGoal.current);
      tilt.current = { x: event.clientX / window.innerWidth - 0.5, y: event.clientY / window.innerHeight - 0.5 };
    };
    // A click or tap on empty space throws the form apart. Text and links keep
    // their normal behaviour, so selecting words never sets it off.
    const onClick = (event: MouseEvent) => {
      if ((event.target as Element).closest("a, button, h1, h2, h3, p, li, td, th")) return;
      toWorld(event.clientX, event.clientY, material.uniforms.uOrigin.value);
      burst.current = 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("click", onClick);
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("click", onClick);
    };
  }, [material]);

  useFrame((state, delta) => {
    const form = points.current;
    if (!form) return;
    const uniforms = material.uniforms;
    const scroll = window.scrollY;
    const viewport = window.innerHeight;

    const goal = walkPosition(scroll, anchors.current, viewport);
    position.current = THREE.MathUtils.damp(position.current, goal, 5, delta);
    const from = Math.min(Math.floor(position.current), stops.length - 1);
    const to = Math.min(from + 1, stops.length - 1);
    const mix = position.current - from;
    uniforms.uFrom.value = from;
    uniforms.uTo.value = to;
    uniforms.uMix.value = mix;
    uniforms.uTime.value += Math.min(delta, 0.05);

    const a = formLayout(stops[from], size.width, size.height, phone);
    const b = formLayout(stops[to], size.width, size.height, phone);
    form.position.set(THREE.MathUtils.lerp(a.x, b.x, mix), THREE.MathUtils.lerp(a.y, b.y, mix), 0);
    form.scale.setScalar(THREE.MathUtils.lerp(a.scale, b.scale, mix));
    const sway = THREE.MathUtils.lerp(0.06, 0.3, THREE.MathUtils.smoothstep(position.current, 0, 1));
    form.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * sway + tilt.current.x * 0.5;
    form.rotation.x = tilt.current.y * 0.3;

    const speed = (scroll - lastScroll.current) / Math.max(delta, 0.008) / 3000;
    lastScroll.current = scroll;
    velocity.current = THREE.MathUtils.damp(velocity.current, THREE.MathUtils.clamp(speed, -1, 1), 7, delta);
    uniforms.uVelocity.value = velocity.current;

    burst.current = THREE.MathUtils.damp(burst.current, 0, 2.6, delta);
    uniforms.uBurst.value = burst.current;
    uniforms.uPointer.value.lerp(pointerGoal.current, 1 - Math.exp(-9 * delta));

    // Words must stay readable. On phones they scroll across the form, so it
    // steps back from just after a section starts until just before the next.
    // On desktop the form only reaches the words while it travels.
    let dim = 1 - Math.sin(Math.PI * mix) * 0.8;
    if (phone) {
      const list = anchors.current;
      let current = 0;
      while (current < list.length - 1 && scroll >= list[current + 1] - viewport * 0.05) current++;
      dim = scroll > list[current] + viewport * 0.14 ? 0.16 : 1;
    }
    uniforms.uDim.value = THREE.MathUtils.damp(uniforms.uDim.value, dim, 6, delta);
  });

  return (
    <>
      <Backdrop enabled={tier === "full" && shed < 2} />
      <PerformanceMonitor
        bounds={() => [22, 55]}
        flipflops={Infinity}
        onDecline={() =>
          setShed((level) => {
            if (level === 0) setDpr(1);
            if (level >= 2) onFallback();
            return level + 1;
          })
        }
      />
      {ready && (
        <group ref={points}>
          <points geometry={glowGeometry} material={glow} frustumCulled={false} />
          <points geometry={geometry} material={material} frustumCulled={false} />
        </group>
      )}
    </>
  );
}

export default function GalleryCanvas({ tier, onFallback, onReady }: { tier: Tier; onFallback: () => void; onReady: () => void }) {
  return (
    <Canvas
      camera={{ fov: CAMERA_FOV, position: [0, 0, CAMERA_DISTANCE], near: 0.1, far: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      onCreated={onReady}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={[GROUND]} />
      <Form tier={tier} onFallback={onFallback} />
    </Canvas>
  );
}
