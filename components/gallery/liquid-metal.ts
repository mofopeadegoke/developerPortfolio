import * as THREE from "three";

// Shared across every sculpture so the shader compiles once. The flow loop is
// adapted from github.com/collidingScopes/liquid-logo (MIT, see
// THIRD_PARTY_NOTICES.md): there it colours a 2D logo; here it bends the
// surface normals of real geometry so reflections run like liquid metal.

export const liquidTime = { value: 0 };

export function createLiquidMetal() {
  const material = new THREE.MeshStandardMaterial({
    color: "#f4f5f8",
    metalness: 1,
    roughness: 0.11,
    envMapIntensity: 1.25,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uLiquidTime = liquidTime;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vLiquidPosition;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLiquidPosition = position;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        varying vec3 vLiquidPosition;
        uniform float uLiquidTime;
        vec2 liquidFlow(vec3 p, float t) {
          vec2 v = p.xy * 1.15 + p.z * 0.6;
          for (float i = 1.0; i < 6.0; i++) {
            v += cos(v.yx * i + vec2(0.0, i) + t) / i;
          }
          return sin(v);
        }`,
      )
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
        vec2 liquid = liquidFlow(vLiquidPosition, uLiquidTime * 0.35);
        normal = normalize(normal + vec3(liquid * 0.2, 0.0));`,
      );
  };

  return material;
}
