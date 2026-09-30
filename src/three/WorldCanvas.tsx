import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Lightformer } from '@react-three/drei'
import { Suspense, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { pointer } from '../lib/pointer'
import { sound } from '../lib/audio'
import { useStory, type Mood } from '../store/story'

/**
 * Palette configurations for the 3D sculpture mapped to discipline moods.
 * Real-time chromatic, specular, and emissive parameters.
 */
interface MoodTheme {
  primary: string
  innerGlow: string
  iridescence: number
  ior: number
  roughness: number
  attenuation: string
  halo: string
}

const THEMES: Record<Mood, MoodTheme> = {
  noir: {
    primary: '#ffffff',
    innerGlow: '#cdaa6e',
    iridescence: 0.85,
    ior: 1.55,
    roughness: 0.04,
    attenuation: '#f6d89b',
    halo: '#cdaa6e',
  },
  hair: {
    primary: '#fbf7ee',
    innerGlow: '#dcb878',
    iridescence: 0.9,
    ior: 1.58,
    roughness: 0.05,
    attenuation: '#e5be79',
    halo: '#dcb878',
  },
  color: {
    primary: '#fff0f8',
    innerGlow: '#d946ef',
    iridescence: 1.0,
    ior: 1.65,
    roughness: 0.03,
    attenuation: '#ec4899',
    halo: '#a855f7',
  },
  skin: {
    primary: '#fff5f0',
    innerGlow: '#fb923c',
    iridescence: 0.65,
    ior: 1.48,
    roughness: 0.08,
    attenuation: '#fca5a5',
    halo: '#f97316',
  },
  makeup: {
    primary: '#fff1f2',
    innerGlow: '#e11d48',
    iridescence: 0.95,
    ior: 1.6,
    roughness: 0.04,
    attenuation: '#fb7185',
    halo: '#e11d48',
  },
  bridal: {
    primary: '#ffffff',
    innerGlow: '#38bdf8',
    iridescence: 1.0,
    ior: 1.7,
    roughness: 0.02,
    attenuation: '#bae6fd',
    halo: '#93c5fd',
  },
  gold: {
    primary: '#fffdf5',
    innerGlow: '#f59e0b',
    iridescence: 0.9,
    ior: 1.62,
    roughness: 0.05,
    attenuation: '#fbbf24',
    halo: '#d97706',
  },
  calm: {
    primary: '#f8fafc',
    innerGlow: '#94a3b8',
    iridescence: 0.5,
    ior: 1.5,
    roughness: 0.1,
    attenuation: '#cbd5e1',
    halo: '#64748b',
  },
}

/**
 * The Central Couture Glass Sculpture.
 * An interlocking Möbius Torus Knot sculpture housing an inner faceted radiant gem,
 * surrounded by orbital gold rings.
 */
function SculpturalObject() {
  const outerMeshRef = useRef<THREE.Mesh>(null)
  const innerCoreRef = useRef<THREE.Mesh>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  const activeMood = useStory((s) => s.activeMood)
  const scrollProgress = useStory((s) => s.scrollProgress)
  const scrollVelocity = useStory((s) => s.scrollVelocity)
  const transformationProgress = useStory((s) => s.transformationProgress)
  const setCursor = useStory((s) => s.setCursor)

  const [hovered, setHovered] = useState(false)
  const pulseRef = useRef(0)

  // Current theme derived from activeMood
  const theme = THEMES[activeMood] || THEMES.noir

  // Materials with smooth lerping in useFrame
  const outerMatRef = useRef<THREE.MeshPhysicalMaterial>(null)
  const innerMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const haloMatRef = useRef<THREE.MeshStandardMaterial>(null)

  const handlePointerDown = () => {
    pulseRef.current = 1.0
    sound.playChime(659.25)
  }

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    const pX = pointer.sx
    const pY = pointer.sy

    // Decay interactive click pulse
    if (pulseRef.current > 0) {
      pulseRef.current = Math.max(0, pulseRef.current - delta * 2.5)
    }

    // Smooth physics & positioning based on scroll progress
    // In Chapter 03 (Explore ~ 0.25 - 0.45), shift sculpture slightly to the right to frame typography
    const targetX = scrollProgress > 0.18 && scrollProgress < 0.65 ? 1.0 + pX * 0.4 : pX * 0.5
    const targetY = -pY * 0.35 + Math.sin(time * 0.8) * 0.08
    const targetZ = scrollProgress > 0.8 ? -1.0 : 0.0

    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.06)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.06)
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.06)

      // Base rotation + pointer influence + velocity burst
      const vel = Math.abs(scrollVelocity) * 2.0
      groupRef.current.rotation.y = time * 0.25 + pX * 0.6 + scrollProgress * Math.PI * 2
      groupRef.current.rotation.x = pY * 0.4 + Math.sin(time * 0.4) * 0.15 + vel * 0.1
      groupRef.current.rotation.z = transformationProgress * Math.PI * 1.5
    }

    // Outer Glass Sculpture self-rotation
    if (outerMeshRef.current) {
      outerMeshRef.current.rotation.x = time * 0.15
      outerMeshRef.current.rotation.z = time * 0.1
      const scaleBase = 1.0 + (hovered ? 0.08 : 0) + pulseRef.current * 0.12
      outerMeshRef.current.scale.setScalar(scaleBase)
    }

    // Inner Radiant Core counter-rotation and breathing
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -time * 0.6
      innerCoreRef.current.rotation.x = time * 0.4
      const coreScale = 0.5 + Math.sin(time * 2.5) * 0.05 + pulseRef.current * 0.25
      innerCoreRef.current.scale.setScalar(coreScale)
    }

    // Orbital Halos
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.3 + 0.5
      ring1Ref.current.rotation.y = time * 0.2
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -time * 0.25 - 0.7
      ring2Ref.current.rotation.z = time * 0.35
    }

    // Smoothly interpolate material properties to active discipline mood
    if (outerMatRef.current) {
      const targetCol = new THREE.Color(theme.primary)
      const targetAtt = new THREE.Color(theme.attenuation)
      outerMatRef.current.color.lerp(targetCol, 0.08)
      outerMatRef.current.attenuationColor.lerp(targetAtt, 0.08)
      outerMatRef.current.roughness = THREE.MathUtils.lerp(
        outerMatRef.current.roughness,
        theme.roughness + (1 - transformationProgress) * 0.06,
        0.08
      )
      outerMatRef.current.iridescence = THREE.MathUtils.lerp(
        outerMatRef.current.iridescence,
        theme.iridescence,
        0.08
      )
      outerMatRef.current.ior = THREE.MathUtils.lerp(outerMatRef.current.ior, theme.ior, 0.08)
    }

    if (innerMatRef.current) {
      const targetGlow = new THREE.Color(theme.innerGlow)
      innerMatRef.current.color.lerp(targetGlow, 0.08)
      innerMatRef.current.emissive.lerp(targetGlow, 0.08)
      innerMatRef.current.emissiveIntensity =
        1.5 + Math.sin(time * 3.0) * 0.5 + pulseRef.current * 3.0
    }

    if (haloMatRef.current) {
      const targetHalo = new THREE.Color(theme.halo)
      haloMatRef.current.color.lerp(targetHalo, 0.08)
      haloMatRef.current.emissive.lerp(targetHalo, 0.08)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Outer Prismatic Liquid Glass Ribbon (Interlocking Torus Knot) */}
      <mesh
        ref={outerMeshRef}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          setCursor('explore', 'RESONATE')
        }}
        onPointerOut={() => {
          setHovered(false)
          setCursor('default')
        }}
        onPointerDown={handlePointerDown}
      >
        <torusKnotGeometry args={[1.1, 0.3, 128, 32, 2, 3]} />
        <meshPhysicalMaterial
          ref={outerMatRef}
          color={theme.primary}
          metalness={0.05}
          roughness={theme.roughness}
          transmission={0.92}
          thickness={1.8}
          ior={theme.ior}
          iridescence={theme.iridescence}
          iridescenceIOR={1.45}
          iridescenceThicknessRange={[100, 400]}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
          attenuationColor={theme.attenuation}
          attenuationDistance={1.2}
          transparent
          envMapIntensity={2.2}
        />
      </mesh>

      {/* Inner Radiant Diamond Gem (Octahedron) */}
      <mesh ref={innerCoreRef}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          ref={innerMatRef}
          color={theme.innerGlow}
          emissive={theme.innerGlow}
          emissiveIntensity={2.0}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Orbital Ring 1: Inner Gold Filigree */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.75, 0.012, 16, 96]} />
        <meshStandardMaterial
          ref={haloMatRef}
          color={theme.halo}
          emissive={theme.halo}
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={1.0}
        />
      </mesh>

      {/* Orbital Ring 2: Outer Inclined Ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.05, 0.01, 16, 96]} />
        <meshStandardMaterial
          color="#dcb878"
          emissive="#dcb878"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={1.0}
        />
      </mesh>
    </group>
  )
}

/**
 * High-performance, GPU-rendered ambient stardust field.
 * Gentle celestial motes that drift around the sculpture.
 */
function CosmicStardust({ count = 350 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)

    const palette = ['#ffecc7', '#f6d89b', '#cdaa6e', '#fef9c3', '#cbd5e1']

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      const radius = 2.0 + Math.random() * 5.0
      const theta = Math.random() * Math.PI * 2
      const phi = (Math.random() - 0.5) * Math.PI

      pos[idx] = radius * Math.cos(theta) * Math.cos(phi)
      pos[idx + 1] = radius * Math.sin(phi) * 1.2
      pos[idx + 2] = radius * Math.sin(theta) * Math.cos(phi)

      const color = new THREE.Color(palette[Math.floor(Math.random() * palette.length)])
      cols[idx] = color.r
      cols[idx + 1] = color.g
      cols[idx + 2] = color.b
    }

    return { positions: pos, colors: cols }
  }, [count])

  // Circular glow texture for soft particle rendering
  const dotTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.3, 'rgba(254,240,199,0.8)')
    grad.addColorStop(0.8, 'rgba(205,170,110,0.2)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 32, 32)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.getElapsedTime()
    pointsRef.current.rotation.y = time * 0.03 + pointer.sx * 0.05
    pointsRef.current.rotation.x = Math.sin(time * 0.02) * 0.05 + pointer.sy * 0.03
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        map={dotTexture || undefined}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </points>
  )
}

