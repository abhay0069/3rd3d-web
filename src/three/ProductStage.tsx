import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, OrbitControls, RoundedBox } from '@react-three/drei'
import type { Product } from '../data/salon'
import type { DeviceTier } from '../hooks/useResponsive'

/* Bespoke packaging, modelled from primitives — no downloads, no third-party models. */

function GlassBody({ glass }: { glass: boolean }) {
  return glass ? (
    <meshPhysicalMaterial
      color="#F2EADC"
      transmission={0.82}
      thickness={0.9}
      roughness={0.08}
      ior={1.5}
      metalness={0}
      clearcoat={1}
      clearcoatRoughness={0.15}
      envMapIntensity={1.4}
      transparent
    />
  ) : (
    <meshStandardMaterial color="#EFE7DA" roughness={0.25} metalness={0.05} transparent opacity={0.92} />
  )
}

function Brass({ dark = false }: { dark?: boolean }) {
  return (
    <meshStandardMaterial
      color={dark ? '#9A7B45' : '#C8A87C'}
      metalness={1}
      roughness={dark ? 0.38 : 0.22}
      envMapIntensity={1.3}
    />
  )
}

function Amber() {
  return (
    <meshPhysicalMaterial
      color="#7A4A1E"
      transmission={0.6}
      thickness={0.6}
      roughness={0.15}
      ior={1.42}
      metalness={0}
      transparent
    />
  )
}

function Serum({ glass }: { glass: boolean }) {
  return (
    <group>
      {/* body */}
      <mesh castShadow position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.24, 0.25, 0.95, 48]} />
        <GlassBody glass={glass} />
      </mesh>
      {/* liquid */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.215, 0.225, 0.7, 40]} />
        <Amber />
      </mesh>
      {/* shoulder + neck */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.1, 0.24, 0.16, 40]} />
        <GlassBody glass={glass} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.095, 0.1, 0.12, 32]} />
        <Brass />
      </mesh>
      {/* dropper cap */}
      <mesh castShadow position={[0, 0.64, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.2, 40]} />
        <Brass dark />
      </mesh>
      <mesh position={[0, 0.76, 0]}>
        <sphereGeometry args={[0.11, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Brass />
      </mesh>
    </group>
  )
}

function PumpBottle() {
  return (
    <group>
      <RoundedBox args={[0.62, 1.0, 0.36]} radius={0.09} smoothness={4} position={[0, -0.08, 0]} castShadow>
        <meshStandardMaterial color="#F1E9DC" roughness={0.35} metalness={0.04} />
      </RoundedBox>
      {/* brass collar */}
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.15, 0.16, 0.09, 32]} />
        <Brass />
      </mesh>
      {/* pump */}
      <mesh position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.06, 0.075, 0.2, 24]} />
        <Brass dark />
      </mesh>
      <mesh position={[0.07, 0.66, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <capsuleGeometry args={[0.035, 0.12, 4, 12]} />
        <Brass dark />
      </mesh>
    </group>
  )
}

function Tube() {
  return (
    <group>
      <mesh castShadow position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.19, 0.24, 1.05, 40]} />
        <meshStandardMaterial color="#F3ECE0" roughness={0.42} metalness={0.03} />
      </mesh>
      {/* crimped top */}
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.34, 0.05, 0.09]} />
        <Brass dark />
      </mesh>
      {/* barrel lid */}
      <mesh castShadow position={[0, -0.68, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.12, 40]} />
        <Brass />
      </mesh>
    </group>
  )
}

function Jar() {
  return (
    <group>
      <mesh castShadow position={[0, -0.18, 0]}>
        <cylinderGeometry args={[0.5, 0.46, 0.42, 56]} />
        <meshPhysicalMaterial
          color="#EFE7DA"
          transmission={0.28}
          thickness={0.5}
          roughness={0.22}
          metalness={0}
          ior={1.45}
          transparent
        />
      </mesh>
      {/* domed brass lid */}
      <mesh castShadow position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.1, 56]} />
        <Brass />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <sphereGeometry args={[0.52, 48, 20, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        <Brass dark />
      </mesh>
      {/* contents */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.44, 0.42, 0.3, 40]} />
        <meshStandardMaterial color="#D8C6A6" roughness={0.9} />
      </mesh>
    </group>
  )
}

function ProductMesh({ kind, glass }: { kind: Product['kind']; glass: boolean }) {
  switch (kind) {
    case 'serum':
      return <Serum glass={glass} />
    case 'shampoo':
      return <PumpBottle />
    case 'conditioner':
      return <Tube />
    case 'mask':
      return <Jar />
  }
}

/** Swaps in with a small scale settle so the change of product feels composed. */
function ProductGroup({ product, glass }: { product: Product; glass: boolean }) {
  const ref = useRef<THREE.Group>(null!)
  const key = product.kind

  useFrame((_, delta) => {
    const g = ref.current
    if (!g) return
    const target = 1
    g.scale.x += (target - g.scale.x) * Math.min(1, delta * 3.4)
    g.scale.y = g.scale.x
    g.scale.z = g.scale.x
  })

  return (
    <group ref={ref} key={key} scale={0.86}>
      <Float speed={1.1} rotationIntensity={0.16} floatIntensity={0.5} floatingRange={[-0.04, 0.09]}>
        <ProductMesh kind={product.kind} glass={glass} />
      </Float>
    </group>
  )
}

export default function ProductStage({
  product,
  tier,
  interactive = true,
}: {
  product: Product
  tier: DeviceTier
  interactive?: boolean
}) {
  const glass = tier !== 'low'
  const dpr = useMemo(() => (tier === 'high' ? [1, 2] : [1, 1.5]), [tier])

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={dpr as [number, number]}
      shadows={tier !== 'low'}
      gl={{ antialias: tier === 'high', alpha: true, powerPreference: 'high-performance', stencil: false }}
      camera={{ fov: 30, position: [0, 0.55, 4.4], near: 0.1, far: 20 }}
    >
      <ambientLight intensity={0.6} color="#FFF4E6" />
      <directionalLight position={[-3, 4, 4]} intensity={2.1} color="#FFE7C6" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[3, 2, -3]} intensity={0.9} color="#F2E6D4" />
      <pointLight position={[0, -2, 2]} intensity={0.7} color="#C8A87C" />

      <Environment resolution={tier === 'high' ? 128 : 64} frames={1}>
        <mesh position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshBasicMaterial color="#FFF7E9" toneMapped={false} />
        </mesh>
        <mesh position={[-5, 1, 3]} rotation={[0, Math.PI / 2.6, 0]}>
          <planeGeometry args={[6, 5]} />
          <meshBasicMaterial color="#FFE6BE" toneMapped={false} />
        </mesh>
        <mesh position={[5, 0, -2]} rotation={[0, -Math.PI / 2.4, 0]}>
          <planeGeometry args={[5, 4]} />
          <meshBasicMaterial color="#EFE3D0" toneMapped={false} />
        </mesh>
      </Environment>

      <ProductGroup product={product} glass={glass} />

      <ContactShadows
        position={[0, -1.1, 0]}
        opacity={0.32}
        scale={6}
        blur={2.6}
        far={2.4}
        color="#5A4A33"
        frames={tier === 'low' ? 1 : Infinity}
        resolution={tier === 'high' ? 512 : 256}
      />

      <OrbitControls
        enabled={interactive}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.45}
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 3.1}
        maxPolarAngle={Math.PI / 1.75}
        autoRotate
        autoRotateSpeed={tier === 'low' ? 0.5 : 0.7}
        makeDefault
      />
    </Canvas>
  )
}
