"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { useMemo, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { getTraversalIndex, traversalNodes } from "@/data/pages";
import { projects } from "@/data/projects";

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

function makeCurve(points: Array<[number, number, number]>) {
  return new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
}

const trunkCurve = makeCurve([
  [0, -3.2, -0.2],
  [-0.18, -2.1, 0.06],
  [0.2, -0.8, -0.05],
  [-0.08, 0.8, 0.08],
  [0.14, 2.45, -0.12],
]);

const primaryBranchPoints: Array<Array<[number, number, number]>> = [
  [
    [-0.04, -1.35, 0],
    [-1.1, -0.82, 0.12],
    [-2.15, -0.35, -0.08],
    [-3.35, 0.08, -0.16],
  ],
  [
    [0.06, -0.78, 0.02],
    [1.2, -0.35, -0.08],
    [2.2, 0.2, 0.12],
    [3.3, 0.72, -0.08],
  ],
  [
    [-0.02, 0.05, 0.02],
    [-1.26, 0.52, -0.12],
    [-2.5, 1.18, 0.02],
    [-3.1, 1.9, 0.18],
  ],
  [
    [0.08, 0.55, -0.02],
    [1.15, 0.98, 0.16],
    [2.16, 1.58, -0.04],
    [3.0, 2.34, 0.08],
  ],
  [
    [0.05, 1.25, 0],
    [-0.78, 1.74, 0.12],
    [-1.36, 2.28, -0.08],
    [-1.85, 2.9, 0],
  ],
  [
    [0.12, 1.65, 0.02],
    [0.88, 2.0, -0.12],
    [1.6, 2.55, 0.08],
    [2.3, 3.15, -0.02],
  ],
];

const subBranchPoints: Array<Array<[number, number, number]>> = [
  [
    [-2.15, -0.35, -0.08],
    [-2.68, -0.58, 0.16],
    [-3.08, -0.88, 0.22],
  ],
  [
    [-2.15, -0.35, -0.08],
    [-2.75, -0.1, -0.16],
    [-3.28, -0.14, -0.3],
  ],
  [
    [-2.5, 1.18, 0.02],
    [-2.88, 1.42, 0.22],
    [-3.38, 1.56, 0.34],
  ],
  [
    [-2.5, 1.18, 0.02],
    [-2.88, 1.05, -0.16],
    [-3.32, 1.12, -0.34],
  ],
  [
    [2.16, 1.58, -0.04],
    [2.78, 1.72, 0.2],
    [3.4, 1.98, 0.32],
  ],
  [
    [2.16, 1.58, -0.04],
    [2.62, 1.34, -0.18],
    [3.16, 1.18, -0.36],
  ],
];

function TreeTube({
  curve,
  radius,
  color,
  opacity = 1,
}: {
  curve: THREE.CatmullRomCurve3;
  radius: number;
  color: string;
  opacity?: number;
}) {
  return (
    <mesh>
      <tubeGeometry args={[curve, 72, radius, 8, false]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.22}
        roughness={0.46}
        metalness={0.36}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

function RouteTree({ reduced, activeIndex }: { reduced: boolean; activeIndex: number }) {
  const group = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Group>(null);
  const branchCurves = useMemo(() => primaryBranchPoints.map(makeCurve), []);
  const subCurves = useMemo(() => subBranchPoints.map(makeCurve), []);
  const active = useRef(activeIndex);

  useFrame(({ clock, pointer }) => {
    active.current += (activeIndex - active.current) * 0.06;
    if (!group.current) return;
    if (!reduced) {
      group.current.rotation.x = pointer.y * 0.055;
      group.current.rotation.y = -0.42 + pointer.x * 0.12 + active.current * 0.035;
      group.current.position.y = -0.18 - active.current * 0.025;
    }
    if (glow.current) {
      const pulse = reduced ? 1 : 1 + Math.sin(clock.elapsedTime * 3) * 0.12;
      glow.current.scale.setScalar(pulse);
    }
  });

  const projectNodes = projects.slice(0, 6);
  const routeNodePositions: Array<[number, number, number]> = [
    [0, -2.8, 0],
    [-3.35, 0.08, -0.16],
    [3.3, 0.72, -0.08],
    [-3.1, 1.9, 0.18],
    [3.0, 2.34, 0.08],
    [-1.85, 2.9, 0],
    [2.3, 3.15, -0.02],
    [-0.85, 3.5, 0.12],
    [0.95, 3.55, -0.08],
  ];

  return (
    <group ref={group} position={[1.5, -0.34, -1.7]} rotation={[0, -0.42, 0]} scale={0.86}>
      <TreeTube curve={trunkCurve} radius={0.065} color="#d9ed92" opacity={0.95} />
      {branchCurves.map((curve, index) => (
        <TreeTube
          color={index === activeIndex - 1 ? "#00f5d4" : "#8ef6e4"}
          curve={curve}
          key={`branch-${index}`}
          opacity={index === activeIndex - 1 ? 1 : 0.58}
          radius={0.033}
        />
      ))}
      {subCurves.map((curve, index) => (
        <TreeTube
          color="#ff4d6d"
          curve={curve}
          key={`sub-${index}`}
          opacity={0.52}
          radius={0.015}
        />
      ))}
      {routeNodePositions.map((position, index) => {
        const isActive = index === activeIndex;
        return (
          <group key={traversalNodes[index]?.href ?? index} position={position}>
            <mesh>
              <sphereGeometry args={[isActive ? 0.13 : 0.07, 18, 18]} />
              <meshStandardMaterial
                color={isActive ? "#ffffff" : "#00f5d4"}
                emissive={isActive ? "#00f5d4" : "#00483f"}
                emissiveIntensity={isActive ? 1.8 : 0.65}
                roughness={0.18}
              />
            </mesh>
            {isActive && (
              <group ref={glow}>
                <mesh>
                  <sphereGeometry args={[0.27, 18, 18]} />
                  <meshBasicMaterial color="#00f5d4" transparent opacity={0.18} />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
      {projectNodes.map((project, index) => {
        const curve = subCurves[index];
        const point = curve.getPoint(1);
        return (
          <mesh key={project.slug} position={point}>
            <octahedronGeometry args={[0.06, 0]} />
            <meshStandardMaterial color="#ff4d6d" emissive="#4f0015" emissiveIntensity={1.1} />
          </mesh>
        );
      })}
    </group>
  );
}

export function WebGLStage() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const activeIndex = getTraversalIndex(pathname);

  return (
    <div className="webgl-stage" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.2, 6.3], fov: 42 }}
        dpr={[1, 1.6]}
        frameloop={reduced ? "demand" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.62} />
        <pointLight position={[3, 2, 4]} intensity={4.2} color="#00f5d4" />
        <pointLight position={[-3, -2, 2]} intensity={2.7} color="#ff4d6d" />
        <pointLight position={[0, 4, 1]} intensity={1.8} color="#d9ed92" />
        <ShaderPlane reduced={reduced} />
        <ParticleField reduced={reduced} />
        <RouteTree activeIndex={activeIndex} reduced={reduced} />
      </Canvas>
    </div>
  );
}
