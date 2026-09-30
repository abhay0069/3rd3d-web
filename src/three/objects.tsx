import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { PALETTE as C, plasterTexture } from './textures'

/* ────────────────────────────────────────────────────────────────────────────
   Materials — shared instances so we keep the draw-call / program count low.
   ──────────────────────────────────────────────────────────────────────────── */

export interface SalonMaterials {
  brass: THREE.MeshStandardMaterial
  darkBrass: THREE.MeshStandardMaterial
  boucle: THREE.MeshStandardMaterial
  ivoryStone: THREE.MeshStandardMaterial
  charcoal: THREE.MeshStandardMaterial
  plaster: THREE.MeshStandardMaterial
  amber: THREE.MeshPhysicalMaterial
}

let shared: SalonMaterials | null = null

/**
 * One material set for the whole room.
 *
 * There are ~15 pieces of furniture in the set; creating a fresh palette for
 * each of them would mean a hundred materials and a hundred uniform uploads per
 * frame. Three.js materials are safe to share across meshes, so we build them
 * once and hand out the same instances everywhere.
 */
export function salonMaterials(): SalonMaterials {
  if (shared) return shared
  shared = {
    brass: new THREE.MeshStandardMaterial({
      color: C.brass,
      metalness: 1,
      roughness: 0.3,
      envMapIntensity: 1.15,
    }),
    darkBrass: new THREE.MeshStandardMaterial({
      color: C.deepBrass,
      metalness: 1,
      roughness: 0.45,
      envMapIntensity: 0.9,
    }),
    boucle: new THREE.MeshStandardMaterial({ color: '#EFE7DA', roughness: 0.92, metalness: 0 }),
    ivoryStone: new THREE.MeshStandardMaterial({ color: '#F1EADF', roughness: 0.62, metalness: 0 }),
    charcoal: new THREE.MeshStandardMaterial({ color: C.charcoal, roughness: 0.62, metalness: 0.05 }),
    plaster: new THREE.MeshStandardMaterial({
      color: '#E9DFCF',
      roughness: 0.95,
      metalness: 0,
      map: plasterTexture(2),
    }),
    amber: new THREE.MeshPhysicalMaterial({
      color: '#8A5A28',
      roughness: 0.22,
      metalness: 0,
      transmission: 0.65,
      thickness: 0.4,
      ior: 1.45,
    }),
  }
  return shared
}

/* ────────────────────────────────────────────────────────────────────────────
   Salon chair — a swivel styling chair, built from primitives.
   ──────────────────────────────────────────────────────────────────────────── */

export function SalonChair({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  quality = 'high',
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  quality?: 'high' | 'medium' | 'low'
}) {
  const m = salonMaterials()
  const smoothness = quality === 'high' ? 3 : 1

  return (
    <group position={position} rotation={rotation}>
      {/* Aluminium base & gas column */}
      <mesh castShadow position={[0, 0.03, 0]} material={m.darkBrass}>
        <cylinderGeometry args={[0.32, 0.34, 0.05, 24]} />
      </mesh>
      <mesh castShadow position={[0, 0.26, 0]} material={m.darkBrass}>
        <cylinderGeometry args={[0.05, 0.055, 0.42, 16]} />
      </mesh>

      {/* Seat */}
      <RoundedBox
        args={[0.66, 0.15, 0.62]}
        radius={0.06}
        smoothness={smoothness}
        position={[0, 0.54, 0]}
        castShadow
        receiveShadow
        material={m.boucle}
      />

      {/* Backrest — gently tilted, wrapping the shoulders */}
      <group position={[0, 0.98, -0.28]} rotation={[-0.1, 0, 0]}>
        <RoundedBox
          args={[0.68, 0.86, 0.16]}
          radius={0.075}
          smoothness={smoothness}
          castShadow
          material={m.boucle}
        />
      </group>

      {/* Armrests */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.4, 0.7, 0.02]}>
          <RoundedBox
            args={[0.09, 0.09, 0.5]}
            radius={0.04}
            smoothness={smoothness}
            castShadow
            material={m.boucle}
          />
          <mesh position={[0, -0.13, 0.18]} castShadow material={m.brass}>
            <cylinderGeometry args={[0.022, 0.022, 0.26, 10]} />
          </mesh>
        </group>
      ))}

      {/* Footrest */}
      <mesh position={[0, 0.22, 0.38]} rotation={[0.5, 0, 0]} material={m.brass}>
        <torusGeometry args={[0.13, 0.016, 8, 20, Math.PI]} />
      </mesh>
    </group>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Styling station — console, brass-framed mirror, wall sconce, product still-life.
   ──────────────────────────────────────────────────────────────────────────── */

