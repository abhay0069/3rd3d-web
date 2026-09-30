import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { pointer, smoothPointer } from '../lib/pointer'
import { useStory, type Mood } from '../store/story'

/** Chromatic luxury lighting palettes for each story mood */
const MOOD_PALETTES: Record<
  Mood,
  {
    keyLight: string
    rimLight: string
    fillLight: string
    coreColor: string
    glassColor: string
    glassAttenuation: string
    dispersion: number
    roughness: number
    ior: number
  }
> = {
  noir: {
    keyLight: '#ffdfa8',
    rimLight: '#cdaa6e',
    fillLight: '#3a2a18',
    coreColor: '#f7d8a5',
    glassColor: '#ffffff',
    glassAttenuation: '#fdf6ea',
    dispersion: 0.08,
    roughness: 0.06,
    ior: 1.54,
  },
  hair: {
    keyLight: '#f5b072',
    rimLight: '#d97736',
    fillLight: '#4a250e',
    coreColor: '#f79a4d',
    glassColor: '#fff5ec',
    glassAttenuation: '#fde8d4',
    dispersion: 0.1,
    roughness: 0.1,
    ior: 1.52,
  },
  color: {
    keyLight: '#f472b6',
    rimLight: '#a855f7',
    fillLight: '#3b0764',
    coreColor: '#e879f9',
    glassColor: '#faf5ff',
    glassAttenuation: '#f3e8ff',
    dispersion: 0.18,
    roughness: 0.04,
    ior: 1.62,
  },
  skin: {
    keyLight: '#fed7aa',
    rimLight: '#f43f5e',
    fillLight: '#4c0519',
    coreColor: '#fecdd3',
    glassColor: '#fff1f2',
    glassAttenuation: '#ffe4e6',
    dispersion: 0.06,
    roughness: 0.12,
    ior: 1.48,
  },
  makeup: {
    keyLight: '#fb7185',
    rimLight: '#e11d48',
    fillLight: '#4c0519',
    coreColor: '#fda4af',
    glassColor: '#fff1f2',
    glassAttenuation: '#fecdd3',
    dispersion: 0.14,
    roughness: 0.05,
    ior: 1.58,
  },
  bridal: {
    keyLight: '#fef08a',
    rimLight: '#eab308',
    fillLight: '#422006',
    coreColor: '#fef9c3',
    glassColor: '#ffffff',
    glassAttenuation: '#fefce8',
    dispersion: 0.12,
    roughness: 0.04,
    ior: 1.56,
  },
  gold: {
    keyLight: '#fde047',
    rimLight: '#ca8a04',
    fillLight: '#451a03',
    coreColor: '#facc15',
    glassColor: '#fffbeb',
    glassAttenuation: '#fef3c7',
    dispersion: 0.12,
    roughness: 0.08,
    ior: 1.55,
  },
  calm: {
    keyLight: '#e2e8f0',
    rimLight: '#cbd5e1',
    fillLight: '#0f172a',
    coreColor: '#f8fafc',
    glassColor: '#ffffff',
    glassAttenuation: '#f1f5f9',
    dispersion: 0.05,
    roughness: 0.05,
    ior: 1.5,
  },
}

/**
 * Procedural Liquid Chromatic Prism:
 * A morphing crystal glass sphere that breathes with multi-octave harmonic waves,
 * capturing and refracting light like high-fashion digital art.
 */
