import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { pointer } from '../lib/pointer'
import { sound } from '../lib/audio'
import { useStory, type Mood } from '../store/story'

/**
 * Elemental plumage themes for the Phoenix corresponding to narrative chapters
 */
interface PhoenixTheme {
  primary: string
  featherEdge: string
  coreGlow: string
  trailColor: string
  ior: number
  iridescence: number
}

const PHOENIX_THEMES: Record<Mood, PhoenixTheme> = {
  noir: {
    primary: '#fffbf0',
    featherEdge: '#cdaa6e',
    coreGlow: '#f59e0b',
    trailColor: '#fbbf24',
    ior: 1.55,
    iridescence: 0.85,
  },
  hair: {
    primary: '#fff7ed',
    featherEdge: '#dcb878',
    coreGlow: '#ea580c',
    trailColor: '#f97316',
    ior: 1.58,
    iridescence: 0.9,
  },
  color: {
    primary: '#fdf4ff',
    featherEdge: '#c084fc',
    coreGlow: '#ec4899',
    trailColor: '#d946ef',
    ior: 1.68,
    iridescence: 1.0,
  },
  skin: {
    primary: '#fff1f2',
    featherEdge: '#fb7185',
    coreGlow: '#f43f5e',
    trailColor: '#fda4af',
    ior: 1.5,
    iridescence: 0.75,
  },
  makeup: {
    primary: '#fff1f2',
    featherEdge: '#e11d48',
    coreGlow: '#be123c',
    trailColor: '#f43f5e',
    ior: 1.62,
    iridescence: 0.95,
  },
  bridal: {
    primary: '#ffffff',
    featherEdge: '#7dd3fc',
    coreGlow: '#38bdf8',
    trailColor: '#93c5fd',
    ior: 1.7,
    iridescence: 1.0,
  },
  gold: {
    primary: '#fffdf5',
    featherEdge: '#fbbf24',
    coreGlow: '#f59e0b',
    trailColor: '#fde047',
    ior: 1.6,
    iridescence: 0.9,
  },
  calm: {
    primary: '#f8fafc',
    featherEdge: '#94a3b8',
    coreGlow: '#64748b',
    trailColor: '#cbd5e1',
    ior: 1.52,
    iridescence: 0.6,
  },
}

/**
 * Procedural Crystalline Phoenix Sculpture.
 * Features articulated crystalline wings that flap with harmonic fluid physics,
 * a glowing solar core, sweeping tail plumes, and banking aerodynamics that track cursor & scroll.
 */
