import * as THREE from "three";
import { GEARS } from "@/components/gallery/form-shapes";

// The flow loop is adapted from github.com/collidingScopes/liquid-logo (MIT, see
// THIRD_PARTY_NOTICES.md): there it colours a 2D logo; here it carries particles
// between shapes, so the form moves like liquid metal.

const glsl = (value: number) => value.toFixed(5);

const gearBranches = GEARS.centres
  .map(
    (centre, i) => `if (group < ${i}.5) {
        vec2 c = vec2(${glsl(centre.x)}, ${glsl(centre.y)});
        p.xy = c + rot(p.xy - c, uTurn * ${glsl(GEARS.speeds[i])});
        return p;
      }`,
  )
  .join("\n      ");

const vertexShader = /* glsl */ `
  uniform highp sampler2DArray uShapes;
  uniform float uFrom, uTo, uMix, uTime, uBurst, uVelocity, uSize, uMaxSize, uSide, uRest, uBoost;
  uniform float uTurn, uTunnel, uTunnelX, uTunnelScale, uClear;
  uniform vec3 uPointer, uOrigin;
  attribute float aSeed;
  varying float vShade;
  varying float vHeat;
  varying float vFade;

  vec2 rot(vec2 v, float a) {
    float c = cos(a), s = sin(a);
    return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
  }

  vec2 liquidFlow(vec3 p, float t) {
    vec2 v = p.xy * 1.15 + p.z * 0.6;
    for (float i = 1.0; i < 5.0; i++) {
      v += cos(v.yx * i + vec2(0.0, i) + t) / i;
    }
    return sin(v);
  }

  // Must match inkPoint in form-shapes.ts.
  vec2 inkPoint(float u) {
    float loops = u * 6.28318 * 7.0;
    return vec2(-1.0 + 1.5 * u - 0.1 * sin(loops), -0.5 + 0.2 * cos(loops) * (0.72 + 0.28 * sin(u * 12.56636)));
  }

  // Each project's own behaviour. Returns where a particle is right now.
  vec3 behave(vec3 p, float shape, float group, inout float heat, inout float fade) {
    // Uncooked: the untrue lines shed embers that rise and die.
    if (shape > 1.5 && shape < 2.5 && group > 0.5 && group < 1.5) {
      float life = fract(uTime * 0.17 + aSeed * 13.0);
      p.y += life * life * 1.8;
      p.x += sin(life * 9.0 + aSeed * 40.0) * 0.16 * life;
      p.z += life * 0.3 * (aSeed - 0.5);
      heat = max(heat, 0.75 - life * 0.45);
      fade *= 1.0 - smoothstep(0.45, 1.0, life);
      return p;
    }
    // Smart Bookmarks: loose links spiral in and vanish into the ribbon.
    if (shape > 2.5 && shape < 3.5 && group > 0.5) {
      float life = fract(uTime * 0.1 + aSeed * 17.0);
      float radius = mix(1.12, 0.12, life * life);
      float angle = aSeed * 400.0 + uTime * 0.45 + (1.0 - life) * 6.0;
      p = vec3(cos(angle) * radius, p.y * (radius / 1.12 + 0.2), sin(angle) * radius * 0.65);
      heat = max(heat, life * 0.8);
      fade *= smoothstep(0.0, 0.2, life) * (1.0 - smoothstep(0.92, 1.0, life));
      return p;
    }
    // Omniplexus: tiles leave the module one by one and build the panel.
    if (shape > 3.5 && shape < 4.5 && group > 0.5) {
      float cycle = clamp(abs(fract(uTime * 0.055) * 2.0 - 1.0) * 1.35, 0.0, 1.0);
      float order = (group - 1.0) / 24.0;
      float grown = smoothstep(order * 0.9, order * 0.9 + 0.1, cycle);
      p = mix(p * vec3(0.12, 0.12, 0.4), p, grown);
      p.z += sin(uTime * 1.1 - order * 7.0) * 0.05 * grown;
      heat = max(heat, (1.0 - abs(grown * 2.0 - 1.0)) * 0.9);
      return p;
    }
    // Inscribe: the pen travels the line and the ink appears behind it.
    if (shape > 4.5 && shape < 5.5) {
      float head = fract(uTime * 0.075) * 1.3;
      vec2 tip = inkPoint(min(head, 1.0));
      if (group < 0.5) {
        p.xy += tip - inkPoint(0.0);
        p.xy += vec2(0.0, 0.06 * smoothstep(1.0, 1.1, head));
        return p;
      }
      float u = (group - 1.0) / 999.0;
      if (u > head) {
        p.xy = tip;
        fade = 0.0;
        return p;
      }
      heat = max(heat, exp(-(head - u) * 12.0));
      fade *= 1.0 - smoothstep(1.2, 1.3, head);
      return p;
    }
    // Gear Library: three gears turn together at the ratio of their teeth.
    if (shape > 5.5 && shape < 6.5) {
      ${gearBranches}
    }
    return p;
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
    float fadeA = 1.0;
    float fadeB = 1.0;
    vec3 fromPoint = behave(a.xyz, uFrom, floor(a.w), heat, fadeA);
    vec3 toPoint = behave(b.xyz, uTo, floor(b.w), heat, fadeB);
    vec3 p = mix(fromPoint, toPoint, t);
    float fade = mix(fadeA, fadeB, t);

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
    gl_Position = projectionMatrix * view;
    gl_PointSize = clamp(uSize * uBoost * (0.6 + aSeed * 0.8) / max(-view.z, 0.5), uSize * 0.055, uMaxSize);

    // The tunnel fills the screen, so it stays clear of the words' side.
    float clear = uClear * smoothstep(-0.05, 0.25, gl_Position.x / gl_Position.w);
    vFade = fade * (1.0 - clear * 0.88);
    vShade = fract(mix(a.w, b.w, step(0.5, t))) / 0.99;
    vHeat = clamp(max(heat, travel * 0.55) + reach * 0.9 + uBurst * 0.5, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uDim, uAlpha, uBoost;
  varying float vShade;
  varying float vHeat;
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5 || vFade < 0.01) discard;
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
      uTurn: { value: 0 },
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

  return { material, glow };
}
