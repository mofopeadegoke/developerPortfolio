import * as THREE from "three";
import { stops } from "@/lib/gallery";

// The flow loop is adapted from github.com/collidingScopes/liquid-logo (MIT, see
// THIRD_PARTY_NOTICES.md): there it colours a 2D logo; here it carries particles
// between shapes, so the form moves like liquid metal.

const restList = stops.map((stop) => (stop.form === "rest" ? "1.0" : "0.0")).join(", ");

const vertexShader = /* glsl */ `
  uniform highp sampler2DArray uShapes;
  uniform highp sampler2DArray uNormals;
  uniform float uPre;
  uniform float uFrom, uTo, uMix, uTime, uBurst, uVelocity, uSize, uMaxSize, uSide, uRest, uBoost;
  uniform float uTunnel, uTunnelX, uTunnelScale, uClear;
  uniform vec3 uPointer, uOrigin;
  attribute float aSeed;
  varying float vShade;
  varying float vHeat;
  varying float vFade;

  vec2 liquidFlow(vec3 p, float t) {
    vec2 v = p.xy * 1.15 + p.z * 0.6;
    for (float i = 1.0; i < 5.0; i++) {
      v += cos(v.yx * i + vec2(0.0, i) + t) / i;
    }
    return sin(v);
  }

  const float REST[${stops.length}] = float[${stops.length}](${restList});

  // Returns where a particle is right now. Only dust moves on its own: it
  // wanders slowly, like embers settling, so the next number has something to
  // rise out of. Letters hold still enough to read.
  vec3 behave(vec3 p, float shape) {
    if (REST[int(shape)] > 0.5) {
      p.x += sin(uTime * 0.11 + aSeed * 23.0) * 0.12;
      p.y += sin(uTime * 0.09 + aSeed * 41.0) * 0.1 + sin(uTime * 0.05 + p.x * 1.3) * 0.05;
    }
    return p;
  }

  // The surface direction after a model's motion, found by moving a second
  // point just off the surface. Zero means a light or spark, which has none.
  vec3 turned(vec3 start, vec3 moved, vec3 normal, float shape) {
    if (dot(normal, normal) < 0.1) return vec3(0.0);
    return behave(start + normal * 0.02, shape) - moved;
  }

  void main() {
    int side = int(uSide);
    ivec2 cell = ivec2(gl_VertexID % side, gl_VertexID / side);
    vec4 a = texelFetch(uShapes, ivec3(cell, int(uFrom)), 0);
    vec4 b = texelFetch(uShapes, ivec3(cell, int(uTo)), 0);

    // Particles leave at different moments, so shapes pour rather than fade.
    float t = smoothstep(0.0, 1.0, clamp(uMix * 1.7 - aSeed * 0.7, 0.0, 1.0));
    float travel = sin(3.14159 * t);

    float heat = 0.0;
    float fade = 1.0;
    vec3 fromPoint = behave(a.xyz, uFrom);
    vec3 toPoint = behave(b.xyz, uTo);
    vec3 p = mix(fromPoint, toPoint, t);
    vec3 surface = mix(
      turned(a.xyz, fromPoint, texelFetch(uNormals, ivec3(cell, int(uFrom)), 0).xyz, uFrom),
      turned(b.xyz, toPoint, texelFetch(uNormals, ivec3(cell, int(uTo)), 0).xyz, uTo),
      t
    );

    vec2 f = liquidFlow(p * 1.2 + aSeed, uTime * 0.35);
    vec2 g = liquidFlow(p.zxy * 1.2 - aSeed, uTime * 0.3);
    // At rest the surface creeps like molten metal. In transit the form draws
    // in and swirls round its axis, so shapes pour instead of scattering.
    p += vec3(f.x, g.y, f.y * g.x) * (uRest + travel * 0.32);
    float swirl = travel * (1.3 + aSeed * 1.8);
    p.xz = mat2(cos(swirl), -sin(swirl), sin(swirl), cos(swirl)) * p.xz;
    p.xy *= 1.0 - travel * 0.5;

    vec4 world = modelMatrix * vec4(p, 1.0);

    // Wormhole: the particles open into a tunnel that flies past the viewer.
    if (uTunnel > 0.001) {
      float run = fract(aSeed * 7.3 + uTime * 0.14);
      float angle = aSeed * 6283.0;
      float radius = (1.5 + fract(aSeed * 91.7) * 1.1 + sin(run * 9.0 + uTime * 0.4) * 0.2) * uTunnelScale;
      vec3 tunnel = vec3(cos(angle) * radius, sin(angle) * radius, 9.0 - run * 36.0);
      tunnel.x += uTunnelX * smoothstep(0.1, 0.9, run);
      tunnel.xy += vec2(sin(run * 5.0 + uTime * 0.2), cos(run * 4.0 - uTime * 0.15)) * run * 1.8 * uTunnelScale;
      world.xyz = mix(world.xyz, tunnel, uTunnel);
      fade = mix(fade, smoothstep(9.0, 5.0, tunnel.z), uTunnel);
      heat = max(heat, uTunnel * (0.35 + run * 0.65));
    }

    // Parts around the cursor like a finger through liquid.
    vec2 away = world.xy - uPointer.xy;
    float reach = exp(-dot(away, away) * 1.5) * (1.0 - uTunnel);
    world.xy += normalize(away + 0.0001) * reach * 0.75;
    world.z += reach * 0.7 * (aSeed - 0.3);

    // A click throws the form apart from where it landed.
    vec3 thrown = normalize(world.xyz - uOrigin + vec3(f, 0.2));
    world.xyz += thrown * uBurst * (0.5 + aSeed * 3.2);

    // Fast scrolling stretches it into streaks.
    world.y += uVelocity * (aSeed - 0.5) * 3.0;

    vec4 view = viewMatrix * world;
    // The depth pass sits just behind the surface, so the front of a model
    // hides what is behind it without hiding itself.
    view.z -= uPre * 0.14;
    gl_Position = projectionMatrix * view;
    gl_PointSize = clamp(uSize * uBoost * (0.6 + aSeed * 0.8) / max(-view.z, 0.5), uSize * 0.055, uMaxSize);

    // The tunnel fills the screen, so it stays clear of the words' side.
    float clear = uClear * smoothstep(-0.05, 0.25, gl_Position.x / gl_Position.w);
    vFade = fade * (1.0 - clear * 0.88);
    vShade = fract(mix(a.w, b.w, step(0.5, t))) / 0.99;

    // Light the model live, and fade the side turned away from the viewer.
    float solid = (1.0 - travel) * (1.0 - uTunnel);
    if (dot(surface, surface) > 0.0001 && solid > 0.01) {
      vec3 n = normalize(mat3(modelMatrix) * surface);
      vec3 toEye = normalize(cameraPosition - world.xyz);
      vec3 toLight = normalize(vec3(0.45, 0.75, 0.55));
      float diffuse = max(dot(n, toLight), 0.0);
      float gleam = pow(max(dot(n, normalize(toLight + toEye)), 0.0), 26.0);
      vShade = mix(vShade, 0.34 + 0.6 * diffuse + 0.5 * gleam, solid);
      vFade *= mix(1.0, smoothstep(-0.12, 0.12, dot(n, toEye)), solid);
    }
    // Loose dust should never block anything.
    if (uPre > 0.5 && solid < 0.6) vFade = 0.0;
    vHeat = clamp(max(heat, travel * 0.55) + reach * 0.9 + uBurst * 0.5, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uDim, uAlpha, uBoost, uPre;
  varying float vShade;
  varying float vHeat;
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5 || vFade < (uPre > 0.5 ? 0.5 : 0.01)) discard;
    float soft = smoothstep(0.5, 0.08, d);
    float shade = max(vShade, vHeat * 0.8);
    vec3 colour = mix(vec3(0.5, 0.13, 0.04), vec3(1.0, 0.52, 0.2), shade);
    colour = mix(colour, vec3(1.0, 0.86, 0.62), shade * shade * shade * 0.75 + vHeat * 0.35);
    gl_FragColor = vec4(colour, soft * (0.16 + 0.84 * shade + vHeat * 0.25) * uDim * uAlpha * uBoost * vFade);
  }
`;