function LiquidGlassSculpture() {
  const meshRef = useRef<THREE.Mesh>(null)
  const innerCoreRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const glassMatRef = useRef<THREE.MeshPhysicalMaterial>(null)
  const coreMatRef = useRef<THREE.MeshStandardMaterial>(null)

  const activeMood = useStory((s) => s.activeMood)
  const scrollProgress = useStory((s) => s.scrollProgress)
  const scrollVelocity = useStory((s) => s.scrollVelocity)

  // Subdivided icosahedron for fluid ripple deformation
  const { geometry, originalPositions } = useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(1.5, 48)
    const pos = geom.attributes.position
    const orig = new Float32Array(pos.count * 3)
    orig.set(pos.array)
    return { geometry: geom, originalPositions: orig }
  }, [])

  // Orbital halo ring geometry
  const haloGeometry = useMemo(() => new THREE.TorusGeometry(2.35, 0.024, 32, 128), [])

  // Target positions & scales for cinematic choreography
  const targetScale = useRef(1.0)
  const targetPos = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((state, delta) => {
    if (!meshRef.current || !glassMatRef.current || !coreMatRef.current) return
    smoothPointer(delta, 3.5)

    const time = state.clock.getElapsedTime()
    const pX = pointer.sx
    const pY = pointer.sy

    // Dynamic wave deformation on the liquid glass mesh
    const pos = geometry.attributes.position
    const count = pos.count
    const speed = 1.2 + Math.abs(scrollVelocity) * 2.0
    const amplitude = 0.16 + Math.abs(scrollVelocity) * 0.25

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      const ox = originalPositions[idx]
      const oy = originalPositions[idx + 1]
      const oz = originalPositions[idx + 2]

      // Spherical harmonic waves
      const u = Math.sin(ox * 2.5 + time * speed)
      const v = Math.cos(oy * 3.0 + time * (speed * 0.8))
      const w = Math.sin(oz * 2.2 + time * (speed * 1.1))
      const wave = (u + v + w) / 3.0

      const factor = 1.0 + wave * amplitude
      pos.setXYZ(i, ox * factor, oy * factor, oz * factor)
    }
    pos.needsUpdate = true
    geometry.computeVertexNormals()

    // Choreographed narrative camera track:
    // 01 ARRIVE (0 - 0.12): Centered, glowing majestic presence
    // 02 DISCOVER (0.12 - 0.28): Floats forward towards viewer, expands
    // 03 EXPLORE / SERVICES (0.28 - 0.46): Glides rightward to frame interactive type
    // 04 TRANSFORM (0.46 - 0.62): Fluid morphing central state
    // 05 ARCHIVE (0.62 - 0.78): Glides into deep background as floating celestial orb
    // 06 ARTISANS (0.78 - 0.88): Gentle leftward offset
    // 07 SANCTUARY (0.88 - 0.94): Central meditative scale
    // 08 BOOK (0.94 - 1.0): Settles as a serene halo at the bottom

    const p = scrollProgress
    if (p < 0.14) {
      targetScale.current = 1.0 + Math.sin(time * 0.8) * 0.04
      targetPos.current.set(pX * 0.3, pY * 0.2, 0)
    } else if (p < 0.3) {
      const t = (p - 0.14) / 0.16
      targetScale.current = THREE.MathUtils.lerp(1.0, 1.45, t)
      targetPos.current.set(pX * 0.4, pY * 0.3, THREE.MathUtils.lerp(0, 1.2, t))
    } else if (p < 0.48) {
      const t = (p - 0.3) / 0.18
      targetScale.current = THREE.MathUtils.lerp(1.45, 1.1, t)
      targetPos.current.set(THREE.MathUtils.lerp(0, 1.35, t) + pX * 0.2, pY * 0.2, 0.4)
    } else if (p < 0.64) {
      const t = (p - 0.48) / 0.16
      targetScale.current = 1.25 + Math.sin(time * 2.0) * 0.08
      targetPos.current.set(THREE.MathUtils.lerp(1.35, 0, t) + pX * 0.2, pY * 0.2, 0.2)
    } else if (p < 0.8) {
      const t = (p - 0.64) / 0.16
      targetScale.current = THREE.MathUtils.lerp(1.25, 0.75, t)
      targetPos.current.set(0, -0.3, THREE.MathUtils.lerp(0.2, -2.0, t))
    } else if (p < 0.92) {
      targetScale.current = 0.9
      targetPos.current.set(-1.2 + pX * 0.2, pY * 0.2, -0.5)
    } else {
      const t = (p - 0.92) / 0.08
      targetScale.current = THREE.MathUtils.lerp(0.9, 0.55, t)
      targetPos.current.set(0, THREE.MathUtils.lerp(-0.2, -1.6, t), -1.0)
    }

    // Smooth lerp scale & position
    meshRef.current.position.lerp(targetPos.current, 0.06)
    const currentS = meshRef.current.scale.x
    const nextS = THREE.MathUtils.lerp(currentS, targetScale.current, 0.06)
    meshRef.current.scale.set(nextS, nextS, nextS)

    // Fluid rotation reacting to time and pointer
    meshRef.current.rotation.x = time * 0.18 + pY * 0.45
    meshRef.current.rotation.y = time * 0.24 + pX * 0.55

    // Halo ring follows and orbits with tilt
    if (ringRef.current) {
      ringRef.current.position.copy(meshRef.current.position)
      ringRef.current.rotation.x = time * -0.15 + 0.6 + pY * 0.2
      ringRef.current.rotation.y = time * 0.3 + pX * 0.3
      const ringScale = nextS * (1.1 + Math.sin(time * 0.5) * 0.05)
      ringRef.current.scale.set(ringScale, ringScale, ringScale)
    }

    // Inner glowing core follows inside
    if (innerCoreRef.current) {
      innerCoreRef.current.position.copy(meshRef.current.position)
      const coreScale = nextS * (0.42 + Math.sin(time * 1.5) * 0.04)
      innerCoreRef.current.scale.set(coreScale, coreScale, coreScale)
    }

    // Smooth material mood transition
    const palette = MOOD_PALETTES[activeMood] || MOOD_PALETTES.noir
    const lerpSpeed = 0.06

    glassMatRef.current.roughness = THREE.MathUtils.lerp(
      glassMatRef.current.roughness,
      palette.roughness,
      lerpSpeed
    )
    glassMatRef.current.ior = THREE.MathUtils.lerp(glassMatRef.current.ior, palette.ior, lerpSpeed)

    if (glassMatRef.current.attenuationColor) {
      glassMatRef.current.attenuationColor.lerp(new THREE.Color(palette.glassAttenuation), lerpSpeed)
    }

    coreMatRef.current.color.lerp(new THREE.Color(palette.coreColor), lerpSpeed)
    coreMatRef.current.emissive.lerp(new THREE.Color(palette.coreColor), lerpSpeed)
    coreMatRef.current.emissiveIntensity = 2.2 + Math.sin(time * 2.0) * 0.6
  })

  return (
    <group>
      {/* Outer Liquid Glass Sculpture */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          ref={glassMatRef}
          transmission={0.96}
          thickness={1.8}
          roughness={0.06}
          ior={1.54}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
          reflectivity={0.92}
          attenuationDistance={1.2}
          attenuationColor="#fdf6ea"
          color="#ffffff"
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Luminous Pulsing Inner Core */}
      <mesh ref={innerCoreRef}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial
          ref={coreMatRef}
          color="#f7d8a5"
          emissive="#f7d8a5"
          emissiveIntensity={2.5}
          roughness={0.3}
        />
      </mesh>

      {/* Orbital Refracting Halo Ring */}
      <mesh ref={ringRef} geometry={haloGeometry}>
        <meshPhysicalMaterial
          transmission={0.88}
          thickness={0.5}
          roughness={0.12}
          ior={1.6}
          clearcoat={0.9}
          color="#fef3c7"
          emissive="#cdaa6e"
          emissiveIntensity={0.35}
        />
      </mesh>
    </group>
  )
}

