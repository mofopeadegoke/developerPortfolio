"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor, useFBO } from "@react-three/drei";
import { ShaderGradient } from "@shadergradient/react";
import * as THREE from "three";
import { CAMERA_DISTANCE, CAMERA_FOV, formLayout, stops, textBand, walkPosition, type Stop } from "@/lib/gallery";
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
        <meshBasicMaterial map={target.texture} color="#262626" toneMapped={false} />
      </mesh>
    </>
  );
}

type FormProps = { tunnel: boolean; onTunnelEnd: () => void; onFallback: () => void; onReady: () => void };

const SIDE = 300;

// Letters hold still enough to read, and stars hold still entirely.
const restMotion = (stop: Stop) => (stop.form === "rest" ? 0 : stop.form === "name" ? 0.005 : 0.008);
// How far the nearest stars slide per screen scrolled, in the dust's own units.
const DRIFT = 0.12;

// How strongly fast scrolling stretches the points into streaks; 1 is the original strength.
const STREAK = 0.25;

// How long the form takes to catch up with the scroll, in seconds.
const FOLLOW_TIME = 0.05;

/**
 * A critically damped spring towards the goal. Unlike an exponential chase it
 * carries velocity, so it eases in and out and settles without a long crawl.
 */
function follow(current: number, goal: number, velocity: { current: number }, delta: number) {
  const dt = Math.min(delta, 0.1);
  const omega = 2 / FOLLOW_TIME;
  const x = omega * dt;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = current - goal;
  const temp = (velocity.current + omega * change) * dt;
  velocity.current = (velocity.current - omega * temp) * decay;
  let next = goal + (change + temp) * decay;
  // Never overshoot, so a number never swings past its stop and back.
  if (goal - current > 0 === next > goal) {
    next = goal;
    velocity.current = 0;
  }
  if (Math.abs(next - goal) < 1e-4 && Math.abs(velocity.current) < 1e-3) {
    velocity.current = 0;
    return goal;
  }
  return next;
}