/**
 * Camera parallax rig that reacts smoothly to mouse tilt.
 */
function CameraRig() {
  const { camera } = useThree()

  useFrame(() => {
    const targetX = pointer.sx * 0.4
    const targetY = pointer.sy * 0.3
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05)
    camera.lookAt(0, 0, 0)
  })

  return null
}

/**
 * Procedural Studio Lighting Environment.
 * Uses Lightformers to generate rich studio caustics and highlights in WebGL memory
 * without requiring any external network or HDR downloads.
 */
function StudioEnvironment() {
  return (
    <Environment resolution={256}>
      <group rotation={[-Math.PI / 4, -0.3, 0]}>
        {/* Soft overhead key strip */}
        <Lightformer
          form="rect"
          intensity={4.5}
          color="#ffffff"
          position={[0, 6, -3]}
          scale={[10, 3, 1]}
          target={[0, 0, 0]}
        />
        {/* Warm golden rim accent */}
        <Lightformer
          form="circle"
          intensity={3.8}
          color="#f6d89b"
          position={[-6, 2, 2]}
          scale={4}
          target={[0, 0, 0]}
        />
        {/* Prismatic fill kick */}
        <Lightformer
          form="rect"
          intensity={2.5}
          color="#e0e7ff"
          position={[6, -2, -2]}
          scale={[6, 4, 1]}
          target={[0, 0, 0]}
        />
        {/* Floor bounce */}
        <Lightformer
          form="circle"
          intensity={2.0}
          color="#cdaa6e"
          position={[0, -5, 3]}
          scale={5}
          target={[0, 0, 0]}
        />
      </group>
    </Environment>
  )
}

/**
 * Main 3D World Canvas.
 * Mounts fixed behind the editorial story layers.
 */
export function WorldCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5.0], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <StudioEnvironment />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 6, 4]} intensity={2.2} color="#ffffff" />
          <pointLight position={[-4, -3, -2]} intensity={2.0} color="#f6d89b" />

          {/* Floating smooth motion for the sculpture */}
          <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.8}>
            <SculpturalObject />
          </Float>

          {/* Celestial stardust motes */}
          <CosmicStardust count={350} />
        </Suspense>
      </Canvas>
    </div>
  )
}
