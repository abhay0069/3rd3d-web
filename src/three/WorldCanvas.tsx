import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { pointer, smoothPointer } from '../lib/pointer'
import { useStory, type Mood } from '../store/story'

/** Mood lighting palette configuration */
const MOOD_PALETTES: Record<
  Mood,
  { keyLight: string; rimLight: string; ambient: string; sculpture: string; roughness: number; metalness: number }
> = {
  noir: {
    keyLight: '#f6d89b',
    rimLight: '#8a6234',
    ambient: '#120f0c',
    sculpture: '#dcb878',
    roughness: 0.22,
    metalness: 0.85,
  },
  hair: {
    keyLight: '#e49b55',
    rimLight: '#783818',
    ambient: '#1a1008',
    sculpture: '#c97a38',
    roughness: 0.35,
    metalness: 0.65,
  },
  color: {
    keyLight: '#f36892',
    rimLight: '#6e2b9c',
    ambient: '#1a0c18',
    sculpture: '#e69078',
    roughness: 0.15,
    metalness: 0.9,
  },
  skin: {
    keyLight: '#fed7c3',
    rimLight: '#c28b74',
    ambient: '#16100d',
    sculpture: '#f2c9b4',
    roughness: 0.42,
    metalness: 0.3,
  },
  makeup: {
    keyLight: '#ff4d6d',
    rimLight: '#a01a38',
    ambient: '#18080c',
    sculpture: '#d96275',
    roughness: 0.2,
    metalness: 0.8,
  },
  bridal: {
    keyLight: '#fff5e4',
    rimLight: '#d4af37',
    ambient: '#151410',
    sculpture: '#fbf0dc',
    roughness: 0.18,
    metalness: 0.75,
  },
  gold: {
    keyLight: '#ffe8a3',
    rimLight: '#9e7328',
    ambient: '#141006',
    sculpture: '#d4af37',
    roughness: 0.24,
    metalness: 0.88,
  },
  calm: {
    keyLight: '#e8c992',
    rimLight: '#624921',
    ambient: '#0d0b08',
    sculpture: '#c59d5f',
    roughness: 0.3,
    metalness: 0.7,
  },
}

/**
 * Procedural Organic Sculpture: "The Form of Transformation"
 * Represents hair, liquid grace, human silhouette and architectural light.
 */
function TransformationSculpture() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  const currentMood = useStory((s) => s.activeMood)
  const scrollProgress = useStory((s) => s.scrollProgress)
  const scrollVelocity = useStory((s) => s.scrollVelocity)

  // Algorithmic organic geometry combining flowing hair torus knot with wave displacements
  const geometry = useMemo(() => {
    // Torus knot with subtle organic proportions
    const geom = new THREE.TorusKnotGeometry(1.6, 0.46, 160, 28, 2, 3)
    return geom
  }, [])

  // Target values for smooth lerp
  const targetScale = useRef(1)
  const targetZ = useRef(0)
  const targetRotation = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return
    smoothPointer(delta, 3.2)

    const time = state.clock.getElapsedTime()
    const pX = pointer.sx
    const pY = pointer.sy

    // Camera / scroll choreography:
    // ARRIVE (0 - 0.12): majestic center stage
    // DISCOVER (0.12 - 0.28): plunges forward into the camera, scale expands
    // EXPLORE (0.28 - 0.45): shifts slightly to the right, morphs with services
    // TRANSFORM (0.45 - 0.62): central fluid ripple
    // ARCHIVE (0.62 - 0.78): recedes in depth as a background portal
    // ARTISANS (0.78 - 0.90): gentle orbital drift
    // BOOK (0.90 - 1.0): settles to calm small scale

    let s = 1.0
    let z = 0
    let xOffset = 0
    let yOffset = 0

    if (scrollProgress < 0.12) {
      s = 1.0 - scrollProgress * 1.5
      z = scrollProgress * 2.0
      xOffset = pX * 0.4
      yOffset = pY * 0.4
    } else if (scrollProgress < 0.3) {
      const t = (scrollProgress - 0.12) / 0.18
      s = 0.8 + t * 0.6
      z = 2.0 + t * 3.5
      xOffset = pX * 0.6 - t * 0.8
    } else if (scrollProgress < 0.5) {
      const t = (scrollProgress - 0.3) / 0.2
      s = 1.1 - t * 0.3
      z = 1.5 - t * 1.0
      xOffset = 1.2 - t * 0.4 + pX * 0.5
    } else if (scrollProgress < 0.7) {
      const t = (scrollProgress - 0.5) / 0.2
      s = 0.9 + Math.sin(t * Math.PI) * 0.3
      z = 0.5 + t * 0.5
      xOffset = pX * 0.3
    } else if (scrollProgress < 0.88) {
      const t = (scrollProgress - 0.7) / 0.18
      s = 0.75 - t * 0.2
      z = -1.2 - t * 1.5
      xOffset = -1.4 + t * 0.6 + pX * 0.3
    } else {
      const t = (scrollProgress - 0.88) / 0.12
      s = 0.55 - t * 0.2
      z = -2.5
      xOffset = pX * 0.2
      yOffset = -0.5
    }

    // Add responsiveness to scroll velocity
    const velocityKick = Math.min(2.5, Math.abs(scrollVelocity) * 3.0)
    s += velocityKick * 0.08

    targetScale.current = s
    targetZ.current = z

    // Lerp transform
    meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.08)
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, xOffset, 0.06)
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, yOffset, 0.06)
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ.current, 0.06)

    // Gentle rotation influenced by time + cursor chase
    targetRotation.current.x = time * 0.15 + pY * 0.6
    targetRotation.current.y = time * 0.22 + pX * 0.8 + scrollProgress * Math.PI * 2

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotation.current.x, 0.05)
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotation.current.y, 0.05)
    meshRef.current.rotation.z = Math.sin(time * 0.12) * 0.2

    // Material color interpolation according to mood
    const palette = MOOD_PALETTES[currentMood] || MOOD_PALETTES.noir
    const targetColor = new THREE.Color(palette.sculpture)
    materialRef.current.color.lerp(targetColor, 0.05)
    materialRef.current.roughness = THREE.MathUtils.lerp(materialRef.current.roughness, palette.roughness, 0.05)
    materialRef.current.metalness = THREE.MathUtils.lerp(materialRef.current.metalness, palette.metalness, 0.05)
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        ref={materialRef}
        color="#dcb878"
        roughness={0.22}
        metalness={0.85}
        wireframe={false}
      />
    </mesh>
  )
}

