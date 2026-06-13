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

function getScrollProgress() {
  if (typeof window === "undefined") return 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / max));
}

function createParticleGeometry() {
  const count = 1400;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (seededUnit(i * 3) - 0.5) * 12;
    positions[i * 3 + 1] = (seededUnit(i * 3 + 1) - 0.5) * 7.4;
    positions[i * 3 + 2] = (seededUnit(i * 3 + 2) - 0.5) * 4.8;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geometry;
}

function createCanopyGeometry() {
  const count = 1750;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [
    new THREE.Color("#00f5d4"),
    new THREE.Color("#00bbf9"),
    new THREE.Color("#70e000"),
    new THREE.Color("#5a7dff"),
    new THREE.Color("#b9fbc0"),
  ];

  for (let i = 0; i < count; i += 1) {
    const angle = seededUnit(i * 5) * Math.PI * 2;
    const radius = Math.pow(seededUnit(i * 5 + 1), 0.44);
    const canopyBias = seededUnit(i * 5 + 2);
    const xScale = 4.7 + seededUnit(i * 5 + 3) * 1.2;
    const yScale = 1.28 + seededUnit(i * 5 + 4) * 0.7;
    positions[i * 3] = Math.cos(angle) * radius * xScale;
    positions[i * 3 + 1] = 1.08 + Math.sin(angle) * radius * yScale + canopyBias * 1.15;
    positions[i * 3 + 2] = (seededUnit(i * 7) - 0.5) * 1.25 - radius * 0.28;

    const color = palette[Math.floor(seededUnit(i * 11) * palette.length)].clone();
    color.lerp(new THREE.Color("#031416"), Math.max(0, radius - 0.48) * 0.48);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function createSoftPointMaterial(size: number, opacity: number) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    uniforms: {
      uOpacity: { value: opacity },
      uSize: { value: size },
    },
    vertexShader: `
      attribute vec3 color;
      varying vec3 vColor;
      uniform float uSize;

      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uSize / max(0.32, -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      uniform float uOpacity;

      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        float alpha = (1.0 - smoothstep(0.04, 0.5, d)) * uOpacity;
        if (alpha < 0.01) discard;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
  });
}

function SoftPoints({
  geometry,
  opacity,
  size,
}: {
  geometry: THREE.BufferGeometry;
  opacity: number;
  size: number;
}) {
  const material = useMemo(() => createSoftPointMaterial(size, opacity), [opacity, size]);

  return (
    <points geometry={geometry}>
      <primitive attach="material" object={material} />
    </points>
  );
}

function createRootSparkGeometry() {
  const count = 520;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const angle = -Math.PI * 0.82 + seededUnit(i * 4) * Math.PI * 1.64;
    const radius = 0.25 + seededUnit(i * 4 + 1) * 2.5;
    positions[i * 3] = Math.cos(angle) * radius * 0.92;
    positions[i * 3 + 1] = -2.95 + seededUnit(i * 4 + 2) * 0.75;
    positions[i * 3 + 2] = Math.sin(angle) * radius * 0.28 - 0.2;
    const color = new THREE.Color("#d9ed92").lerp(new THREE.Color("#00f5d4"), seededUnit(i * 4 + 3));
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function EtherealMist({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#00f5d4") },
      uColorB: { value: new THREE.Color("#0077ff") },
      uColorC: { value: new THREE.Color("#70e000") },
    }),
    [],
  );

  useFrame(({ clock, pointer }) => {
    if (reduced || !ref.current) return;
    ref.current.material.uniforms.uTime.value = clock.elapsedTime;
    ref.current.rotation.z = pointer.x * 0.025;
    ref.current.rotation.x = pointer.y * 0.02;
  });

  return (
    <mesh ref={ref} position={[0, 0.3, -3.25]} scale={[11.5, 6.6, 1]}>
      <planeGeometry args={[1, 1, 96, 96]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
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
            float r = length(p * vec2(0.86, 1.26));
            float field = sin((p.x * 10.0) + uTime * 0.42) * cos((p.y * 8.0) - uTime * 0.31);
            field += sin((p.x + p.y) * 17.0 + uTime * 0.2) * 0.22;
            vec3 color = mix(uColorA, uColorB, smoothstep(-0.5, 0.7, field));
            color = mix(color, uColorC, smoothstep(0.34, 0.0, r) * 0.65);
            float alpha = smoothstep(0.78, 0.08, r) * 0.58;
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}

function CanopyCloud({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const canopyGeometry = useMemo(() => createCanopyGeometry(), []);
  const rootGeometry = useMemo(() => createRootSparkGeometry(), []);

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const scroll = getScrollProgress();
    group.current.position.y = -0.42 - scroll * 0.54;
    group.current.scale.setScalar(0.88 + scroll * 0.1);
    if (reduced) return;
    group.current.rotation.y = pointer.x * 0.08 + Math.sin(clock.elapsedTime * 0.12) * 0.06;
    group.current.rotation.x = pointer.y * 0.035;
  });

  return (
    <group ref={group} position={[0.88, -0.42, -1.75]}>
      <SoftPoints geometry={canopyGeometry} opacity={0.62} size={128} />
      <SoftPoints geometry={rootGeometry} opacity={0.72} size={30} />
    </group>
  );
}

function ParticleField({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>>(null);
  const geometry = useMemo(() => createParticleGeometry(), []);

  useFrame(({ clock, pointer }) => {
    if (reduced || !ref.current) return;
    const scroll = getScrollProgress();
    ref.current.rotation.y = clock.elapsedTime * 0.025 + pointer.x * 0.16 + scroll * 0.32;
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
  [0, -3.25, -0.25],
  [-0.18, -2.22, 0.06],
  [0.14, -1.1, -0.05],
  [-0.1, 0.25, 0.08],
  [0.12, 1.5, -0.12],
  [0.03, 2.42, -0.16],
]);

const primaryBranchPoints: Array<Array<[number, number, number]>> = [
  [
    [-0.02, -0.42, 0],
    [-1.08, 0.2, 0.12],
    [-2.36, 0.64, -0.08],
    [-4.08, 1.15, -0.16],
  ],
  [
    [0.04, -0.18, 0.02],
    [1.18, 0.36, -0.08],
    [2.34, 0.82, 0.12],
    [4.1, 1.45, -0.08],
  ],
  [
    [-0.06, 0.68, 0.02],
    [-1.28, 1.18, -0.12],
    [-2.68, 1.82, 0.02],
    [-4.0, 2.55, 0.18],
  ],
  [
    [0.1, 0.72, -0.02],
    [1.3, 1.18, 0.16],
    [2.68, 1.88, -0.04],
    [4.05, 2.78, 0.08],
  ],
  [
    [0.03, 1.25, 0],
    [-0.96, 1.82, 0.12],
    [-1.92, 2.48, -0.08],
    [-2.72, 3.28, 0],
  ],
  [
    [0.12, 1.48, 0.02],
    [1.08, 2.0, -0.12],
    [2.1, 2.66, 0.08],
    [3.15, 3.42, -0.02],
  ],
];

const subBranchPoints: Array<Array<[number, number, number]>> = [
  [
    [-2.36, 0.64, -0.08],
    [-3.06, 0.34, 0.16],
    [-3.86, 0.22, 0.22],
  ],
  [
    [-2.36, 0.64, -0.08],
    [-3.1, 0.84, -0.16],
    [-3.92, 0.76, -0.3],
  ],
  [
    [-2.68, 1.82, 0.02],
    [-3.18, 2.06, 0.22],
    [-4.1, 2.12, 0.34],
  ],
  [
    [-2.68, 1.82, 0.02],
    [-3.14, 1.64, -0.16],
    [-4.05, 1.72, -0.34],
  ],
  [
    [2.68, 1.88, -0.04],
    [3.28, 2.1, 0.2],
    [4.14, 2.46, 0.32],
  ],
  [
    [2.68, 1.88, -0.04],
    [3.22, 1.62, -0.18],
    [4.06, 1.52, -0.36],
  ],
];

const canopyTwigPoints: Array<Array<[number, number, number]>> = primaryBranchPoints.flatMap(
  (branch, branchIndex) => {
    const anchor = branch[branch.length - 2];
    const end = branch[branch.length - 1];
    const direction = end[0] < 0 ? -1 : 1;
    return [0, 1, 2].map((twigIndex) => {
      const lift = 0.2 + twigIndex * 0.24 + seededUnit(branchIndex * 13 + twigIndex) * 0.16;
      const reach = 0.42 + twigIndex * 0.34 + seededUnit(branchIndex * 17 + twigIndex) * 0.22;
      const z = end[2] + (seededUnit(branchIndex * 19 + twigIndex) - 0.5) * 0.34;
      return [
        [
          anchor[0] * 0.42 + end[0] * 0.58,
          anchor[1] * 0.42 + end[1] * 0.58,
          anchor[2] * 0.42 + end[2] * 0.58,
        ],
        [end[0] + direction * reach * 0.52, end[1] + lift * 0.58, z],
        [end[0] + direction * reach, end[1] + lift, z + direction * 0.06],
      ] as Array<[number, number, number]>;
    });
  },
);

const rootPoints: Array<Array<[number, number, number]>> = [
  [
    [0, -3.05, -0.1],
    [-0.82, -3.16, 0.08],
    [-1.72, -3.34, -0.18],
    [-2.5, -3.42, -0.24],
  ],
  [
    [0, -3.08, -0.08],
    [0.7, -3.16, 0.12],
    [1.54, -3.35, -0.12],
    [2.45, -3.46, -0.18],
  ],
  [
    [0, -3.18, -0.12],
    [-0.28, -3.55, -0.02],
    [-0.7, -3.78, -0.16],
    [-1.3, -3.96, -0.22],
  ],
  [
    [0, -3.18, -0.12],
    [0.34, -3.52, -0.02],
    [0.9, -3.78, -0.12],
    [1.55, -3.92, -0.24],
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
  const twigCurves = useMemo(() => canopyTwigPoints.map(makeCurve), []);
  const rootCurves = useMemo(() => rootPoints.map(makeCurve), []);
  const active = useRef(activeIndex);

  useFrame(({ clock, pointer }) => {
    active.current += (activeIndex - active.current) * 0.06;
    if (!group.current) return;
    const scroll = getScrollProgress();
    group.current.position.y = -0.72 - scroll * 1.18 - active.current * 0.02;
    group.current.position.x = 1.26 - scroll * 0.36;
    group.current.scale.setScalar(0.82 + scroll * 0.12);
    if (!reduced) {
      group.current.rotation.x = pointer.y * 0.055;
      group.current.rotation.y = -0.28 + pointer.x * 0.12 + active.current * 0.035 + scroll * 0.36;
    }
    if (glow.current) {
      const pulse = reduced ? 1 : 1 + Math.sin(clock.elapsedTime * 3) * 0.12;
      glow.current.scale.setScalar(pulse);
    }
  });

  const projectNodes = projects.slice(0, 6);
  const routeNodePositions: Array<[number, number, number]> = [
    [0, -2.62, 0],
    [-4.08, 1.15, -0.16],
    [4.1, 1.45, -0.08],
    [-4.0, 2.55, 0.18],
    [4.05, 2.78, 0.08],
    [-2.72, 3.28, 0],
    [3.15, 3.42, -0.02],
    [-1.0, 3.64, 0.12],
    [1.18, 3.7, -0.08],
  ];

  return (
    <group ref={group} position={[1.26, -0.72, -1.72]} rotation={[0, -0.28, 0]} scale={0.82}>
      <TreeTube curve={trunkCurve} radius={0.076} color="#b9fbc0" opacity={0.9} />
      <TreeTube curve={trunkCurve} radius={0.026} color="#00f5d4" opacity={0.78} />
      {rootCurves.map((curve, index) => (
        <TreeTube
          color={index % 2 === 0 ? "#06251f" : "#0b2a3a"}
          curve={curve}
          key={`root-${index}`}
          opacity={0.95}
          radius={0.042}
        />
      ))}
      {branchCurves.map((curve, index) => (
        <group key={`branch-${index}`}>
          <TreeTube color="#021b1f" curve={curve} opacity={0.78} radius={0.023 - index * 0.0015} />
          <TreeTube
            color={index === activeIndex - 1 ? "#d9ed92" : "#00f5d4"}
            curve={curve}
            opacity={index === activeIndex - 1 ? 0.68 : 0.28}
            radius={0.011}
          />
        </group>
      ))}
      {subCurves.map((curve, index) => (
        <group key={`sub-${index}`}>
          <TreeTube color="#031318" curve={curve} opacity={0.86} radius={0.022} />
          <TreeTube color="#70e000" curve={curve} opacity={0.25} radius={0.008} />
        </group>
      ))}
      {twigCurves.map((curve, index) => (
        <group key={`twig-${index}`}>
          <TreeTube color="#031318" curve={curve} opacity={0.58} radius={0.011} />
          <TreeTube color={index % 3 === 0 ? "#00bbf9" : "#00f5d4"} curve={curve} opacity={0.16} radius={0.004} />
        </group>
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
        camera={{ position: [0, 0.15, 6.4], fov: 43 }}
        dpr={[1, 1.6]}
        frameloop={reduced ? "demand" : "always"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.48} />
        <pointLight position={[2.5, 2.4, 4]} intensity={4.6} color="#00f5d4" />
        <pointLight position={[-3.2, 1.8, 2]} intensity={3.4} color="#0077ff" />
        <pointLight position={[0, -1.8, 1.4]} intensity={3.2} color="#70e000" />
        <EtherealMist reduced={reduced} />
        <CanopyCloud reduced={reduced} />
        <ParticleField reduced={reduced} />
        <RouteTree activeIndex={activeIndex} reduced={reduced} />
      </Canvas>
    </div>
  );
}