/**
 * Celestial Stardust Particles:
 * 700 organic, soft shimmering particles that drift in zero-gravity,
 * swirl with scroll velocity, and gently scatter around the user's cursor.
 */
function CosmicStardustCloud({ count = 750 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const scrollVelocity = useStory((s) => s.scrollVelocity)

  const { positions, originalPositions, randomFactors, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const orig = new Float32Array(count * 3)
    const rnd = new Float32Array(count * 3)
    const cols = new Float32Array(count * 3)

    const palette = ['#ffecc7', '#f6d89b', '#cdaa6e', '#fef9c3', '#fed7aa']

    for (let i = 0; i < count; i++) {
      const idx = i * 3

      // Toroidal orbital cloud distribution
      const radius = 1.4 + Math.pow(Math.random(), 0.75) * 6.5
      const theta = Math.random() * Math.PI * 2
      const phi = (Math.random() - 0.5) * Math.PI * 0.9

      const x = radius * Math.cos(theta) * Math.cos(phi)
      const y = radius * Math.sin(phi) * 1.1
      const z = radius * Math.sin(theta) * Math.cos(phi) * 0.85

      pos[idx] = x
      pos[idx + 1] = y
      pos[idx + 2] = z

      orig[idx] = x
      orig[idx + 1] = y
      orig[idx + 2] = z

      rnd[idx] = Math.random() * 2 - 1
      rnd[idx + 1] = Math.random() * 2 - 1
      rnd[idx + 2] = 0.5 + Math.random() * 1.5

      const c = new THREE.Color(palette[Math.floor(Math.random() * palette.length)])
      cols[idx] = c.r
      cols[idx + 1] = c.g
      cols[idx + 2] = c.b
    }

    return { positions: pos, originalPositions: orig, randomFactors: rnd, colors: cols }
  }, [count])

  // Soft circular glow sprite for particles
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
    grad.addColorStop(0.2, 'rgba(254, 240, 199, 0.9)')
    grad.addColorStop(0.55, 'rgba(205, 170, 110, 0.35)')
    grad.addColorStop(1, 'rgba(205, 170, 110, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.getElapsedTime()
    const pX = pointer.sx
    const pY = pointer.sy

    const pos = pointsRef.current.geometry.attributes.position
    const velInfluence = Math.min(2.5, Math.abs(scrollVelocity) * 3.5)

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      const ox = originalPositions[idx]
      const oy = originalPositions[idx + 1]
      const oz = originalPositions[idx + 2]
      const factor = randomFactors[idx + 2]

      // Gentle orbital harmonic drift
      const angle = time * 0.12 * factor
      const cosA = Math.cos(angle)
      const sinA = Math.sin(angle)

      let x = ox * cosA - oz * sinA
      let z = ox * sinA + oz * cosA
      let y = oy + Math.sin(time * 0.8 + ox) * 0.15

      // Cursor dispersion push
      const dx = x - pX * 3.0
      const dy = y - pY * 3.0
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 1.8 && dist > 0.05) {
        const force = (1.8 - dist) * 0.3
        x += (dx / dist) * force
        y += (dy / dist) * force
      }

      // Scroll turbulence
      if (velInfluence > 0.01) {
        x += Math.sin(time * 8.0 + idx) * velInfluence * 0.08
        y += Math.cos(time * 8.0 + idx) * velInfluence * 0.08
      }

      pos.setXYZ(i, x, y, z)
    }
    pos.needsUpdate = true

    pointsRef.current.rotation.y = time * 0.02 + pX * 0.05
    pointsRef.current.rotation.x = pY * 0.04
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
        map={particleTexture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.85}
      />
    </points>
  )
}