function Form({ tunnel, onTunnelEnd, onFallback, onReady }: FormProps) {
  const side = SIDE;
  const size = useThree((state) => state.size);
  const setDpr = useThree((state) => state.setDpr);
  const { material, glow, depth } = useMemo(() => createFormMaterial(side), [side]);
  const [ready, setReady] = useState(false);
  const [shed, setShed] = useState(0);

  const points = useRef<THREE.Group>(null);
  const anchors = useRef<number[]>([]);
  const lastScroll = useRef(0);
  const velocity = useRef(0);
  const position = useRef(0);
  const positionVelocity = useRef(0);
  const burst = useRef(0);
  const pointerGoal = useRef(new THREE.Vector3(99, 99, 0));
  const tilt = useRef({ x: 0, y: 0 });
  const tunnelGoal = useRef(false);
  const tunnelAmount = useRef(0);

  useEffect(() => {
    tunnelGoal.current = tunnel;
  }, [tunnel]);

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
    const textures: THREE.DataArrayTexture[] = [];
    const makeTexture = (data: Float32Array) => {
      const texture = new THREE.DataArrayTexture(data, side, side, stops.length);
      texture.format = THREE.RGBAFormat;
      texture.type = THREE.FloatType;
      texture.minFilter = texture.magFilter = THREE.NearestFilter;
      texture.needsUpdate = true;
      textures.push(texture);
      return texture;
    };
    buildShapes(side, (data, normals) => {
      if (cancelled) return;
      material.uniforms.uShapes.value = makeTexture(data);
      material.uniforms.uNormals.value = makeTexture(normals);
      setReady(true);
      // Only now can the name stand in for the page heading.
      onReady();
    }).then(() => {
      if (!cancelled) for (const texture of textures) texture.needsUpdate = true;
    });
    return () => {
      cancelled = true;
      for (const texture of textures) texture.dispose();
    };
  }, [material, onReady, side]);

  useEffect(() => {
    const measure = () => {
      // A shape is complete when its section's words sit in the middle of the
      // screen, or, for words taller than the screen, as the section arrives
      // under the navigation bar, where its link scrolls to. Never past the
      // ends of the page and always in page order.
      const viewport = window.innerHeight;
      const end = Math.max(0, document.documentElement.scrollHeight - viewport);
      const navigation = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      let previous = 0;
      anchors.current = stops.map((stop) => {
        const section = document.querySelector(`[data-stop="${stop.id}"]`);
        if (!section) return previous;
        const box = (section.querySelector(".plate") ?? section).getBoundingClientRect();
        const middle = box.top + box.height / 2 + window.scrollY - viewport / 2;
        const arrival = section.getBoundingClientRect().top + window.scrollY - navigation;
        previous = Math.max(previous, Math.min(end, middle, arrival));
        return previous;
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);

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
      window.removeEventListener("resize", measure);
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
    position.current = follow(position.current, goal, positionVelocity, delta);
    const from = Math.min(Math.floor(position.current), stops.length - 1);
    const to = Math.min(from + 1, stops.length - 1);
    const mix = position.current - from;
    uniforms.uFrom.value = from;
    uniforms.uTo.value = to;
    uniforms.uMix.value = mix;
    uniforms.uTime.value += Math.min(delta, 0.05);
    uniforms.uRest.value = THREE.MathUtils.lerp(restMotion(stops[from]), restMotion(stops[to]), mix);
    uniforms.uDrift.value = (scroll / viewport) * DRIFT;
    // Stars dim where the words are.
    const bandFrom = textBand(stops[from], size.width);
    const bandTo = textBand(stops[to], size.width);
    uniforms.uTextMin.value = THREE.MathUtils.lerp(bandFrom.min, bandTo.min, mix);
    uniforms.uTextMax.value = THREE.MathUtils.lerp(bandFrom.max, bandTo.max, mix);

    // Point sizes are in drawing pixels, so they follow the live pixel ratio.
    const ratio = state.gl.getPixelRatio();
    uniforms.uSize.value = 21 * ratio;
    uniforms.uMaxSize.value = 8 * ratio;
    glow.uniforms.uSize.value = 147 * ratio;
    glow.uniforms.uMaxSize.value = 40 * ratio;
    depth.uniforms.uSize.value = 50 * ratio;
    depth.uniforms.uMaxSize.value = 18 * ratio;

    const wormhole = stops.findIndex((stop) => stop.id === "wormhole");
    // The tunnel only ever runs on request, and ends when the visitor leaves.
    const atWormhole = Math.abs(position.current - wormhole) < 0.6;
    if (tunnelGoal.current && !atWormhole) {
      tunnelGoal.current = false;
      onTunnelEnd();
    }
    tunnelAmount.current = THREE.MathUtils.damp(tunnelAmount.current, tunnelGoal.current ? 1 : 0, 2.5, delta);
    uniforms.uTunnel.value = tunnelAmount.current < 0.002 ? 0 : tunnelAmount.current;
    uniforms.uTunnelX.value = formLayout(stops[wormhole], size.width, size.height).x;
    uniforms.uClear.value = uniforms.uTunnel.value;
    // The tunnel spreads the same particles over the whole screen.
    uniforms.uBoost.value = 1 + uniforms.uTunnel.value * 1.5;

    const a = formLayout(stops[from], size.width, size.height);
    const b = formLayout(stops[to], size.width, size.height);
    form.position.set(THREE.MathUtils.lerp(a.x, b.x, mix), THREE.MathUtils.lerp(a.y, b.y, mix), 0);
    form.scale.setScalar(THREE.MathUtils.lerp(a.scale, b.scale, mix));
    // A slow sway and the pointer turn the form, never so far a number misreads.
    // Stars never sway, so the sky holds still.
    const starry = THREE.MathUtils.lerp(stops[from].form === "rest" ? 1 : 0, stops[to].form === "rest" ? 1 : 0, mix);
    const sway = THREE.MathUtils.lerp(0.06, 0.16, THREE.MathUtils.smoothstep(position.current, 0, 1)) * (1 - starry);
    form.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * sway + tilt.current.x * 0.35;
    form.rotation.x = tilt.current.y * 0.22;

    const speed = (scroll - lastScroll.current) / Math.max(delta, 0.008) / 3000;
    lastScroll.current = scroll;
    velocity.current = THREE.MathUtils.damp(velocity.current, THREE.MathUtils.clamp(speed, -1, 1), 7, delta);
    uniforms.uVelocity.value = velocity.current * STREAK;

    burst.current = THREE.MathUtils.damp(burst.current, 0, 2.6, delta);
    uniforms.uBurst.value = burst.current;
    uniforms.uPointer.value.lerp(pointerGoal.current, 1 - Math.exp(-9 * delta));

    // The form only reaches the words while it travels, so it steps back then.
    // Stars dim themselves where they lie behind the words.
    const dim = 1 - Math.sin(Math.PI * mix) * 0.62;
    uniforms.uDim.value = THREE.MathUtils.damp(uniforms.uDim.value, dim, 6, delta);
  });

  return (
    <>
      <Backdrop enabled={shed < 2} />
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
          <points geometry={geometry} material={depth} frustumCulled={false} renderOrder={-1} />
          <points geometry={glowGeometry} material={glow} frustumCulled={false} />
          <points geometry={geometry} material={material} frustumCulled={false} />
        </group>
      )}
    </>
  );
}

export default function GalleryCanvas(props: FormProps) {
  return (
    <Canvas
      camera={{ fov: CAMERA_FOV, position: [0, 0, CAMERA_DISTANCE], near: 0.1, far: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={[GROUND]} />
      <Form {...props} />
    </Canvas>
  );
}
