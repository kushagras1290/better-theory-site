"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";

function useReducedMotion() {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => undefined;
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    () => {
      if (typeof window === "undefined") return false;
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },
    () => false,
  );
}

function seededUnit(index: number) {
  const value = Math.sin(index * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function createParticleGeometry() {
  const count = 900;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (seededUnit(i * 3) - 0.5) * 11;
    positions[i * 3 + 1] = (seededUnit(i * 3 + 1) - 0.5) * 7;
    positions[i * 3 + 2] = (seededUnit(i * 3 + 2) - 0.5) * 5;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geometry;
}

function ShaderPlane({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#00f5d4") },
      uColorB: { value: new THREE.Color("#ff4d6d") },
      uColorC: { value: new THREE.Color("#ffd60a") },
    }),
    [],
  );

  useFrame(({ clock, pointer }) => {
    if (reduced || !ref.current) return;
    ref.current.material.uniforms.uTime.value = clock.elapsedTime;
    ref.current.rotation.z = pointer.x * 0.04;
    ref.current.rotation.x = pointer.y * 0.035;
  });

  return (
    <mesh ref={ref} position={[0, 0, -3]} scale={[8, 5, 1]}>
      <planeGeometry args={[1, 1, 96, 96]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          uniform float uTime;
          void main() {
            vUv = uv;
            vec3 p = position;
            float wave = sin((p.x * 7.0) + uTime * 0.65) * 0.08;
            wave += cos((p.y * 9.0) - uTime * 0.45) * 0.06;
            p.z += wave;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform vec3 uColorC;
          void main() {
            vec2 p = vUv - 0.5;
            float r = length(p);
            float field = sin((p.x * 12.0) + uTime) * cos((p.y * 10.0) - uTime * 0.7);
            vec3 color = mix(uColorA, uColorB, smoothstep(-0.5, 0.7, field));
            color = mix(color, uColorC, smoothstep(0.34, 0.0, r) * 0.65);
            float alpha = smoothstep(0.72, 0.12, r) * 0.46;
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}

function ParticleField({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>>(null);
  const geometry = useMemo(() => createParticleGeometry(), []);

  useFrame(({ clock, pointer }) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.025 + pointer.x * 0.16;
    ref.current.rotation.x = pointer.y * 0.08;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color="#f8f7ff"
        size={0.012}
        transparent
        opacity={0.72}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingCore({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    if (reduced || !group.current) return;
    group.current.rotation.x = clock.elapsedTime * 0.14 + pointer.y * 0.1;
    group.current.rotation.y = clock.elapsedTime * 0.18 + pointer.x * 0.16;
  });

  return (
    <group ref={group} position={[1.9, -0.2, -1.25]}>
      <mesh>
        <icosahedronGeometry args={[1.1, 2]} />
        <meshStandardMaterial
          color="#00f5d4"
          emissive="#003d37"
          roughness={0.18}
          metalness={0.72}
          wireframe
        />
      </mesh>
      <mesh scale={1.34}>
        <torusKnotGeometry args={[0.72, 0.015, 180, 12]} />
        <meshStandardMaterial color="#ff4d6d" emissive="#4f0015" />
      </mesh>
    </group>
  );
}

export function WebGLStage() {
  const reduced = useReducedMotion();

  return (
    <div className="webgl-stage" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.6], fov: 45 }}
        dpr={[1, 1.6]}
        frameloop={reduced ? "demand" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.9} />
        <pointLight position={[3, 2, 4]} intensity={3.2} color="#00f5d4" />
        <pointLight position={[-3, -2, 2]} intensity={2.6} color="#ff4d6d" />
        <ShaderPlane reduced={reduced} />
        <ParticleField reduced={reduced} />
        <FloatingCore reduced={reduced} />
      </Canvas>
    </div>
  );
}