export function StylingStation({
  position = [0, 0, 0],
  quality = 'high',
}: {
  position?: [number, number, number]
  quality?: 'high' | 'medium' | 'low'
}) {
  const m = salonMaterials()
  const smoothness = quality === 'high' ? 3 : 1

  return (
    <group position={position}>
      {/* Framed mirror */}
      <group position={[0, 2.05, 0.02]}>
        <mesh castShadow material={m.brass}>
          <boxGeometry args={[1.2, 1.98, 0.05]} />
        </mesh>
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[1.08, 1.86]} />
          <meshStandardMaterial
            color="#8C8880"
            metalness={0.96}
            roughness={0.16}
            envMapIntensity={1.4}
          />
        </mesh>
        {/* Inner bevel highlight */}
        <mesh position={[0, 0, 0.034]}>
          <ringGeometry args={[0.99, 1.0, 4]} />
          <meshBasicMaterial color="#E9DFCF" transparent opacity={0.12} />
        </mesh>
      </group>

      {/* Console */}
      <group position={[0, 0.94, 0.2]}>
        <mesh castShadow receiveShadow material={m.ivoryStone}>
          <boxGeometry args={[1.34, 0.055, 0.46]} />
        </mesh>
        {[-0.55, 0.55].map((x) => (
          <mesh key={x} position={[x, -0.47, 0]} material={m.brass}>
            <cylinderGeometry args={[0.012, 0.012, 0.94, 8]} />
          </mesh>
        ))}
      </group>

      {/* Product still-life: serum bottle, pump bottle, folded towel */}
      <group position={[0, 1.0, 0.2]}>
        <mesh castShadow position={[-0.34, 0.09, 0.02]} material={m.amber}>
          <cylinderGeometry args={[0.042, 0.048, 0.18, 16]} />
        </mesh>
        <mesh position={[-0.34, 0.2, 0.02]} material={m.brass}>
          <cylinderGeometry args={[0.018, 0.02, 0.05, 12]} />
        </mesh>
        <mesh castShadow position={[0.06, 0.11, 0.0]} material={m.ivoryStone}>
          <cylinderGeometry args={[0.05, 0.05, 0.22, 20]} />
        </mesh>
        <mesh position={[0.06, 0.245, 0.0]} material={m.charcoal}>
          <cylinderGeometry args={[0.014, 0.02, 0.05, 12]} />
        </mesh>
        <RoundedBox
          args={[0.2, 0.05, 0.16]}
          radius={0.02}
          smoothness={smoothness}
          position={[0.4, 0.025, 0.02]}
          castShadow
          material={m.boucle}
        />
        {/* Accent object */}
        {quality !== 'low' && (
          <mesh castShadow position={[0.4, 0.14, -0.12]} material={m.charcoal}>
            <sphereGeometry args={[0.06, 16, 12]} />
          </mesh>
        )}
      </group>

      {/* Vertically-stacked brass sconce */}
      <group position={[-0.92, 2.35, 0.06]}>
        <mesh material={m.brass}>
          <boxGeometry args={[0.06, 1.0, 0.05]} />
        </mesh>
        <mesh position={[0.035, 0, 0]}>
          <planeGeometry args={[0.055, 0.9]} />
          <meshBasicMaterial color="#FFE4B5" toneMapped={false} />
        </mesh>
      </group>

      {/* Under-counter stool */}
      <group position={[0.0, 0, 0.95]}>
        <mesh castShadow material={m.charcoal}>
          <cylinderGeometry args={[0.19, 0.17, 0.07, 24]} />
        </mesh>
        <mesh position={[0, -0.26, 0]} material={m.darkBrass}>
          <cylinderGeometry args={[0.028, 0.03, 0.5, 12]} />
        </mesh>
        <mesh position={[0, -0.5, 0]} material={m.darkBrass}>
          <cylinderGeometry args={[0.16, 0.17, 0.03, 20]} />
        </mesh>
      </group>
    </group>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Sheer curtain — a plane deformed into soft folds.
   ──────────────────────────────────────────────────────────────────────────── */

export function SheerCurtain({
  position,
  rotation = [0, 0, 0],
  width = 2.2,
  height = 3.6,
  folds = 7,
  opacity = 0.72,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  folds?: number
  opacity?: number
}) {
  const geometry = useMemo(() => {
    const seg = 40
    const geo = new THREE.PlaneGeometry(width, height, seg, 6)
    const pos = geo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const u = (x / width + 0.5) * Math.PI * 2 * folds
      const taper = 0.85 + 0.15 * (y / height + 0.5)
      pos.setZ(i, Math.sin(u) * 0.11 * taper)
      pos.setX(i, x + Math.sin(u * 0.5) * 0.02)
    }
    geo.computeVertexNormals()
    return geo
  }, [width, height, folds])

  return (
    <mesh position={position} rotation={rotation} geometry={geometry}>
      <meshStandardMaterial
        color="#FBF6EC"
        roughness={0.98}
        metalness={0}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Arched window with warm daylight behind it.
   ──────────────────────────────────────────────────────────────────────────── */

export function ArchedWindow({
  position = [0, 0, 0],
  width = 3.2,
  height = 3.4,
}: {
  position?: [number, number, number]
  width?: number
  height?: number
}) {
  const shape = useMemo(() => {
    const w = width / 2
    const h = height - w
    const s = new THREE.Shape()
    s.moveTo(-w, 0)
    s.lineTo(-w, h)
    s.absarc(0, h, w, Math.PI, 0, true)
    s.lineTo(w, 0)
    s.lineTo(-w, 0)
    return s
  }, [width, height])

  return (
    <group position={position}>
      {/* Glow panel — reads as blown-out daylight */}
      <mesh position={[0, height / 2, 0.02]}>
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial color="#FFF6E4" toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {/* Brass reveal */}
      <mesh position={[0, height / 2, -0.01]}>
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial color={C.brass} side={THREE.DoubleSide} transparent opacity={0.18} />
      </mesh>
    </group>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Olive tree — instanced foliage, cheap and reads beautifully in silhouette.
   ──────────────────────────────────────────────────────────────────────────── */

export function OliveTree({
  position = [0, 0, 0],
  scale = 1,
  seed = 7,
}: {
  position?: [number, number, number]
  scale?: number
  seed?: number
}) {
  const foliage = useRef<THREE.InstancedMesh>(null!)
  const COUNT = 120

  useLayoutEffect(() => {
    const mesh = foliage.current
    if (!mesh) return
    const dummy = new THREE.Object3D()
    // deterministic pseudo-random so the tree never re-shuffles between renders
    let s = seed * 9301
    const rnd = () => {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
    for (let i = 0; i < COUNT; i++) {
      const branch = Math.floor(rnd() * 5)
      const angle = (branch / 5) * Math.PI * 2 + rnd() * 0.5
      const radius = 0.35 + rnd() * 0.75
      const y = 1.85 + rnd() * 1.25
      dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius * 0.8)
      dummy.rotation.set(rnd() * Math.PI, rnd() * Math.PI, rnd() * Math.PI)
      const sc = 0.1 + rnd() * 0.09
      dummy.scale.set(sc * (1.5 + rnd()), sc * 0.42, sc * 0.42)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [seed])

  const m = salonMaterials()

  return (
    <group position={position} scale={scale}>
      {/* Clay pot */}
      <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.34, 0.26, 0.6, 28]} />
        <meshStandardMaterial color="#C9A483" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.37, 0.36, 0.08, 28]} />
        <meshStandardMaterial color="#BD9776" roughness={0.9} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.64, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 0.03, 24]} />
        <meshStandardMaterial color="#3A2E22" roughness={1} />
      </mesh>
      {/* Trunk + primaries */}
      <mesh castShadow position={[0, 1.24, 0]} material={m.charcoal}>
        <cylinderGeometry args={[0.035, 0.07, 1.25, 10]} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.35, 2.05, Math.sin(a) * 0.3]}
            rotation={[Math.cos(a) * 0.5, 0, -Math.sin(a) * 0.6]}
            material={m.charcoal}
          >
            <cylinderGeometry args={[0.012, 0.028, 1.2, 8]} />
          </mesh>
        )
      })}
      {/* Foliage */}
      <instancedMesh ref={foliage} args={[undefined, undefined, COUNT]} castShadow>
        <sphereGeometry args={[1, 7, 5]} />
        <meshStandardMaterial color="#6E7A52" roughness={0.85} metalness={0} />
      </instancedMesh>
    </group>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Pendant light — brass cone with a warm emissive core.
   ──────────────────────────────────────────────────────────────────────────── */

