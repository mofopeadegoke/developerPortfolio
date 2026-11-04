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
  uniform float uDrift, uTextMin, uTextMax, uHalo;
  uniform vec3 uPointer, uOrigin;
  attribute float aSeed;
  varying float vShade;
  varying float vHeat;
  varying float vFade;
  varying float vStar;
  varying float vGlint;
  varying float vCore;

  // About one point in 45 stays lit as a star; the rest fade out between numbers.
  const float STARS = 0.022;

  vec2 liquidFlow(vec3 p, float t) {
    vec2 v = p.xy * 1.15 + p.z * 0.6;
    for (float i = 1.0; i < 5.0; i++) {
      v += cos(v.yx * i + vec2(0.0, i) + t) / i;
    }
    return sin(v);
  }

  const float REST[${stops.length}] = float[${stops.length}](${restList});

  // Returns where a particle is right now. Stars never wander: they sit at
  // different depths, so scrolling slides near stars further than far ones,
  // wrapping round off screen. Letters hold still enough to read.
  vec3 behave(vec3 p, float shape) {
    if (REST[int(shape)] > 0.5) {
      float near = clamp((-p.z - 0.4) / 1.6, 0.0, 1.0);
      p.y = mod(p.y + uDrift * mix(1.0, 0.3, near) + 1.15, 2.3) - 1.15;
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

    // How much of a star this point is: it turns silver gradually as it pours
    // out of a number, and back to copper as it pours into the next. In the
    // tunnel every point is a star streak.
    float rest = mix(REST[int(uFrom)], REST[int(uTo)], t);
    float lit = step(fract(aSeed * 137.13), STARS);
    float star = max(rest * mix(1.0, lit, 1.0 - uTunnel), uTunnel);
    fade *= mix(1.0, lit, rest * (1.0 - uTunnel));

    vec4 view = viewMatrix * world;
    // The depth pass sits just behind the surface, so the front of a model
    // hides what is behind it without hiding itself.
    view.z -= uPre * 0.14;
    gl_Position = projectionMatrix * view;
    gl_PointSize = clamp(uSize * uBoost * (0.6 + aSeed * 0.8) / max(-view.z, 0.5), uSize * 0.055, uMaxSize);

    // Each star pulses at its own pace, every two to five seconds. The
    // brightest few flash a cross as they peak, but never behind the words.
    float ndcX = gl_Position.x / gl_Position.w;
    float behindText = smoothstep(uTextMin - 0.04, uTextMin + 0.04, ndcX) * (1.0 - smoothstep(uTextMax - 0.04, uTextMax + 0.04, ndcX));
    float pace = 1.26 + fract(aSeed * 53.7) * 1.88;
    float pulse = 0.5 + 0.5 * sin(uTime * pace + aSeed * 628.0);
    // A star that can glint always draws on a larger sprite, so its core keeps
    // the same size while only the arms fade in and out.
    float glinter = step(0.96, fract(aSeed * 311.9)) * (1.0 - uTunnel);
    float pixel = uSize / 21.0;
    float body = pixel * (1.6 + fract(aSeed * 71.3) * 1.8);
    float sprite = body + glinter * pixel * 16.0;
    gl_PointSize = mix(gl_PointSize, sprite, star * (1.0 - uTunnel));
    vStar = star;
    vGlint = glinter * smoothstep(0.82, 1.0, pulse) * (1.0 - behindText) * star;
    vCore = 0.5 * body / sprite;

    // The tunnel fills the screen, so it stays clear of the words' side.
    float clear = uClear * smoothstep(-0.05, 0.25, gl_Position.x / gl_Position.w);
    vFade = fade * (1.0 - clear * 0.88);
    vShade = fract(mix(a.w, b.w, step(0.5, t))) / 0.99;
    // Stars glow without the warm halo pass, and dim behind the words.
    float twinkle = mix(1.0, 0.35 + 0.65 * pulse, 1.0 - uTunnel);
    vFade *= mix(1.0, twinkle * mix(1.0, 0.35, behindText) * (1.0 - uHalo * (1.0 - uTunnel)), star);

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
    if (uPre > 0.5 && (solid < 0.6 || star > 0.01)) vFade = 0.0;
    vHeat = clamp(max(heat, travel * 0.55) + reach * 0.9 + uBurst * 0.5, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uDim, uAlpha, uBoost, uPre;
  varying float vShade;
  varying float vHeat;
  varying float vFade;
  varying float vStar;
  varying float vGlint;
  varying float vCore;

  // Silver, warmed slightly so it sits on the warm ground: #dfe3ea.
  const vec3 SILVER = vec3(0.875, 0.89, 0.918);

  void main() {
    vec2 q = gl_PointCoord - 0.5;
    float d = length(q);
    if (d > 0.5 || vFade < (uPre > 0.5 ? 0.5 : 0.01)) discard;
    float soft = smoothstep(0.5, 0.08, d);
    float shade = max(vShade, vHeat * 0.8);
    vec3 colour = mix(vec3(0.5, 0.13, 0.04), vec3(1.0, 0.52, 0.2), shade);
    colour = mix(colour, vec3(1.0, 0.86, 0.62), shade * shade * shade * 0.75 + vHeat * 0.35);
    float alpha = soft * (0.16 + 0.84 * shade + vHeat * 0.25);

    // A star is a soft core; a glinting one adds four thin arms that taper to
    // the edge of its larger sprite.
    float core = smoothstep(vCore, vCore * 0.16, d);
    float arms = (exp(-abs(q.y) * 32.0) + exp(-abs(q.x) * 32.0)) * (1.0 - d * 2.0) * vGlint;
    float starAlpha = min(1.0, core * 0.9 + arms);
    colour = mix(colour, SILVER, vStar);
    alpha = mix(alpha, starAlpha, vStar);
    gl_FragColor = vec4(colour, alpha * uDim * uAlpha * uBoost * vFade);
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
      uDrift: { value: 0 },
      uTextMin: { value: 2 },
      uTextMax: { value: 2 },
      uHalo: { value: 0 },
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
    uHalo: { value: 1 },
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
