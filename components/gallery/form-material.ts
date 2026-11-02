import * as THREE from "three";
import { GEARS, PAN, STAMP, TRAIN } from "@/components/gallery/form-shapes";

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

const wheelCount = TRAIN.wheels.length;
const wheelList = TRAIN.wheels.map(glsl).join(", ");
const stampUp = `vec3(0.0, ${glsl(Math.cos(STAMP.tilt))}, ${glsl(Math.sin(STAMP.tilt))})`;
const panRest = glsl(-Math.PI / 2 + PAN.tilt);

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

  const float WHEEL_X[${wheelCount}] = float[${wheelCount}](${wheelList});

  // Each model's own behaviour. Returns where a particle is right now.
  vec3 behave(vec3 p, float shape, float group, inout float heat, inout float fade) {
    // Experience: a train chugs along with the sleepers rushing past beneath it.
    if (shape > 0.5 && shape < 1.5) {
      if (group < 1.5) {
        p.y += sin(uTime * 7.0 + p.x * 5.0) * 0.006;
      } else if (group > 2.5 && group < 3.5) {
        p.x = mod(p.x + 1.15 - uTime * 0.45, 2.3) - 1.15;
      } else if (group > 3.5 && group < 4.5) {
        float life = fract(uTime * 0.2 + aSeed * 11.0);
        vec3 drift = vec3(sin(aSeed * 91.0), cos(aSeed * 53.0), sin(aSeed * 37.0));
        p += vec3(-life * 0.95, life * 0.5 + life * life * 0.15, 0.0) + drift * life * 0.17;
        fade *= (1.0 - life) * smoothstep(0.0, 0.06, life);
      } else if (group > 9.5) {
        vec2 c = vec2(WHEEL_X[int(group) - 10], ${glsl(TRAIN.wheelY)});
        p.xy = c + rot(p.xy - c, -uTime * 3.0);
      }
      return p;
    }
    // Uncooked: the pan tosses the resume, which flips and lands uncooked.
    if (shape > 1.5 && shape < 2.5) {
      float T = fract(uTime * 0.15);
      float flight = clamp(T / 0.62, 0.0, 1.0);
      float landed = max(T - 0.62, 0.0);
      float kick = sin(min(T / 0.07, 1.0) * 3.14159) * 0.1 - step(0.62, T) * exp(-landed * 22.0) * 0.07;
      if (group < 0.5) {
        p.y += kick;
      } else if (group < 1.5) {
        float angle = ${panRest} + 6.28318 * pow(flight, 2.4);
        p.yz = rot(p.yz, angle);
        p += vec3(${glsl(PAN.x)}, ${glsl(PAN.y)} + 0.2 + 4.0 * flight * (1.0 - flight) * 1.1, 0.0);
      } else {
        float spark = (T - 0.62) / 0.25;
        if (spark < 0.0 || spark > 1.0) {
          fade = 0.0;
          return p;
        }
        vec2 outward = normalize(p.xz - vec2(${glsl(PAN.x)}, 0.0));
        p += vec3(outward.x, 0.0, outward.y) * spark * 0.6 + vec3(0.0, spark * (1.0 - spark) * 1.5 * (0.4 + aSeed), 0.0);
        fade *= 1.0 - spark;
        heat = 1.0;
      }
      return p;
    }
    // Smart Bookmarks: a plane lands in a book, which snaps shut and shows its tags.
    if (shape > 2.5 && shape < 3.5) {
      float T = fract(uTime * 0.11);
      float shut = smoothstep(0.4, 0.46, T) * (1.0 - smoothstep(0.86, 0.96, T));
      float emerge = smoothstep(0.5, 0.62, T) * (1.0 - smoothstep(0.82, 0.9, T));
      if (group < 1.5) {
        float angle = group < 0.5 ? -0.3 : mix(0.3, 2.84, shut);
        p.xz = rot(p.xz, angle);
        p.x += shut * 0.47;
      } else if (group < 2.5) {
        float along = smoothstep(0.0, 0.42, T);
        vec3 shrunk = p * mix(1.0, 0.45, along);
        shrunk.xy = rot(shrunk.xy, -0.5);
        p = mix(vec3(-1.4, 1.0, 0.5), vec3(0.0, 0.0, 0.15), along) + shrunk;
        p.y += sin(along * 6.28318) * 0.2;
        fade *= smoothstep(0.0, 0.04, T) * (1.0 - smoothstep(0.39, 0.43, T));
      } else if (group < 3.5) {
        p.y = mix(-0.62, p.y, emerge);
        p.x += sin(p.y * 7.0 + uTime * 3.0) * 0.03 * emerge;
        fade *= emerge;
      } else {
        float i = group - 4.0;
        float angle = i * 1.257 + 0.6;
        float reach = emerge * (0.95 + sin(uTime * 0.9 + i) * 0.1);
        vec2 spun = rot(p.xy, uTime * 0.8 + i);
        p = vec3(spun, p.z) + vec3(cos(angle) * reach * 1.15, sin(angle) * reach, 0.3);
        fade *= emerge;
      }
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
    // Inscribe: the stamp hovers, slams down and leaves the install count behind.
    if (shape > 4.5 && shape < 5.5) {
      float T = fract(uTime * 0.15);
      float drop = clamp((T - 0.42) / 0.08, 0.0, 1.0);
      float lifted = mix(mix(0.95 + sin(uTime * 2.0) * 0.04, 0.0, drop * drop), 0.95, smoothstep(0.6, 0.85, T));
      float impact = step(0.5, T) * exp(-(T - 0.5) * 14.0);
      if (group < 0.5) {
        p.y -= impact * 0.04;
      } else if (group < 1.5) {
        fade *= smoothstep(0.5, 0.51, T) * (1.0 - smoothstep(0.93, 1.0, T));
        heat = max(heat, impact);
      } else if (group < 2.5) {
        p += ${stampUp} * lifted;
      } else {
        float wave = (T - 0.5) / 0.25;
        if (wave < 0.0 || wave > 1.0) {
          fade = 0.0;
          return p;
        }
        vec3 centre = vec3(0.0, ${glsl(STAMP.y)}, 0.0);
        p = centre + (p - centre) * mix(0.4, 1.5, wave);
        fade *= 1.0 - wave;
        heat = 1.0;
      }
      return p;
    }
    // Gear Library: three gears turn together at the ratio of their teeth.
    if (shape > 5.5 && shape < 6.5) {
      ${gearBranches}
    }
    // Wormhole: at rest the rings only breathe.
    if (shape > 6.5 && shape < 7.5) {
      p.xy *= 1.0 + sin(uTime * 0.7 - group * 0.6) * 0.05;
      return p;
    }
    // Skills: the lid flies open and the tools circle the box.
    if (shape > 7.5 && shape < 8.5 && group > 0.5) {
      float T = fract(uTime * 0.08);
      if (group < 1.5) {
        float open = smoothstep(0.02, 0.14, T) * (1.0 - smoothstep(0.88, 0.98, T));
        vec2 hinge = vec2(-0.37, -0.36);
        p.yz = hinge + rot(p.yz - hinge, -open * 2.1);
        return p;
      }
      float i = group - 2.0;
      float away = smoothstep(0.05 + i * 0.03, 0.2 + i * 0.03, T) * (1.0 - smoothstep(0.82, 0.96, T));
      vec3 home = vec3(-0.55 + 0.22 * i, -0.45, 0.0);
      vec3 local = p - home;
      float angle = i * 1.0472 + uTime * 0.35;
      local.xy = rot(local.xy, away * (uTime * 0.5 + i)) * (1.0 + away * 0.35);
      p = mix(home, vec3(cos(angle) * 0.98, 0.42 + sin(angle) * 0.16, sin(angle) * 0.5), away) + local;
      return p;
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
