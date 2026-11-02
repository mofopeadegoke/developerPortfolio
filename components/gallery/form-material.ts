import * as THREE from "three";

// The flow loop is adapted from github.com/collidingScopes/liquid-logo (MIT, see
// THIRD_PARTY_NOTICES.md): there it colours a 2D logo; here it carries particles
// between shapes, so the form moves like liquid metal.

const vertexShader = /* glsl */ `
  uniform highp sampler2DArray uShapes;
  uniform float uFrom, uTo, uMix, uTime, uBurst, uVelocity, uSize, uSide;
  uniform vec3 uPointer, uOrigin;
  attribute float aSeed;
  varying float vShade;
  varying float vHeat;

  vec2 liquidFlow(vec3 p, float t) {
    vec2 v = p.xy * 1.15 + p.z * 0.6;
    for (float i = 1.0; i < 5.0; i++) {
      v += cos(v.yx * i + vec2(0.0, i) + t) / i;
    }
    return sin(v);
  }

  void main() {
    int side = int(uSide);
    ivec2 cell = ivec2(gl_VertexID % side, gl_VertexID / side);
    vec4 a = texelFetch(uShapes, ivec3(cell, int(uFrom)), 0);
    vec4 b = texelFetch(uShapes, ivec3(cell, int(uTo)), 0);

    // Particles leave at different moments, so shapes pour rather than fade.
    float t = smoothstep(0.0, 1.0, clamp(uMix * 1.7 - aSeed * 0.7, 0.0, 1.0));
    float travel = sin(3.14159 * t);
    vec3 p = mix(a.xyz, b.xyz, t);

    vec2 f = liquidFlow(p * 1.2 + aSeed, uTime * 0.35);
    vec2 g = liquidFlow(p.zxy * 1.2 - aSeed, uTime * 0.3);
    p += vec3(f.x, g.y, f.y * g.x) * (0.008 + travel * 0.6);

    vec4 world = modelMatrix * vec4(p, 1.0);

    // Parts around the cursor like a finger through liquid.
    vec2 away = world.xy - uPointer.xy;
    float reach = exp(-dot(away, away) * 1.5);
    world.xy += normalize(away + 0.0001) * reach * 0.75;
    world.z += reach * 0.7 * (aSeed - 0.3);

    // A click throws the form apart from where it landed.
    vec3 thrown = normalize(world.xyz - uOrigin + vec3(f, 0.2));
    world.xyz += thrown * uBurst * (0.5 + aSeed * 3.2);

    // Fast scrolling stretches it into streaks.
    world.y += uVelocity * (aSeed - 0.5) * 3.0;

    vec4 view = viewMatrix * world;
    gl_Position = projectionMatrix * view;
    gl_PointSize = uSize * (0.6 + aSeed * 0.8) / -view.z;
    vShade = mix(a.w, b.w, t);
    vHeat = clamp(travel * 0.55 + reach * 0.9 + uBurst * 0.5, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uDim, uAlpha;
  varying float vShade;
  varying float vHeat;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.08, d);
    vec3 colour = mix(vec3(0.5, 0.13, 0.04), vec3(1.0, 0.52, 0.2), vShade);
    colour = mix(colour, vec3(1.0, 0.86, 0.62), vShade * vShade * vShade * 0.75 + vHeat * 0.35);
    gl_FragColor = vec4(colour, soft * (0.16 + 0.84 * vShade + vHeat * 0.25) * uDim * uAlpha);
  }
`;

export function createFormMaterial(side: number, pixelRatio: number) {
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
      uSide: { value: side },
      uSize: { value: (side > 200 ? 21 : 30) * pixelRatio },
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
    uSize: { value: material.uniforms.uSize.value * 7 },
  };

  return { material, glow };
}
