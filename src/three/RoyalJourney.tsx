import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, MeshReflectorMaterial } from '@react-three/drei'
import type { DeviceTier } from '../hooks/useResponsive'
import { pointer, smoothPointer } from '../lib/pointer'
import { scrollState } from '../lib/scroll'
import { LightCards, SalonRoom } from './SalonRoom'

const GOLD = '#CBA86C'
const PALE_GOLD = '#F0D9A8'
const RED_VELVET = '#341B1A'

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))
const smoothstep = (a: number, b: number, value: number) => {
  const t = clamp01((value - a) / (b - a))
  return t * t * (3 - 2 * t)
}

function tubeFromPoints(points: [number, number, number][], radius: number, segments = 64) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)))
  return new THREE.TubeGeometry(curve, segments, radius, 8, false)
}

function makeMarbleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const context = canvas.getContext('2d')!
  context.fillStyle = '#100d0c'
  context.fillRect(0, 0, 512, 512)

  for (let i = 0; i < 52; i += 1) {
    context.beginPath()
    context.moveTo(-40, Math.random() * 512)
    context.bezierCurveTo(
      140 + Math.random() * 220,
      Math.random() * 512,
      300 + Math.random() * 120,
      Math.random() * 512,
      550,
      Math.random() * 512,
    )
    context.lineWidth = 0.4 + Math.random() * 2
    context.strokeStyle = `rgba(205, 171, 112, ${0.035 + Math.random() * 0.095})`
    context.stroke()
  }

  for (let i = 0; i < 7500; i += 1) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    context.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.15)'
    context.fillRect(x, y, 1, 1)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 24)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function PortalHalo() {
  return (
    <mesh position={[0, 4.1, 0.18]}>
      <planeGeometry args={[9.2, 9.8]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={{
          uInner: { value: new THREE.Color('#F1C57E') },
          uOuter: { value: new THREE.Color('#3D1714') },
        }}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          uniform vec3 uInner;
          uniform vec3 uOuter;
          varying vec2 vUv;
          void main() {
            vec2 p = (vUv - 0.5) * vec2(1.0, 0.9);
            float radius = length(p);
            float halo = 1.0 - smoothstep(0.1, 0.68, radius);
            float core = 1.0 - smoothstep(0.0, 0.32, radius);
            vec3 color = mix(uOuter, uInner, core);
            gl_FragColor = vec4(color, halo * 0.68);
          }
        `}
      />
    </mesh>
  )
}

function DoorLeaf({ side, started, reduced }: { side: -1 | 1; started: boolean; reduced: boolean }) {
  const hinge = useRef<THREE.Group>(null)
  const elapsed = useRef(0)
  const centerX = side === -1 ? 2.0 : -2.0
  const goldMaterial = <meshStandardMaterial color={GOLD} metalness={0.86} roughness={0.25} />

  useFrame((_, delta) => {
    if (started) elapsed.current = Math.min(4.2, elapsed.current + delta)
    const opened = Math.max(smoothstep(0, 0.065, scrollState.page), smoothstep(0, reduced ? 0.75 : 3.8, elapsed.current))
    if (hinge.current) hinge.current.rotation.y = THREE.MathUtils.damp(hinge.current.rotation.y, -side * opened * 0.96, 2.8, delta)
  })

  return (
    <group ref={hinge} position={[side * 4, 0, 0.15]}>
      <group position={[centerX, 4.05, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.98, 8.1, 0.32]} />
          <meshStandardMaterial color="#120D0D" roughness={0.29} metalness={0.38} />
        </mesh>
        <mesh position={[0, 0, 0.18]} castShadow>
          <boxGeometry args={[3.5, 7.62, 0.06]} />
          <meshStandardMaterial color={RED_VELVET} roughness={0.58} metalness={0.12} />
        </mesh>
        <mesh position={[0, 0, 0.225]}>
          <boxGeometry args={[3.08, 7.12, 0.035]} />
          {goldMaterial}
        </mesh>
        <mesh position={[0, 0, 0.25]}>
          <boxGeometry args={[2.98, 7.02, 0.035]} />
          <meshStandardMaterial color="#1B1110" roughness={0.28} metalness={0.3} />
        </mesh>
        {[-1.57, 1.57].map((x) => (
          <mesh key={`rail-${x}`} position={[x, 0, 0.29]}>
            <boxGeometry args={[0.035, 7.08, 0.035]} />
            {goldMaterial}
          </mesh>
        ))}
        {[-3.48, 3.48].map((y) => (
          <mesh key={`rail-y-${y}`} position={[0, y, 0.29]}>
            <boxGeometry args={[3.2, 0.035, 0.035]} />
            {goldMaterial}
          </mesh>
        ))}
        <mesh position={[0, 0.15, 0.33]} rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[0.72, 0.018, 8, 80]} />
          <meshBasicMaterial color={PALE_GOLD} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.15, 0.33]}>
          <torusGeometry args={[0.72, 0.018, 8, 80]} />
          <meshBasicMaterial color={PALE_GOLD} toneMapped={false} />
        </mesh>
        <mesh position={[side * -1.28, 0, 0.4]} castShadow>
          <sphereGeometry args={[0.1, 24, 16]} />
          <meshStandardMaterial color={GOLD} metalness={0.96} roughness={0.17} />
        </mesh>
        <mesh position={[side * -1.28, -0.19, 0.4]}>
          <cylinderGeometry args={[0.035, 0.035, 0.22, 16]} />
          <meshStandardMaterial color={GOLD} metalness={0.94} roughness={0.22} />
        </mesh>
      </group>
    </group>
  )
}

function PortalArch({ started, reduced }: { started: boolean; reduced: boolean }) {
  const archGeometry = useMemo(
    () =>
      tubeFromPoints(
        [
          [-4.25, 0.2, 0],
          [-4.25, 5.5, 0],
          [-3.8, 7.2, 0],
          [-2.8, 8.3, 0],
          [0, 8.8, 0],
          [2.8, 8.3, 0],
          [3.8, 7.2, 0],
          [4.25, 5.5, 0],
          [4.25, 0.2, 0],
        ],
        0.19,
        96,
      ),
    [],
  )
  const innerArch = useMemo(
    () =>
      tubeFromPoints(
        [
          [-3.85, 0.25, 0],
          [-3.85, 5.2, 0],
          [-3.35, 6.9, 0],
          [-2.45, 7.85, 0],
          [0, 8.3, 0],
          [2.45, 7.85, 0],
          [3.35, 6.9, 0],
          [3.85, 5.2, 0],
          [3.85, 0.25, 0],
        ],
        0.035,
        96,
      ),
    [],
  )

  return (
    <group position={[0, 0, -18]} scale={[1.2, 1.2, 1]}>
      <PortalHalo />
      <mesh geometry={archGeometry} position={[0, 0, 0.16]} castShadow>
        <meshStandardMaterial color="#1A1310" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh geometry={innerArch} position={[0, 0, 0.21]}>
        <meshBasicMaterial color={PALE_GOLD} toneMapped={false} />
      </mesh>
      {[-4.22, 4.22].map((x) => (
        <group key={x} position={[x, 2.7, 0.1]}>
          <mesh castShadow>
            <boxGeometry args={[0.64, 5.45, 0.72]} />
            <meshStandardMaterial color="#100B0B" roughness={0.31} metalness={0.4} />
          </mesh>
          {[-0.22, 0, 0.22].map((groove) => (
            <mesh key={groove} position={[groove, 0, 0.38]}>
              <boxGeometry args={[0.025, 5.25, 0.025]} />
              <meshStandardMaterial color={GOLD} metalness={0.84} roughness={0.28} />
            </mesh>
          ))}
          <mesh position={[0, -2.8, 0]}>
            <boxGeometry args={[0.94, 0.34, 1.02]} />
            <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.28} />
          </mesh>
          <mesh position={[0, 5.7, 0]}>
            <boxGeometry args={[0.94, 0.34, 1.02]} />
            <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.28} />
          </mesh>
        </group>
      ))}
      <DoorLeaf side={-1} started={started} reduced={reduced} />
      <DoorLeaf side={1} started={started} reduced={reduced} />
      <pointLight position={[0, 4.1, 3.7]} intensity={17} distance={26} color="#D89A53" />
      <pointLight position={[0, 2, 2]} intensity={7} distance={18} color="#F2D9B0" />
    </group>
  )
}

function BeautyBust({ reduced }: { reduced: boolean }) {
  const sculptureRef = useRef<THREE.Group>(null)
  const hairLines = useMemo(() => {
    const lines: THREE.BufferGeometry[] = []
    for (let index = 0; index < 24; index += 1) {
      const t = index / 23
      const side = t < 0.5 ? -1 : 1
      const lane = (t < 0.5 ? 1 - t * 2 : (t - 0.5) * 2) * 0.78
      lines.push(
        tubeFromPoints(
          [
            [-lane * 0.65, 4.15, -0.18],
            [side * (0.3 + lane * 0.38), 3.9, 0.2],
            [side * (0.8 + lane * 0.55), 3.18, 0.4],
            [side * (1.13 + lane * 0.6), 2.35, 0.28],
            [side * (1.35 + lane * 0.72), 1.15 + (index % 4) * 0.12, -0.12],
            [side * (1.52 + lane * 0.76), 0.28 + (index % 4) * 0.16, -0.42],
          ],
          0.012 + (index % 3) * 0.003,
          42,
        ),
      )
    }
    return lines
  }, [])
  const eyeGeometry = useMemo(
    () => [
      tubeFromPoints([[-0.77, 2.77, 0.69], [-0.53, 2.7, 0.82], [-0.3, 2.71, 0.84], [-0.1, 2.8, 0.78]], 0.022, 24),
      tubeFromPoints([[0.1, 2.8, 0.78], [0.3, 2.71, 0.84], [0.53, 2.7, 0.82], [0.77, 2.77, 0.69]], 0.022, 24),
      tubeFromPoints([[-0.24, 1.95, 0.82], [0, 1.91, 0.89], [0.24, 1.95, 0.82]], 0.026, 20),
    ],
    [],
  )

  useFrame(({ clock }) => {
    if (!sculptureRef.current) return
    const p = scrollState.page
    const wind = Math.sin(clock.elapsedTime * 0.32) * 0.035 + scrollState.velocity * 0.035
    sculptureRef.current.rotation.y = reduced ? 0 : Math.sin(clock.elapsedTime * 0.13) * 0.08 + pointer.sx * 0.08
    sculptureRef.current.rotation.z = reduced ? 0 : wind
    sculptureRef.current.position.y = reduced ? 0.1 : 0.1 + Math.sin(clock.elapsedTime * 0.42) * 0.09
    const disperse = smoothstep(0.34, 0.48, p)
    sculptureRef.current.scale.setScalar(1 - disperse * 0.44)
  })

  return (
    <group ref={sculptureRef} position={[0, 0.55, -53]} scale={1.12}>
      <mesh position={[0, 0.63, 0]} scale={[1.36, 0.55, 0.72]} castShadow>
        <sphereGeometry args={[1, 48, 32]} />
        <meshPhysicalMaterial color="#9C7865" roughness={0.34} metalness={0.05} clearcoat={0.6} />
      </mesh>
      <mesh position={[0, 1.08, 0]} scale={[0.52, 0.93, 0.43]} castShadow>
        <cylinderGeometry args={[0.72, 1.02, 1.72, 48, 1, false]} />
        <meshPhysicalMaterial color="#A88773" roughness={0.3} metalness={0.04} clearcoat={0.7} />
      </mesh>
      <mesh position={[0, 2.67, 0]} scale={[1, 1.36, 0.78]} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 48]} />
        <meshPhysicalMaterial color="#D6B99D" roughness={0.26} metalness={0.02} clearcoat={0.78} clearcoatRoughness={0.15} />
      </mesh>
      {/* cheek planes and the bridge of the nose */}
      <mesh position={[-0.48, 2.27, 0.55]} scale={[0.43, 0.28, 0.18]} rotation={[0, 0.16, -0.18]}>
        <sphereGeometry args={[1, 32, 20]} />
        <meshPhysicalMaterial color="#C9AA90" roughness={0.31} />
      </mesh>
      <mesh position={[0.48, 2.27, 0.55]} scale={[0.43, 0.28, 0.18]} rotation={[0, -0.16, 0.18]}>
        <sphereGeometry args={[1, 32, 20]} />
        <meshPhysicalMaterial color="#C9AA90" roughness={0.31} />
      </mesh>
      <mesh position={[0, 2.36, 0.7]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.16, 0.52, 5]} />
        <meshPhysicalMaterial color="#D9BEA5" roughness={0.23} />
      </mesh>
      <mesh position={[0, 1.88, 0.64]} scale={[0.24, 0.09, 0.08]}>
        <sphereGeometry args={[1, 32, 20]} />
        <meshPhysicalMaterial color="#875347" roughness={0.3} />
      </mesh>
      {eyeGeometry.map((geometry, index) => (
        <mesh key={`face-line-${index}`} geometry={geometry} position={[0, 0, 0.04]}>
          <meshStandardMaterial color={index === 2 ? '#74453D' : '#765A4B'} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 3.17, 0.07]}>
        <torusGeometry args={[1.06, 0.034, 10, 96, Math.PI]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.23} />
      </mesh>
      {hairLines.map((geometry, index) => (
        <mesh key={`hair-${index}`} geometry={geometry}>
          <meshStandardMaterial
            color={index % 4 === 0 ? '#D6AF70' : '#1A1110'}
            metalness={index % 4 === 0 ? 0.78 : 0.34}
            roughness={index % 4 === 0 ? 0.24 : 0.39}
            emissive={index % 4 === 0 ? '#4B2D16' : '#000000'}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.33, -0.62]}>
        <torusGeometry args={[1.42, 0.022, 8, 120]} />
        <meshBasicMaterial color={PALE_GOLD} transparent opacity={0.72} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 4.4, 2]} intensity={8} distance={13} color="#E8BD86" />
    </group>
  )
}

function GoldenHairSculpture({ reduced }: { reduced: boolean }) {
  const sculptureRef = useRef<THREE.Group>(null)
  const curves = useMemo(() => {
    const list: THREE.BufferGeometry[] = []
    for (let i = 0; i < 14; i += 1) {
      const angle = (i / 14) * Math.PI * 2
      const lift = (i % 4) * 0.25
      list.push(
        tubeFromPoints(
          [
            [Math.cos(angle) * 0.4, 2.2 + lift, 0],
            [Math.cos(angle + 0.5) * 1.3, 3.6 + lift, Math.sin(angle + 0.5)],
            [Math.cos(angle + 1.3) * 2.25, 2.7 + lift, Math.sin(angle + 1.3)],
            [Math.cos(angle + 2.4) * 2.55, 1.2 + lift, Math.sin(angle + 2.4)],
            [Math.cos(angle + 3.5) * 1.3, 0.45 + lift, Math.sin(angle + 3.5)],
            [Math.cos(angle + 4.4) * 0.4, 2.1 + lift, Math.sin(angle + 4.4) * 0.6],
          ],
          i % 3 === 0 ? 0.055 : 0.026,
          70,
        ),
      )
    }
    return list
  }, [])

  useFrame(({ clock }) => {
    if (!sculptureRef.current) return
    sculptureRef.current.rotation.y = reduced ? 0 : clock.elapsedTime * 0.055 + pointer.sx * 0.16
    sculptureRef.current.rotation.x = reduced ? 0 : Math.sin(clock.elapsedTime * 0.17) * 0.055 + scrollState.velocity * 0.04
  })

  return (
    <group ref={sculptureRef} position={[0, 2.2, -110]}>
      <mesh castShadow>
        <torusKnotGeometry args={[1.4, 0.23, 220, 20, 2, 3]} />
        <meshPhysicalMaterial color="#AD793E" metalness={0.94} roughness={0.2} clearcoat={1} emissive="#4D260C" emissiveIntensity={0.26} />
      </mesh>
      {curves.map((geometry, i) => (
        <mesh key={`ribbon-${i}`} geometry={geometry}>
          <meshStandardMaterial color={i % 4 === 0 ? PALE_GOLD : GOLD} metalness={0.94} roughness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.55]}>
        <icosahedronGeometry args={[0.58, 1]} />
        <meshPhysicalMaterial color="#C99C6A" metalness={0.7} roughness={0.24} transparent opacity={0.72} />
      </mesh>
      <pointLight position={[0, 4, 4]} intensity={9} distance={18} color="#D89C56" />
    </group>
  )
}

function OrnateMirror({ quality }: { quality: DeviceTier }) {
  const frameGeometry = useMemo(
    () =>
      tubeFromPoints(
        [
          [-3.2, -3.6, 0],
          [-3.2, 2.3, 0],
          [-2.9, 4.2, 0],
          [-2, 5.35, 0],
          [0, 5.8, 0],
          [2, 5.35, 0],
          [2.9, 4.2, 0],
          [3.2, 2.3, 0],
          [3.2, -3.6, 0],
          [-3.2, -3.6, 0],
        ],
        0.16,
        96,
      ),
    [],
  )

  return (
    <group position={[0, 4.2, -166]}>
      <mesh position={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[6.85, 10, 0.32]} />
        <meshStandardMaterial color="#130D0C" roughness={0.27} metalness={0.58} />
      </mesh>
      <mesh geometry={frameGeometry} position={[0, 0, 0.48]}>
        <meshStandardMaterial color={GOLD} roughness={0.22} metalness={0.94} />
      </mesh>
      <mesh position={[0, 0.95, 0.31]}>
        <planeGeometry args={[5.9, 7.1]} />
        {quality === 'low' ? (
          <meshStandardMaterial color="#62534A" metalness={0.86} roughness={0.2} />
        ) : (
          <MeshReflectorMaterial
            resolution={quality === 'high' ? 256 : 128}
            mirror={0.78}
            mixBlur={1.15}
            mixStrength={1.1}
            blur={[180, 60]}
            color="#423632"
            metalness={0.62}
            roughness={0.24}
            depthScale={0.25}
          />
        )}
      </mesh>
      <mesh position={[0, 0, 0.52]}>
        <torusGeometry args={[1.14, 0.035, 8, 96]} />
        <meshStandardMaterial color={PALE_GOLD} metalness={0.95} roughness={0.17} />
      </mesh>
      <mesh position={[0, -4.15, 0.1]} castShadow>
        <cylinderGeometry args={[1.25, 1.55, 0.45, 48]} />
        <meshStandardMaterial color="#17100F" roughness={0.25} metalness={0.55} />
      </mesh>
      <pointLight position={[0, 0, 3]} intensity={7} distance={16} color="#E4BD80" />
    </group>
  )
}

function PerfumeBottle({ position, scale = 1, turn = 0, reduced }: { position: [number, number, number]; scale?: number; turn?: number; reduced: boolean }) {
  const bottle = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!bottle.current || reduced) return
    bottle.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.52 + turn) * 0.13
    bottle.current.rotation.y = Math.sin(clock.elapsedTime * 0.23 + turn) * 0.12
  })
  return (
    <group ref={bottle} position={position} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.54, 0.59, 1.62, 48, 1, false]} />
        <meshPhysicalMaterial color="#A45F3E" transmission={0.48} thickness={0.6} roughness={0.12} ior={1.43} clearcoat={1} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.43, 0.48, 0.84, 40]} />
        <meshPhysicalMaterial color="#A96A36" transparent opacity={0.72} roughness={0.18} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.91, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.21, 32]} />
        <meshStandardMaterial color={GOLD} metalness={0.96} roughness={0.16} />
      </mesh>
      <mesh position={[0, 1.23, 0]} castShadow>
        <dodecahedronGeometry args={[0.32, 0]} />
        <meshPhysicalMaterial color="#D1B27A" metalness={0.91} roughness={0.18} clearcoat={1} />
      </mesh>
      <mesh position={[0, -0.04, 0.56]}>
        <planeGeometry args={[0.62, 0.38]} />
        <meshBasicMaterial color="#E9D5AF" transparent opacity={0.86} />
      </mesh>
      <mesh position={[0, -0.04, 0.575]}>
        <planeGeometry args={[0.024, 0.24]} />
        <meshBasicMaterial color="#6C4532" />
      </mesh>
    </group>
  )
}

function RoyalProducts({ reduced }: { reduced: boolean }) {
  return (
    <group position={[0, 0, -274]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[5.8, 6.4, 0.42, 64]} />
        <meshStandardMaterial color="#17110F" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.43, 0]}>
        <torusGeometry args={[5.55, 0.035, 8, 96]} />
        <meshStandardMaterial color={GOLD} metalness={0.96} roughness={0.21} />
      </mesh>
      <PerfumeBottle position={[-3.1, 2.25, 0.5]} scale={0.83} turn={0.1} reduced={reduced} />
      <PerfumeBottle position={[-1.05, 2.5, -1]} scale={1.22} turn={1.3} reduced={reduced} />
      <PerfumeBottle position={[1.15, 2.1, 0.4]} scale={0.92} turn={2.4} reduced={reduced} />
      <PerfumeBottle position={[3.05, 2.7, -1.4]} scale={1.1} turn={3.2} reduced={reduced} />
      <mesh position={[0, 0.63, 0]}>
        <torusGeometry args={[4.45, 0.018, 6, 128]} />
        <meshBasicMaterial color={PALE_GOLD} transparent opacity={0.54} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 5.3, 3]} intensity={10} distance={20} color="#E8C181" />
    </group>
  )
}

function ServiceSculptures() {
  const petalGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.35, 0.2, 0.18),
      new THREE.Vector3(0.62, 0.06, 0.12),
      new THREE.Vector3(0.82, 0, 0),
    ])
    return new THREE.TubeGeometry(curve, 28, 0.035, 8, false)
  }, [])

  return (
    <group position={[0, 1.6, -205]}>
      <group position={[-5.1, 0.3, 0]}>
        <mesh>
          <torusKnotGeometry args={[0.9, 0.16, 120, 14, 2, 3]} />
          <meshPhysicalMaterial color="#8A5744" metalness={0.18} roughness={0.23} clearcoat={0.86} />
        </mesh>
      </group>
      <group position={[-2.9, 0, -1]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[Math.sin(i * 1.7) * 0.45, i * 0.35, 0]} rotation={[0.3 * i, 0.6 * i, 0.2]}>
            <sphereGeometry args={[0.52, 28, 20]} />
            <meshPhysicalMaterial color={['#C45F47', '#D39A61', '#7D3430', '#E6B97B'][i]} transparent opacity={0.65} transmission={0.24} roughness={0.2} />
          </mesh>
        ))}
      </group>
      <group position={[0, 0, -0.8]}>
        <mesh>
          <sphereGeometry args={[1.18, 40, 32]} />
          <meshPhysicalMaterial color="#B87551" roughness={0.12} metalness={0.12} clearcoat={1} emissive="#371A13" emissiveIntensity={0.22} />
        </mesh>
        <mesh scale={1.22}>
          <sphereGeometry args={[1.18, 32, 24]} />
          <meshBasicMaterial color="#F0C894" wireframe transparent opacity={0.18} />
        </mesh>
      </group>
      <group position={[2.9, 0.2, -1]}>
        <mesh rotation={[0.4, 0.2, -0.3]}>
          <torusKnotGeometry args={[0.62, 0.18, 96, 12, 2, 5]} />
          <meshPhysicalMaterial color="#D2AD79" metalness={0.84} roughness={0.2} clearcoat={0.8} />
        </mesh>
        {[-1, 1].map((x) => (
          <mesh key={x} position={[x * 0.45, -0.55, 0.15]} rotation={[0, 0, x * 0.22]}>
            <sphereGeometry args={[0.11, 20, 16]} />
            <meshStandardMaterial color={PALE_GOLD} metalness={0.85} roughness={0.15} />
          </mesh>
        ))}
      </group>
      <group position={[5.15, 0.2, -0.4]}>
        {Array.from({ length: 8 }, (_, index) => (
          <mesh key={index} geometry={petalGeometry} rotation={[0.2, (index / 8) * Math.PI * 2, 0]}>
            <meshPhysicalMaterial color={index % 2 ? '#8D4B3C' : '#D0A45E'} metalness={0.44} roughness={0.28} />
          </mesh>
        ))}
      </group>
      <pointLight position={[0, 4, 1]} intensity={10} distance={24} color="#BA6C45" />
    </group>
  )
}

function Column({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.78, 0.9, 0.48, 32]} />
        <meshStandardMaterial color="#241A16" metalness={0.32} roughness={0.31} />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.47, 0.62, 4.1, 32, 1, false]} />
        <meshStandardMaterial color="#2A201B" metalness={0.2} roughness={0.34} />
      </mesh>
      {[-0.27, 0, 0.27].map((x) => (
        <mesh key={x} position={[x, 2.5, 0.46]}>
          <boxGeometry args={[0.027, 3.8, 0.025]} />
          <meshStandardMaterial color={GOLD} metalness={0.92} roughness={0.24} />
        </mesh>
      ))}
      <mesh position={[0, 4.73, 0]} castShadow>
        <cylinderGeometry args={[0.84, 0.62, 0.44, 32]} />
        <meshStandardMaterial color={GOLD} metalness={0.88} roughness={0.26} />
      </mesh>
    </group>
  )
}

function RoyalHall({ quality }: { quality: DeviceTier }) {
  const marble = useMemo(makeMarbleTexture, [])
  const arch = useMemo(() => tubeFromPoints([
    [-6.25, 4.65, 0], [-6.25, 6.4, 0], [-5.55, 7.25, 0], [-4.4, 7.7, 0],
    [0, 8.02, 0], [4.4, 7.7, 0], [5.55, 7.25, 0], [6.25, 6.4, 0], [6.25, 4.65, 0],
  ], 0.13, 84), [])
  const archInlay = useMemo(() => tubeFromPoints([
    [-6.04, 4.7, 0.08], [-6.04, 6.35, 0.08], [-5.35, 7.15, 0.08], [-4.2, 7.52, 0.08],
    [0, 7.82, 0.08], [4.2, 7.52, 0.08], [5.35, 7.15, 0.08], [6.04, 6.35, 0.08], [6.04, 4.7, 0.08],
  ], 0.027, 84), [])
  const count = quality === 'high' ? 13 : 8
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -205]} receiveShadow>
        <planeGeometry args={[19, 450]} />
        <meshStandardMaterial map={marble} color="#B9A896" metalness={0.13} roughness={0.29} />
      </mesh>
      <mesh position={[0, 8.8, -205]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[19, 450]} />
        <meshStandardMaterial color="#100C0B" roughness={0.86} />
      </mesh>
      {Array.from({ length: count }, (_, index) => {
        const z = -36 - index * 24
        return (
          <group key={`bay-${index}`}>
            <Column position={[-6.4, 0, z]} />
            <Column position={[6.4, 0, z]} />
            <mesh geometry={arch} position={[0, 0, z]} castShadow>
              <meshStandardMaterial color={index % 2 ? '#33251D' : '#241915'} metalness={0.35} roughness={0.3} />
            </mesh>
            <mesh geometry={archInlay} position={[0, 0, z]}>
              <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.23} />
            </mesh>
            <mesh position={[0, 7.75, z + 0.18]}>
              <boxGeometry args={[0.46, 0.46, 0.38]} />
              <meshStandardMaterial color={PALE_GOLD} metalness={0.92} roughness={0.18} />
            </mesh>
          </group>
        )
      })}
      <group position={[0, 0, -380]}>
        <SalonRoom quality={quality} />
      </group>
      <pointLight position={[0, 5.5, -356]} intensity={15} distance={46} color="#FFE2B1" />
    </group>
  )
}

function makeThread() {
  return tubeFromPoints(
    [
      [-3.9, 0.16, -13],
      [-3.7, 0.25, -27],
      [-2.1, 0.12, -41],
      [2.8, 0.2, -54],
      [3.5, 0.2, -78],
      [-3.4, 0.24, -97],
      [-4.1, 0.22, -116],
      [3.4, 0.18, -136],
      [4.4, 0.25, -157],
      [-3.6, 0.22, -178],
      [-4.2, 0.22, -198],
      [3.8, 0.25, -219],
      [4.1, 0.2, -240],
      [-2.8, 0.2, -261],
      [-3.4, 0.21, -286],
      [2.7, 0.2, -314],
      [2.8, 0.22, -342],
      [0, 0.2, -380],
    ],
    0.014,
    360,
  )
}

function GoldenThread() {
  const ref = useRef<THREE.Mesh>(null)
  const geometry = useMemo(makeThread, [])
  const glow = useMemo(() => tubeFromPoints([
    [-3.9, 0.16, -13], [-3.7, 0.25, -27], [-2.1, 0.12, -41], [2.8, 0.2, -54],
    [3.5, 0.2, -78], [-3.4, 0.24, -97], [-4.1, 0.22, -116], [3.4, 0.18, -136],
    [4.4, 0.25, -157], [-3.6, 0.22, -178], [-4.2, 0.22, -198], [3.8, 0.25, -219],
    [4.1, 0.2, -240], [-2.8, 0.2, -261], [-3.4, 0.21, -286], [2.7, 0.2, -314],
    [2.8, 0.22, -342], [0, 0.2, -380],
  ], 0.075, 360), [])

  useFrame(() => {
    const progress = smoothstep(0, 0.93, scrollState.page)
    const total = geometry.index?.count ?? geometry.attributes.position.count
    const visible = Math.max(1, Math.floor(total * progress))
    if (ref.current) {
      ref.current.geometry.setDrawRange(0, visible)
      const material = ref.current.material as THREE.MeshStandardMaterial
      material.opacity = 0.54 + Math.sin(performance.now() * 0.0017) * 0.08
    }
    if (glow) glow.setDrawRange(0, visible)
  })

  return (
    <group>
      <mesh ref={ref} geometry={geometry}>
        <meshStandardMaterial color={PALE_GOLD} emissive="#5B3817" emissiveIntensity={0.75} metalness={0.9} roughness={0.22} transparent opacity={0.56} />
      </mesh>
      <mesh geometry={glow}>
        <meshBasicMaterial color="#D7A651" transparent opacity={0.1} depthWrite={false} />
      </mesh>
    </group>
  )
}

function makeParticles(count: number) {
  const positions = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 18
    positions[i * 3 + 1] = Math.random() * 8.5
    positions[i * 3 + 2] = -Math.random() * 420
    seeds[i] = Math.random()
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
  return geometry
}

function JourneyDust({ quality, reduced }: { quality: DeviceTier; reduced: boolean }) {
  const count = quality === 'high' ? 3200 : quality === 'medium' ? 1600 : 650
  const geometry = useMemo(() => makeParticles(count), [count])
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPointer: { value: new THREE.Vector2() }, uScroll: { value: 0 }, uPixelRatio: { value: 1 } }), [])

  useFrame((state, delta) => {
    if (!reduced) uniforms.uTime.value += Math.min(delta, 1 / 30)
    uniforms.uPointer.value.set(reduced ? 0 : pointer.sx, reduced ? 0 : pointer.sy)
    uniforms.uScroll.value = scrollState.page
    uniforms.uPixelRatio.value = Math.min(1.5, state.gl.getPixelRatio())
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          uniform float uTime;
          uniform vec2 uPointer;
          uniform float uScroll;
          uniform float uPixelRatio;
          attribute float aSeed;
          varying float vAlpha;
          varying float vSeed;
          void main() {
            vec3 p = position;
            p.x += sin(uTime * 0.17 + aSeed * 31.0) * 0.42;
            p.y += cos(uTime * 0.13 + aSeed * 17.0) * 0.25;
            p.z += sin(uTime * 0.1 + aSeed * 21.0) * 0.35;
            float segment = clamp(uScroll * 440.0, 0.0, 440.0);
            float depthFade = 0.28 + 0.72 * smoothstep(segment - 42.0, segment + 15.0, -p.z);
            vec2 focus = uPointer * vec2(5.5, 3.0);
            vec2 delta = p.xy - focus;
            float dist = length(delta) + 0.001;
            p.xy += (delta / dist) * (1.0 - smoothstep(0.0, 2.2, dist)) * 0.18;
            vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * viewPosition;
            gl_PointSize = (1.5 + aSeed * 3.0) * uPixelRatio * (1.0 / max(0.5, -viewPosition.z * 0.12));
            vAlpha = depthFade * (0.18 + aSeed * 0.42);
            vSeed = aSeed;
          }
        `}
        fragmentShader={/* glsl */ `
          varying float vAlpha;
          varying float vSeed;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float r = length(uv);
            if (r > 0.5) discard;
            float glow = smoothstep(0.5, 0.05, r);
            vec3 gold = mix(vec3(0.78, 0.57, 0.31), vec3(1.0, 0.9, 0.7), vSeed);
            gl_FragColor = vec4(gold, glow * vAlpha);
            #include <colorspace_fragment>
          }
        `}
      />
    </points>
  )
}