export function PhoenixModel() {
  const rootRef = useRef<THREE.Group>(null)
  const leftWingRef = useRef<THREE.Group>(null)
  const rightWingRef = useRef<THREE.Group>(null)
  const leftFeathers = useRef<THREE.Mesh[]>([])
  const rightFeathers = useRef<THREE.Mesh[]>([])
  const tailPlumes = useRef<THREE.Mesh[]>([])
  const coreRef = useRef<THREE.Mesh>(null)

  const activeMood = useStory((s) => s.activeMood)
  const scrollProgress = useStory((s) => s.scrollProgress)
  const scrollVelocity = useStory((s) => s.scrollVelocity)
  const setCursor = useStory((s) => s.setCursor)

  const [hovered, setHovered] = useState(false)
  const pulseRef = useRef(0)

  const theme = PHOENIX_THEMES[activeMood] || PHOENIX_THEMES.noir

  // Materials with dynamic interpolation
  const glassMatRef = useRef<THREE.MeshPhysicalMaterial>(null)
  const goldSpineMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const coreMatRef = useRef<THREE.MeshStandardMaterial>(null)

  // Geometries for feathers (tapered crystalline facets)
  const featherGeom = useMemo(() => {
    const geom = new THREE.ConeGeometry(0.18, 1.4, 4)
    geom.rotateX(Math.PI / 2)
    geom.scale(1.0, 0.22, 1.0)
    return geom
  }, [])

  const tailGeom = useMemo(() => {
    const geom = new THREE.ConeGeometry(0.12, 2.8, 4)
    geom.rotateX(Math.PI / 2)
    geom.scale(1.0, 0.18, 1.0)
    return geom
  }, [])

  const handlePointerDown = () => {
    pulseRef.current = 1.0
    sound.playChime(784)
  }

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    const pX = pointer.sx
    const pY = pointer.sy

    // Pulse decay
    if (pulseRef.current > 0) {
      pulseRef.current = Math.max(0, pulseRef.current - delta * 2.8)
    }

    // Scroll trajectory: Phoenix soars through space
    // Moves across screen to frame story copy
    const vel = Math.abs(scrollVelocity) * 3.0
    const targetX = scrollProgress > 0.15 && scrollProgress < 0.75 ? 1.1 + pX * 0.4 : pX * 0.6
    const targetY = -pY * 0.4 + Math.sin(time * 1.2) * 0.12
    const targetZ = scrollProgress > 0.85 ? -1.5 : (scrollProgress - 0.5) * 1.2

    if (rootRef.current) {
      // Smooth position lerp
      rootRef.current.position.x = THREE.MathUtils.lerp(rootRef.current.position.x, targetX, 0.05)
      rootRef.current.position.y = THREE.MathUtils.lerp(rootRef.current.position.y, targetY, 0.05)
      rootRef.current.position.z = THREE.MathUtils.lerp(rootRef.current.position.z, targetZ, 0.05)

      // Aerodynamic banking: pitch, roll, yaw
      const targetRoll = -pX * 0.65 - scrollVelocity * 0.3
      const targetPitch = pY * 0.45 + Math.sin(time * 1.5) * 0.08
      const targetYaw = pX * 0.5 + Math.sin(time * 0.8) * 0.1

      rootRef.current.rotation.z = THREE.MathUtils.lerp(rootRef.current.rotation.z, targetRoll, 0.06)
      rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, targetPitch, 0.06)
      rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, targetYaw, 0.06)

      const baseScale = 0.95 + (hovered ? 0.08 : 0) + pulseRef.current * 0.15
      rootRef.current.scale.setScalar(baseScale)
    }

    // Fluid Wing Flap dynamics (accelerates with scroll speed)
    const flapSpeed = 2.4 + vel * 2.5
    const flapAmp = 0.45 + vel * 0.25 + pulseRef.current * 0.3
    const wingFlap = Math.sin(time * flapSpeed) * flapAmp

    if (leftWingRef.current) {
      leftWingRef.current.rotation.z = wingFlap
      leftWingRef.current.rotation.x = -Math.cos(time * flapSpeed) * 0.15
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.z = -wingFlap
      rightWingRef.current.rotation.x = -Math.cos(time * flapSpeed) * 0.15
    }

    // Feather cascade: individual delay along wing span
    leftFeathers.current.forEach((mesh, i) => {
      if (!mesh) return
      const phase = time * flapSpeed - i * 0.18
      mesh.rotation.z = Math.sin(phase) * 0.2
    })
    rightFeathers.current.forEach((mesh, i) => {
      if (!mesh) return
      const phase = time * flapSpeed - i * 0.18
      mesh.rotation.z = -Math.sin(phase) * 0.2
    })

    // Tail Plume aerodynamic wave
    tailPlumes.current.forEach((mesh, i) => {
      if (!mesh) return
      const offset = (i - 1) * 0.25
      mesh.rotation.x = -0.3 + Math.sin(time * 2.0 - i * 0.4) * 0.18
      mesh.rotation.y = offset + Math.cos(time * 1.5 - i * 0.3) * 0.12
    })

    // Pulsing inner heart / solar core
    if (coreRef.current) {
      const coreScale = 0.4 + Math.sin(time * 3.5) * 0.06 + pulseRef.current * 0.3
      coreRef.current.scale.setScalar(coreScale)
    }

    // Smooth material color transitions based on mood
    if (glassMatRef.current) {
      glassMatRef.current.color.lerp(new THREE.Color(theme.primary), 0.06)
      glassMatRef.current.attenuationColor.lerp(new THREE.Color(theme.featherEdge), 0.06)
      glassMatRef.current.iridescence = THREE.MathUtils.lerp(glassMatRef.current.iridescence, theme.iridescence, 0.06)
      glassMatRef.current.ior = THREE.MathUtils.lerp(glassMatRef.current.ior, theme.ior, 0.06)
    }
    if (coreMatRef.current) {
      const glowCol = new THREE.Color(theme.coreGlow)
      coreMatRef.current.color.lerp(glowCol, 0.06)
      coreMatRef.current.emissive.lerp(glowCol, 0.06)
      coreMatRef.current.emissiveIntensity = 2.5 + Math.sin(time * 4.0) * 0.8 + pulseRef.current * 4.0
    }
    if (goldSpineMatRef.current) {
      goldSpineMatRef.current.color.lerp(new THREE.Color(theme.featherEdge), 0.06)
    }
  })

  // Feather blade placement configuration
  const featherProps = useMemo(() => {
    return [
      { pos: [0.35, 0.1, -0.1] as [number, number, number], rot: [0, 0, -0.35] as [number, number, number], scale: [0.9, 0.9, 1.2] as [number, number, number] },
      { pos: [0.75, 0.22, -0.2] as [number, number, number], rot: [0, 0, -0.6] as [number, number, number], scale: [1.0, 1.0, 1.4] as [number, number, number] },
      { pos: [1.15, 0.32, -0.35] as [number, number, number], rot: [0, 0, -0.85] as [number, number, number], scale: [1.15, 1.1, 1.6] as [number, number, number] },
      { pos: [1.55, 0.42, -0.5] as [number, number, number], rot: [0, 0, -1.05] as [number, number, number], scale: [1.25, 1.15, 1.8] as [number, number, number] },
      { pos: [1.9, 0.48, -0.65] as [number, number, number], rot: [0, 0, -1.25] as [number, number, number], scale: [1.1, 1.0, 1.5] as [number, number, number] },
      { pos: [2.2, 0.45, -0.8] as [number, number, number], rot: [0, 0, -1.45] as [number, number, number], scale: [0.9, 0.85, 1.2] as [number, number, number] },
    ]
  }, [])

  return (
    <group
      ref={rootRef}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        setCursor('explore', 'PHOENIX')
      }}
      onPointerOut={() => {
        setHovered(false)
        setCursor('default')
      }}
      onPointerDown={handlePointerDown}
    >
      {/* Sleek Crystalline Torso */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.1, 1.6, 6]} />
        <meshPhysicalMaterial
          ref={glassMatRef}
          color={theme.primary}
          metalness={0.15}
          roughness={0.06}
          transmission={0.92}
          thickness={1.6}
          ior={theme.ior}
          iridescence={theme.iridescence}
          iridescenceIOR={1.45}
          iridescenceThicknessRange={[100, 400]}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          attenuationColor={theme.featherEdge}
          attenuationDistance={1.4}
          transparent
          envMapIntensity={2.5}
        />
      </mesh>

      {/* Phoenix Radiant Diamond Head & Beak */}
      <group position={[0, 0.95, 0.25]}>
        {/* Head */}
        <mesh>
          <octahedronGeometry args={[0.26, 0]} />
          <meshPhysicalMaterial
            color={theme.primary}
            metalness={0.2}
            roughness={0.04}
            transmission={0.92}
            thickness={1.5}
            ior={1.65}
            iridescence={1.0}
            clearcoat={1.0}
            attenuationColor={theme.featherEdge}
            attenuationDistance={1.0}
            transparent
            envMapIntensity={2.8}
          />
        </mesh>
        {/* Beak */}
        <mesh position={[0, 0.05, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.08, 0.35, 4]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#d97706"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        {/* Crown Crest Feather */}
        <mesh position={[0, 0.25, -0.2]} rotation={[-0.8, 0, 0]}>
          <coneGeometry args={[0.09, 0.65, 4]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#b45309"
            emissiveIntensity={0.8}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Glowing Solar Core (Inside Torso) */}
      <mesh ref={coreRef} position={[0, 0.1, 0]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          ref={coreMatRef}
          color={theme.coreGlow}
          emissive={theme.coreGlow}
          emissiveIntensity={3.0}
          metalness={0.3}
          roughness={0.1}
        />
      </mesh>

      {/* Gold Spine & Skeletal Accents */}
      <mesh position={[0, 0, -0.08]}>
        <cylinderGeometry args={[0.04, 0.03, 1.5, 8]} />
        <meshStandardMaterial
          ref={goldSpineMatRef}
          color={theme.featherEdge}
          metalness={1.0}
          roughness={0.15}
          emissive={theme.featherEdge}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* LEFT WING */}
      <group ref={leftWingRef} position={[0.2, 0.3, 0]}>
        {featherProps.map((p, idx) => (
          <mesh
            key={`left-${idx}`}
            ref={(el) => {
              if (el) leftFeathers.current[idx] = el
            }}
            geometry={featherGeom}
            position={p.pos}
            rotation={p.rot}
            scale={p.scale}
          >
            <meshPhysicalMaterial
              color={theme.primary}
              metalness={0.15}
              roughness={0.06}
              transmission={0.92}
              thickness={1.4}
              ior={theme.ior}
              iridescence={theme.iridescence}
              iridescenceIOR={1.45}
              iridescenceThicknessRange={[100, 400]}
              clearcoat={1.0}
              attenuationColor={theme.featherEdge}
              attenuationDistance={1.2}
              transparent
              envMapIntensity={2.4}
            />
          </mesh>
        ))}
      </group>

      {/* RIGHT WING (Mirrored) */}
      <group ref={rightWingRef} position={[-0.2, 0.3, 0]}>
        {featherProps.map((p, idx) => (
          <mesh
            key={`right-${idx}`}
            ref={(el) => {
              if (el) rightFeathers.current[idx] = el
            }}
            geometry={featherGeom}
            position={[-p.pos[0], p.pos[1], p.pos[2]]}
            rotation={[p.rot[0], -p.rot[1], -p.rot[2]]}
            scale={p.scale}
          >
            <meshPhysicalMaterial
              color={theme.primary}
              metalness={0.15}
              roughness={0.06}
              transmission={0.92}
              thickness={1.4}
              ior={theme.ior}
              iridescence={theme.iridescence}
              iridescenceIOR={1.45}
              iridescenceThicknessRange={[100, 400]}
              clearcoat={1.0}
              attenuationColor={theme.featherEdge}
              attenuationDistance={1.2}
              transparent
              envMapIntensity={2.4}
            />
          </mesh>
        ))}
      </group>

      {/* SWEEPING PHOENIX TAIL PLUMES */}
      <group position={[0, -0.85, -0.1]}>
        {[-0.25, 0, 0.25].map((xOffset, idx) => (
          <mesh
            key={`tail-${idx}`}
            ref={(el) => {
              if (el) tailPlumes.current[idx] = el
            }}
            geometry={tailGeom}
            position={[xOffset, -1.0, -0.2]}
            rotation={[-0.4, 0, xOffset * 0.8]}
          >
            <meshPhysicalMaterial
              color={theme.primary}
              metalness={0.2}
              roughness={0.05}
              transmission={0.94}
              thickness={1.2}
              ior={1.6}
              iridescence={1.0}
              clearcoat={1.0}
              attenuationColor={theme.featherEdge}
              attenuationDistance={1.0}
              transparent
              envMapIntensity={2.5}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}