export function Pendant({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const m = salonMaterials()
  return (
    <group position={position}>
      <mesh position={[0, 1.1, 0]} material={m.brass}>
        <cylinderGeometry args={[0.008, 0.008, 2.2, 6]} />
      </mesh>
      <mesh castShadow position={[0, 0, 0]} material={m.brass}>
        <coneGeometry args={[0.2, 0.28, 28, 1, true]} />
      </mesh>
      <mesh position={[0, -0.09, 0]}>
        <sphereGeometry args={[0.055, 14, 10]} />
        <meshBasicMaterial color="#FFE1B0" toneMapped={false} />
      </mesh>
      <pointLight position={[0, -0.35, 0]} intensity={2.2} distance={5.5} color="#FFCF95" />
    </group>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Slim console with a stack of towels — right-hand side of the composition.
   ──────────────────────────────────────────────────────────────────────────── */

export function SideConsole({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const m = salonMaterials()
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.8, 0]} material={m.ivoryStone}>
        <boxGeometry args={[1.6, 0.06, 0.44]} />
      </mesh>
      {[
        [-0.72, -0.2],
        [0.72, -0.2],
        [-0.72, 0.2],
        [0.72, 0.2],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.4, z]} material={m.brass}>
          <cylinderGeometry args={[0.013, 0.013, 0.8, 8]} />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => (
        <RoundedBox
          key={i}
          args={[0.34, 0.06, 0.26]}
          radius={0.022}
          smoothness={2}
          position={[-0.4, 0.86 + i * 0.062, 0]}
          rotation={[0, i * 0.15, 0]}
          castShadow
          material={i === 2 ? m.boucle : m.ivoryStone}
        />
      ))}
      <mesh castShadow position={[0.42, 0.92, 0]} material={m.amber}>
        <cylinderGeometry args={[0.05, 0.055, 0.2, 16]} />
      </mesh>
      {/* Ceramic vase */}
      <mesh castShadow position={[0.72, 0.95, 0]} material={m.charcoal}>
        <sphereGeometry args={[0.1, 18, 14]} />
      </mesh>
    </group>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Full-height mirror panel — the "wall of glass" the camera travels past.
   ──────────────────────────────────────────────────────────────────────────── */

export function MirrorPanel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 2.6,
  height = 3.6,
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
}) {
  const m = salonMaterials()
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow material={m.brass}>
        <boxGeometry args={[width + 0.09, height + 0.09, 0.05]} />
      </mesh>
      <mesh position={[0, 0, 0.032]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#9C978D"
          metalness={0.97}
          roughness={0.13}
          envMapIntensity={1.6}
        />
      </mesh>
    </group>
  )
}