function JourneyCamera({ reduced }: { reduced: boolean }) {
  const { camera, size } = useThree()
  const look = useRef(new THREE.Vector3(0, 2.25, -14))
  const target = useMemo(() => new THREE.Vector3(), [])
  const lookTarget = useMemo(() => new THREE.Vector3(), [])
  const waypoints = useMemo(() => [
    { p: 0, camera: [0, 2.35, 15] as [number, number, number], look: [0, 3.7, -17] as [number, number, number] },
    { p: 0.1, camera: [0, 2.7, -5] as [number, number, number], look: [0, 2.7, -46] as [number, number, number] },
    { p: 0.22, camera: [0.8, 2.4, -43] as [number, number, number], look: [0, 2.4, -78] as [number, number, number] },
    { p: 0.34, camera: [-1.4, 2.15, -92] as [number, number, number], look: [0, 2.1, -123] as [number, number, number] },
    { p: 0.48, camera: [0.5, 2.2, -147] as [number, number, number], look: [0, 2.7, -176] as [number, number, number] },
    { p: 0.62, camera: [0, 2.4, -197] as [number, number, number], look: [0, 2.3, -232] as [number, number, number] },
    { p: 0.76, camera: [-0.5, 2.1, -254] as [number, number, number], look: [0, 2.6, -287] as [number, number, number] },
    { p: 0.88, camera: [0, 2.0, -318] as [number, number, number], look: [0, 2.2, -347] as [number, number, number] },
    { p: 1, camera: [0, 2.0, -370] as [number, number, number], look: [0, 2.0, -391] as [number, number, number] },
  ], [])

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30)
    const p = scrollState.page
    let lower = waypoints[0]
    let upper = waypoints[waypoints.length - 1]
    for (let i = 0; i < waypoints.length - 1; i += 1) {
      if (p >= waypoints[i].p && p <= waypoints[i + 1].p) {
        lower = waypoints[i]
        upper = waypoints[i + 1]
        break
      }
    }
    const t = smoothstep(lower.p, upper.p, p)
    target.set(
      THREE.MathUtils.lerp(lower.camera[0], upper.camera[0], t),
      THREE.MathUtils.lerp(lower.camera[1], upper.camera[1], t),
      THREE.MathUtils.lerp(lower.camera[2], upper.camera[2], t),
    )
    lookTarget.set(
      THREE.MathUtils.lerp(lower.look[0], upper.look[0], t),
      THREE.MathUtils.lerp(lower.look[1], upper.look[1], t),
      THREE.MathUtils.lerp(lower.look[2], upper.look[2], t),
    )
    smoothPointer(delta, 1.9)
    const aspect = size.width / Math.max(1, size.height)
    const mobileFactor = reduced ? 0 : aspect < 0.9 ? 0.38 : 1
    target.x += pointer.sx * 0.5 * mobileFactor
    target.y += pointer.sy * 0.2 * mobileFactor + scrollState.velocity * 0.035
    lookTarget.x += pointer.sx * 0.22 * mobileFactor
    lookTarget.y += pointer.sy * 0.1 * mobileFactor
    const follow = reduced ? 1 : 1 - Math.exp(-2.1 * delta)
    camera.position.lerp(target, follow)
    look.current.lerp(lookTarget, follow)
    camera.lookAt(look.current)
    camera.rotation.z = reduced ? 0 : (-pointer.sx * 0.003 - scrollState.velocity * 0.002) * mobileFactor
  })

  return null
}

