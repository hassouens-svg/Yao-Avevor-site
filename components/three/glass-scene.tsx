"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Scène 3D du hero : flacons et bocaux en verre (clin d'œil à l'industrie verrière),
 * engrenage et cubes « blocs de planning » qui flottent et suivent la souris.
 * Aucun fichier externe : géométries générées (LatheGeometry) et environnement d'éclairage construit en code.
 */

function bottleProfile(kind: "bottle" | "jar" | "flask") {
  const pts: [number, number][] =
    kind === "bottle"
      ? [[0, 0], [0.42, 0], [0.46, 0.04], [0.46, 1.1], [0.42, 1.35], [0.2, 1.65], [0.15, 1.75], [0.15, 2.05], [0.18, 2.08], [0.18, 2.15], [0, 2.15]]
      : kind === "jar"
        ? [[0, 0], [0.55, 0], [0.6, 0.06], [0.6, 0.85], [0.52, 0.98], [0.5, 1.02], [0.53, 1.06], [0.53, 1.18], [0, 1.18]]
        : [[0, 0], [0.62, 0], [0.66, 0.1], [0.62, 0.45], [0.38, 0.9], [0.17, 1.15], [0.15, 1.6], [0.19, 1.64], [0, 1.64]];
  return pts.map(([x, y]) => new THREE.Vector2(x, y - (kind === "bottle" ? 1.05 : kind === "jar" ? 0.6 : 0.8)));
}

function Glass({
  kind,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  tint = "#cfe6f7",
  speed = 1,
}: {
  kind: "bottle" | "jar" | "flask";
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  tint?: string;
  speed?: number;
}) {
  const geo = useMemo(() => new THREE.LatheGeometry(bottleProfile(kind), 64), [kind]);
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.25 * speed;
  });
  return (
    <Float speed={1.4 * speed} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} geometry={geo} position={position} rotation={rotation} scale={scale}>
        <meshPhysicalMaterial
          color={tint}
          transmission={1}
          thickness={0.6}
          roughness={0.04}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.05}
          attenuationColor="#8CC8F0"
          attenuationDistance={1.6}
          envMapIntensity={1.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

function Gear({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Group>(null);
  const teeth = 12;
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z -= dt * 0.35;
  });
  return (
    <Float speed={1.1} rotationIntensity={0.4} floatIntensity={0.8}>
      <group ref={ref} position={position} scale={scale} rotation={[0.5, -0.4, 0]}>
        <mesh>
          <torusGeometry args={[0.5, 0.16, 24, 64]} />
          <meshStandardMaterial color="#0B1F3A" metalness={0.6} roughness={0.25} />
        </mesh>
        {Array.from({ length: teeth }).map((_, i) => {
          const a = (i / teeth) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0]} rotation={[0, 0, a]}>
              <boxGeometry args={[0.2, 0.16, 0.24]} />
              <meshStandardMaterial color="#0B1F3A" metalness={0.6} roughness={0.25} />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

function Block({ position, color, size = 0.32 }: { position: [number, number, number]; color: string; size?: number }) {
  return (
    <Float speed={2} rotationIntensity={1.4} floatIntensity={1.6}>
      <mesh position={position} rotation={[0.4, 0.6, 0.2]}>
        <boxGeometry args={[size * 2.2, size, size]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
      </mesh>
    </Float>
  );
}

/** Le groupe suit la souris (parallaxe douce) et remonte légèrement au scroll. */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.pow(0.002, dt);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.x * 0.35, k);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -pointer.y * 0.22, k);
    g.position.x = THREE.MathUtils.lerp(g.position.x, pointer.x * 0.4, k);
    g.position.y = THREE.MathUtils.lerp(g.position.y, pointer.y * 0.25 + window.scrollY * 0.0025, k);
  });
  return <group ref={group}>{children}</group>;
}

export default function GlassScene({ compact = false }: { compact?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 9], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      aria-hidden="true"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <Rig>
        <group position={compact ? [0, 2.4, -2] : [2.35, 0.1, 0]} scale={compact ? 0.55 : 0.78}>
        <Glass kind="bottle" position={[-2.3, 1.5, -0.8]} rotation={[0.2, 0, -0.35]} scale={0.9} />
        <Glass kind="jar" position={[2.7, -1.4, 0.2]} rotation={[-0.2, 0, 0.3]} scale={1.05} speed={0.8} />
        <Glass kind="flask" position={[2.4, 1.9, -1.2]} rotation={[0.1, 0, 0.4]} scale={0.8} speed={1.2} />
        {!compact && <Glass kind="bottle" position={[-1.9, -2.1, -1.6]} rotation={[0.5, 0, 0.9]} scale={0.7} speed={0.9} />}
        <Gear position={[3.3, -0.2, -0.6]} scale={0.7} />
        <Block position={[0.6, 2.6, -0.8]} color="#8CC8F0" />
        <Block position={[-0.8, -2.7, 0.3]} color="#1D4F91" size={0.26} />
        {!compact && <Block position={[-2.6, -0.8, -1]} color="#0B1F3A" size={0.22} />}
        </group>
      </Rig>
      {/* Environnement d'éclairage construit en code (pas de HDR téléchargé) */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#f3f6fa"]} />
        <Lightformer intensity={3} form="rect" position={[0, 5, -9]} scale={[10, 10, 1]} />
        <Lightformer intensity={2} form="rect" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 2, 1]} color="#8CC8F0" />
        <Lightformer intensity={2} form="rect" position={[5, -1, -1]} rotation-y={-Math.PI / 2} scale={[20, 2, 1]} />
        <Lightformer intensity={1.5} form="ring" position={[2, 3, 6]} scale={3} color="#ffffff" />
      </Environment>
    </Canvas>
  );
}