export function createFormMaterial(side: number) {
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uShapes: { value: null },
      uNormals: { value: null },
      uPre: { value: 0 },
      uFrom: { value: 0 },
      uTo: { value: 0 },
      uMix: { value: 0 },
      uTime: { value: 0 },
      uBurst: { value: 0 },
      uVelocity: { value: 0 },
      uDim: { value: 1 },
      uAlpha: { value: 1 },
      uRest: { value: 0.03 },
      uBoost: { value: 1 },
      uTunnel: { value: 0 },
      uTunnelX: { value: 0 },
      uTunnelScale: { value: 1 },
      uClear: { value: 0 },
      uSide: { value: side },
      uSize: { value: 21 },
      uMaxSize: { value: 8 },
      uPointer: { value: new THREE.Vector3(99, 99, 0) },
      uOrigin: { value: new THREE.Vector3() },
    },
  });

  // Larger, fainter points over the same paths stand in for a bloom pass, at a
  // fraction of the cost. Every uniform but size and alpha stays shared.
  const glow = material.clone();
  glow.uniforms = {
    ...material.uniforms,
    uAlpha: { value: 0.07 },
    uSize: { value: 147 },
    uMaxSize: { value: 40 },
  };

  // Drawn first and invisibly: fills the depth buffer so models read as solid.
  const depth = material.clone();
  depth.uniforms = { ...material.uniforms, uPre: { value: 1 }, uSize: { value: 50 }, uMaxSize: { value: 18 } };
  depth.transparent = false;
  depth.blending = THREE.NoBlending;
  depth.colorWrite = false;
  depth.depthWrite = true;

  return { material, glow, depth };
}
