import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function makeConstellation() {
  const count = 120
  const positions = new Float32Array(count * 3)
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))

  for (let index = 0; index < count; index += 1) {
    const y = 1 - (index / (count - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const angle = goldenAngle * index
    const spread = 1.04 + ((index * 17) % 11) / 100
    positions[index * 3] = Math.cos(angle) * radius * spread
    positions[index * 3 + 1] = y * spread
    positions[index * 3 + 2] = Math.sin(angle) * radius * spread
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  return geometry
}

function IndexCore() {
  const coreRef = useRef<THREE.Group>(null)
  const orbitRef = useRef<THREE.Group>(null)
  const constellations = useMemo(makeConstellation, [])

  useFrame(({ clock }, delta) => {
    if (prefersReducedMotion) return

    const time = clock.elapsedTime
    const frame = Math.min(delta, 1 / 30)

    if (coreRef.current) {
      coreRef.current.rotation.y += frame * 0.12
      coreRef.current.rotation.x = Math.sin(time * 0.19) * 0.045
      coreRef.current.rotation.z = Math.cos(time * 0.12) * 0.035
    }
    if (orbitRef.current) {
      orbitRef.current.rotation.y -= frame * 0.055
      orbitRef.current.rotation.z = Math.sin(time * 0.16) * 0.09
    }
  })

  return (
    <group>
      <group ref={orbitRef}>
        <mesh rotation={[Math.PI / 2.6, 0.12, 0.15]}>
          <torusGeometry args={[1.2, 0.006, 8, 180]} />
          <meshBasicMaterial color="#AFDDFF" transparent opacity={0.5} toneMapped={false} />
        </mesh>
        <mesh rotation={[0.78, 0.52, 0.86]}>
          <torusGeometry args={[1.43, 0.004, 8, 180]} />
          <meshBasicMaterial color="#D8F1FF" transparent opacity={0.26} toneMapped={false} />
        </mesh>
        <mesh rotation={[-0.48, 0.88, 0.38]}>
          <torusGeometry args={[1.62, 0.003, 8, 180]} />
          <meshBasicMaterial color="#AFDDFF" transparent opacity={0.2} toneMapped={false} />
        </mesh>

        <mesh position={[1.19, 0.12, 0.04]}>
          <sphereGeometry args={[0.035, 14, 14]} />
          <meshBasicMaterial color="#EAF8FF" toneMapped={false} />
        </mesh>
        <mesh position={[-0.8, -0.64, 0.16]}>
          <sphereGeometry args={[0.024, 12, 12]} />
          <meshBasicMaterial color="#AFDDFF" toneMapped={false} />
        </mesh>
        <mesh position={[0.3, 1.39, -0.02]}>
          <sphereGeometry args={[0.021, 12, 12]} />
          <meshBasicMaterial color="#AFDDFF" toneMapped={false} />
        </mesh>
      </group>

      <group ref={coreRef}>
        <mesh>
          <icosahedronGeometry args={[0.82, 2]} />
          <meshPhysicalMaterial
            color="#73BCE7"
            metalness={0.28}
            roughness={0.17}
            transmission={0.3}
            thickness={0.75}
            ior={1.34}
            clearcoat={1}
            clearcoatRoughness={0.08}
            emissive="#0A283A"
            emissiveIntensity={0.75}
            transparent
            opacity={0.78}
          />
        </mesh>

        <mesh scale={1.007}>
          <icosahedronGeometry args={[0.82, 2]} />
          <meshBasicMaterial
            color="#AFDDFF"
            wireframe
            transparent
            opacity={0.42}
            toneMapped={false}
          />
        </mesh>

        <mesh scale={0.55}>
          <icosahedronGeometry args={[0.82, 1]} />
          <meshStandardMaterial
            color="#AFDDFF"
            metalness={0.55}
            roughness={0.2}
            emissive="#3CA5D6"
            emissiveIntensity={0.65}
          />
        </mesh>

        <mesh scale={0.29}>
          <sphereGeometry args={[0.82, 32, 32]} />
          <meshBasicMaterial color="#E9F8FF" transparent opacity={0.46} toneMapped={false} />
        </mesh>

        <points geometry={constellations}>
          <pointsMaterial
            color="#C9ECFF"
            size={0.023}
            sizeAttenuation
            transparent
            opacity={0.74}
            depthWrite={false}
            toneMapped={false}
          />
        </points>
      </group>
    </group>
  )
}

export default function FinancialOrb() {
  return (
    <div
      aria-hidden="true"
      className="index-orb anim-fade-in"
      style={{ animationDelay: '600ms' }}
    >
      <Canvas
        className="!absolute inset-0"
        dpr={[1, 1.45]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance', stencil: false }}
        camera={{ fov: 36, near: 0.1, far: 20, position: [0, 0, 5.4] }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor('#000000', 0)
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.08
          scene.background = null
        }}
      >
        <ambientLight intensity={0.55} color="#A8DFFF" />
        <directionalLight position={[-3.2, 3.8, 4.5]} intensity={3.1} color="#D9F2FF" />
        <pointLight position={[2.5, -0.8, 2]} intensity={5} distance={7} color="#5EC4FF" />
        <pointLight position={[-2.4, 1.2, -1.4]} intensity={3.5} distance={6} color="#387DAB" />
        <IndexCore />
      </Canvas>
    </div>
  )
}