/**
 * Beauty Particles Cloud:
 * 750 floating reflective cosmetic motes & studio lighting dust that respond to cursor and velocity.
 */
function BeautyDustCloud({ count = 650 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const scrollVelocity = useStory((s) => s.scrollVelocity)

  const { positions, originalPositions, randomFactors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const orig = new Float32Array(count * 3)
    const rand = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      // Distribute in a spherical cylinder around the camera
      const radius = 2.5 + Math.random() * 6.5
      const theta = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * 10

      const x = Math.cos(theta) * radius
      const z = (Math.random() - 0.5) * 8

      pos[idx] = orig[idx] = x
      pos[idx + 1] = orig[idx + 1] = y
      pos[idx + 2] = orig[idx + 2] = z

      rand[idx] = 0.5 + Math.random() * 0.8 // speed factor
      rand[idx + 1] = Math.random() * Math.PI * 2 // phase
      rand[idx + 2] = 0.4 + Math.random() * 0.8 // size
    }
    return { positions: pos, originalPositions: orig, randomFactors: rand }
  }, [count])

  // Custom particle texture
  const particleTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0, 'rgba(255, 245, 220, 1.0)')
    grad.addColorStop(0.2, 'rgba(235, 195, 125, 0.75)')
    grad.addColorStop(0.6, 'rgba(180, 130, 60, 0.2)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    const time = state.clock.getElapsedTime()
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const pos = posAttr.array as Float32Array

    const pX = pointer.sx * 3.5
    const pY = pointer.sy * 3.5
    const vel = Math.abs(scrollVelocity) * 6.0

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      const speed = randomFactors[idx]
      const phase = randomFactors[idx + 1]

      // Natural gentle upward drift
      let y = pos[idx + 1] + (0.35 * speed + vel * 0.6) * delta
      if (y > 5.5) y = -5.5

      // Floating wave motion
      const xOrig = originalPositions[idx]
      const zOrig = originalPositions[idx + 2]
      let x = xOrig + Math.sin(time * 0.4 * speed + phase) * 0.4
      let z = zOrig + Math.cos(time * 0.3 * speed + phase) * 0.4

      // Cursor magnetic push
      const dx = x - pX
      const dy = y - pY
      const dist = Math.hypot(dx, dy)
      if (dist < 1.8 && dist > 0.01) {
        const force = (1.8 - dist) * 0.8
        x += (dx / dist) * force
        y += (dy / dist) * force
      }

      pos[idx] = x
      pos[idx + 1] = y
      pos[idx + 2] = z
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        map={particleTexture || undefined}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#f2dba6"
        opacity={0.8}
      />
    </points>
  )
}

/** Mood responsive lights inside the 3D world */
function WorldLights() {
  const mood = useStory((s) => s.activeMood)
  const palette = MOOD_PALETTES[mood] || MOOD_PALETTES.noir

  const keyLightRef = useRef<THREE.DirectionalLight>(null)
  const rimLightRef = useRef<THREE.PointLight>(null)
  const ambientRef = useRef<THREE.AmbientLight>(null)

  useFrame(() => {
    if (!keyLightRef.current || !rimLightRef.current || !ambientRef.current) return
    keyLightRef.current.color.lerp(new THREE.Color(palette.keyLight), 0.06)
    rimLightRef.current.color.lerp(new THREE.Color(palette.rimLight), 0.06)
    ambientRef.current.color.lerp(new THREE.Color(palette.ambient), 0.06)

    // Cursor shifts light direction slightly
    keyLightRef.current.position.x = 4 + pointer.sx * 3.0
    keyLightRef.current.position.y = 5 + pointer.sy * 2.0
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={1.2} />
      <directionalLight ref={keyLightRef} position={[4, 5, 4]} intensity={2.8} />
      <pointLight ref={rimLightRef} position={[-4, -3, -2]} intensity={3.5} />
      <pointLight position={[0, 4, -4]} color="#ffffff" intensity={0.9} />
    </>
  )
}

/** Camera Controller that responds to pointer tilt */
function CameraRig() {
  const { camera } = useThree()

  useFrame(() => {
    // Elegant subtle camera tilt chasing mouse
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.sx * 0.45, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.sy * 0.35, 0.05)
    camera.lookAt(0, 0, 0)
  })

  return null
}

export function WorldCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <WorldLights />
          <CameraRig />
          <TransformationSculpture />
          <BeautyDustCloud count={typeof window !== 'undefined' && window.innerWidth < 768 ? 280 : 650} />
        </Suspense>
      </Canvas>
    </div>
  )
}