function RoyalWorld({ quality, started, reduced, onReady }: { quality: DeviceTier; started: boolean; reduced: boolean; onReady: () => void }) {
  const threadVisible = useRef(false)

  useFrame(() => {
    if (!threadVisible.current) {
      threadVisible.current = true
      onReady()
    }
  })

  return (
    <>
      <color attach="background" args={['#080605']} />
      <ambientLight intensity={0.31} color="#E0C8AA" />
      <hemisphereLight intensity={0.25} color="#E7CFAF" groundColor="#110A08" />
      <directionalLight position={[-7, 10, 9]} intensity={2.3} color="#F0D7AF" castShadow shadow-mapSize={[quality === 'high' ? 1536 : 768, quality === 'high' ? 1536 : 768]} />
      <pointLight position={[0, 6, -80]} intensity={13} distance={45} color="#D4A15E" />
      <pointLight position={[0, 4, -110]} intensity={11} distance={38} color="#BC7743" />
      <pointLight position={[0, 4, -167]} intensity={7} distance={28} color="#E4C388" />
      <pointLight position={[0, 5, -245]} intensity={12} distance={36} color="#D9AD70" />
      <PortalArch started={started} reduced={reduced} />
      <RoyalHall quality={quality} />
      <BeautyBust reduced={reduced} />
      <GoldenHairSculpture reduced={reduced} />
      <OrnateMirror quality={quality} />
      <ServiceSculptures />
      <RoyalProducts reduced={reduced} />
      <GoldenThread />
      <JourneyDust quality={quality} reduced={reduced} />
      {quality === 'high' && (
        <Environment resolution={64} frames={1}>
          <LightCards />
        </Environment>
      )}
      <JourneyCamera reduced={reduced} />
    </>
  )
}

export default function RoyalJourneyCanvas({
  tier,
  started,
  reduced,
  onSceneReady,
}: {
  tier: DeviceTier
  started: boolean
  reduced: boolean
  onSceneReady: () => void
}) {
  const effectiveTier = reduced ? 'low' : tier
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        className="!absolute inset-0"
        dpr={effectiveTier === 'high' ? [1, 1.45] : effectiveTier === 'medium' ? [1, 1.2] : 1}
        shadows={effectiveTier === 'high'}
        gl={{ alpha: false, antialias: effectiveTier === 'high', powerPreference: 'high-performance', stencil: false }}
        camera={{ fov: 44, near: 0.1, far: 600, position: [0, 2.35, 15] }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.08
        }}
      >
        <RoyalWorld quality={effectiveTier} started={started} reduced={reduced} onReady={onSceneReady} />
      </Canvas>
      <div className="royal-canvas-vignette absolute inset-0" />
    </div>
  )
}