/** Dynamic three-point atmospheric lighting that morphs with the narrative moods */
function WorldLights() {
  const activeMood = useStory((s) => s.activeMood)
  const keyLightRef = useRef<THREE.PointLight>(null)
  const rimLightRef = useRef<THREE.PointLight>(null)
  const ambientRef = useRef<THREE.AmbientLight>(null)

  useFrame(() => {
    const palette = MOOD_PALETTES[activeMood] || MOOD_PALETTES.noir
    const pX = pointer.sx
    const pY = pointer.sy

    if (keyLightRef.current) {
      keyLightRef.current.color.lerp(new THREE.Color(palette.keyLight), 0.06)
      keyLightRef.current.position.set(4 + pX * 2.5, 3 + pY * 2.5, 4)
    }
    if (rimLightRef.current) {
      rimLightRef.current.color.lerp(new THREE.Color(palette.rimLight), 0.06)
      rimLightRef.current.position.set(-4 - pX * 2, -3 - pY * 2, -3)
    }
    if (ambientRef.current) {
      ambientRef.current.color.lerp(new THREE.Color(palette.fillLight), 0.06)
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.7} />
      <pointLight ref={keyLightRef} intensity={3.5} distance={16} decay={2} />
      <pointLight ref={rimLightRef} intensity={2.8} distance={14} decay={2} />
      <directionalLight position={[0, 6, 2]} intensity={1.2} color="#ffffff" />
    </>
  )
}

/** Camera gentle responsive parallax rig */
function CameraRig() {
  useFrame(({ camera }) => {
    const targetX = pointer.sx * 0.4
    const targetY = pointer.sy * 0.3
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export function WorldCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.75]}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <WorldLights />
          <LiquidGlassSculpture />
          <CosmicStardustCloud count={750} />
        </Suspense>
      </Canvas>
    </div>
  )
}
