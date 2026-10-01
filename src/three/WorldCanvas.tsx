import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Lightformer } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { pointer } from '../lib/pointer'
import { PhoenixModel } from './PhoenixModel'

/**
 * Procedural Wingtip Embers & Celestial Stardust
 * Golden trails streaming through the atmosphere.
 */
function PhoenixStardust({ count = 350 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)
    const palette = ['#ffecc7', '#f6d89b', '#f59e0b', '#fbbf24', '#ffffff', '#fed7aa']

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      const radius = 1.2 + Math.random() * 5.5
      const theta = Math.random() * Math.PI * 2
      const phi = (Math.random() - 0.5) * Math.PI

      pos[idx] = radius * Math.cos(theta) * Math.cos(phi)
      pos[idx + 1] = radius * Math.sin(phi) * 1.3
      pos[idx + 2] = radius * Math.sin(theta) * Math.cos(phi)

      const color = new THREE.Color(palette[Math.floor(Math.random() * palette.length)])
      cols[idx] = color.r
      cols[idx + 1] = color.g
      cols[idx + 2] = color.b
    }

    return { positions: pos, colors: cols }
  }, [count])

  // Soft circular glow sprite
  const dotTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.3, 'rgba(254,240,199,0.85)')
    grad.addColorStop(0.7, 'rgba(245,158,11,0.25)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 32, 32)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.getElapsedTime()
    pointsRef.current.rotation.y = time * 0.04 + pointer.sx * 0.06
    pointsRef.current.rotation.x = Math.sin(time * 0.02) * 0.05 + pointer.sy * 0.04
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.13}
        vertexColors
        map={dotTexture || undefined}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.85}
      />
    </points>
  )
}

/**
 * Camera parallax controller
 */
function CameraRig() {
  const { camera } = useThree()

  useFrame(() => {
    const targetX = pointer.sx * 0.35
    const targetY = pointer.sy * 0.25
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05)
    camera.lookAt(0, 0, 0)
  })

  return null
}

/**
 * Procedural Studio Environment for pristine crystal refraction
 */
function StudioEnvironment() {
  return (
    <Environment resolution={256}>
      <group rotation={[-Math.PI / 4, -0.3, 0]}>
        {/* Soft overhead key strip */}
        <Lightformer
          form="rect"
          intensity={5.0}
          color="#ffffff"
          position={[0, 6, -3]}
          scale={[10, 3, 1]}
          target={[0, 0, 0]}
        />
        {/* Warm golden rim accent */}
        <Lightformer
          form="circle"
          intensity={4.2}
          color="#f6d89b"
          position={[-6, 2, 2]}
          scale={4}
          target={[0, 0, 0]}
        />
        {/* Prismatic fill kick */}
        <Lightformer
          form="rect"
          intensity={3.0}
          color="#bae6fd"
          position={[6, -2, -2]}
          scale={[6, 4, 1]}
          target={[0, 0, 0]}
        />
        {/* Floor bounce */}
        <Lightformer
          form="circle"
          intensity={2.2}
          color="#f59e0b"
          position={[0, -5, 3]}
          scale={5}
          target={[0, 0, 0]}
        />
      </group>
    </Environment>
  )
}

/**
 * Main 3D World Canvas housing the Reimagined Phoenix
 */
export function WorldCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <StudioEnvironment />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 6, 4]} intensity={2.4} color="#ffffff" />
          <pointLight position={[-4, -3, -2]} intensity={2.2} color="#f6d89b" />

          {/* Organic Floating Flight */}
          <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.7}>
            <PhoenixModel />
          </Float>

          {/* Golden Stardust & Embers */}
          <PhoenixStardust count={380} />
        </Suspense>
      </Canvas>
    </div>
  )
}
