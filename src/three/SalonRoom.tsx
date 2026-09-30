import { useMemo, type ReactNode } from 'react'
import * as THREE from 'three'
import { MeshReflectorMaterial } from '@react-three/drei'
import {
  ArchedWindow,
  MirrorPanel,
  OliveTree,
  Pendant,
  SalonChair,
  SheerCurtain,
  SideConsole,
  StylingStation,
} from './objects'
import { travertineTexture } from './textures'

type Quality = 'high' | 'medium' | 'low'

/* ────────────────────────────────────────────────────────────────────────────
   The salon interior. A cutaway set: back wall, two returns, floor and ceiling,
   composed so the final camera framing reads like an editorial interior shot.
   ──────────────────────────────────────────────────────────────────────────── */

export function SalonRoom({ quality }: { quality: Quality }) {
  const floorTexture = useMemo(() => travertineTexture(3), [])
  floorTexture.rotation = 0

  const mirrorMaterial: ReactNode =
    quality === 'low' ? (
      <meshStandardMaterial color="#8C8880" metalness={0.94} roughness={0.2} envMapIntensity={1.6} />
    ) : (
      <MeshReflectorMaterial
        resolution={quality === 'high' ? 512 : 256}
        mixBlur={0.55}
        mixStrength={2.4}
        blur={[220, 60]}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.35}
        depthScale={1.1}
        depthToBlurRatioBias={0.28}
        mirror={0.82}
        color="#8A857C"
        metalness={0.72}
        roughness={0.42}
        distortion={0}
      />
    )

  return (
    <group>
      {/* ── Shell ─────────────────────────────────────────────────────────── */}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -3]} receiveShadow>
        <planeGeometry args={[22, 46]} />
        <meshStandardMaterial
          map={floorTexture}
          color="#EFE7DA"
          roughness={0.55}
          metalness={0.02}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2.7, -6.6]} receiveShadow>
        <planeGeometry args={[22, 5.4]} />
        <meshStandardMaterial color="#E9DFCF" roughness={0.95} />
      </mesh>

      {/* Side returns (cutaway walls) */}
      <mesh position={[-10.8, 2.7, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[34, 5.4]} />
        <meshStandardMaterial color="#E5DAC8" roughness={0.96} />
      </mesh>
      <mesh position={[10.8, 2.7, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[34, 5.4]} />
        <meshStandardMaterial color="#E3D8C6" roughness={0.96} />
      </mesh>

      {/* Ceiling + beams */}
      <mesh position={[0, 5.2, -3]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 46]} />
        <meshStandardMaterial color="#F1E9DC" roughness={1} />
      </mesh>
      {[-4.2, -0.6, 3].map((z) => (
        <mesh key={z} position={[0, 5.06, z]}>
          <boxGeometry args={[22, 0.28, 0.5]} />
          <meshStandardMaterial color="#EFE6D8" roughness={1} />
        </mesh>
      ))}

      {/* Floor pool of light under the window — a soft, cheap “sunbeam” */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4.6, 0.012, -3.2]}>
        <planeGeometry args={[7, 9]} />
        <meshBasicMaterial color="#FFEFD2" transparent opacity={0.3} depthWrite={false} />
      </mesh>

      {/* Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, 0.02, -2.6]} receiveShadow>
        <planeGeometry args={[9.5, 4.6]} />
        <meshStandardMaterial color="#DFD3BE" roughness={1} />
      </mesh>

      {/* ── Window, curtain, planting ─────────────────────────────────────── */}
      <ArchedWindow position={[-6.4, 0.85, -6.55]} width={3.1} height={3.5} />
      <SheerCurtain position={[-7.9, 2.6, -6.3]} width={2.3} height={3.9} folds={7} opacity={0.78} />
      <SheerCurtain position={[-4.9, 2.6, -6.28]} width={2.1} height={3.9} folds={6} opacity={0.66} />
      <SheerCurtain position={[-9.9, 2.6, -3.4]} rotation={[0, Math.PI / 2, 0]} width={4.2} height={3.9} folds={9} opacity={0.6} />

      <OliveTree position={[-6.5, 0, -4.5]} scale={1.05} seed={11} />

      {/* ── The mirror wall the camera travels past ───────────────────────── */}
      <MirrorPanel position={[10.6, 1.9, 0.6]} rotation={[0, -Math.PI / 2, 0]} width={2.4} height={3.7} />
      <MirrorPanel position={[10.6, 1.9, 4.4]} rotation={[0, -Math.PI / 2, 0]} width={2.0} height={3.4} />

      {/* ── Stations ──────────────────────────────────────────────────────── */}
      <StylingStation position={[-2.95, 0, -6.5]} quality={quality} />
      <StylingStation position={[0, 0, -6.5]} quality={quality} />
      <StylingStation position={[2.95, 0, -6.5]} quality={quality} />

      {/* Real-reflection plane sits on the centre mirror only (perf) */}
      <mesh position={[0, 2.05, -6.44]}>
        <planeGeometry args={[1.05, 1.83]} />
        {mirrorMaterial}
      </mesh>

      {/* ── Furniture ─────────────────────────────────────────────────────── */}
      <SalonChair position={[-1.25, 0, -3.2]} rotation={[0, 0.4, 0]} quality={quality} />
      <SalonChair position={[2.1, 0, -3.6]} rotation={[0, -0.28, 0]} quality={quality} />
      <SalonChair position={[5.4, 0, -4.2]} rotation={[0, -0.55, 0]} quality={quality} />
      {/* By the window — carried into frame by the portrait camera composition */}
      <SalonChair position={[-5.4, 0, -4.0]} rotation={[0, 0.95, 0]} quality={quality} />
      <SideConsole position={[6.9, 0, -5.2]} />

      {/* ── Lighting fixtures ─────────────────────────────────────────────── */}
      <Pendant position={[-1.9, 4.05, -2.2]} />
      {quality !== 'low' && <Pendant position={[3.1, 4.05, -2.6]} />}
      <Pendant position={[-5.4, 4.05, -1.0]} />

      {/* Tall floor mirror leaning on the left return */}
      <MirrorPanel position={[-10.2, 1.7, 0.4]} rotation={[0, Math.PI / 2, 0]} width={1.9} height={3.3} />
    </group>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   A light-card environment. Instead of downloading an HDRI we render four
   emissive planes into a cube target once — brass, glass and stone then have
   believable warm reflections at zero network cost.
   ──────────────────────────────────────────────────────────────────────────── */

export function LightCards() {
  return (
    <>
      <mesh position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial color="#FFF6E6" toneMapped={false} />
      </mesh>
      <mesh position={[-9, 3, 1]} rotation={[0, Math.PI / 2.4, 0]}>
        <planeGeometry args={[8, 7]} />
        <meshBasicMaterial color="#FFE3B8" toneMapped={false} />
      </mesh>
      <mesh position={[9.5, 3, -1]} rotation={[0, -Math.PI / 2.2, 0]}>
        <planeGeometry args={[7, 6]} />
        <meshBasicMaterial color="#F0E4D2" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.4, 8]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[12, 5]} />
        <meshBasicMaterial color="#EFE6D6" toneMapped={false} />
      </mesh>
      <mesh position={[0, 2.2, -7.6]}>
        <planeGeometry args={[12, 6]} />
        <meshBasicMaterial color="#E7DCC8" toneMapped={false} />
      </mesh>
    </>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Scene lighting — one shadow-casting key light, everything else is fill.
   ──────────────────────────────────────────────────────────────────────────── */

export function SceneLights({ quality }: { quality: Quality }) {
  const shadowSize = quality === 'high' ? 1024 : 512
  const keyRef = useMemo(() => ({ current: null as THREE.DirectionalLight | null }), [])

  return (
    <>
      <ambientLight intensity={0.42} color="#FFF4E4" />
      <hemisphereLight intensity={0.55} color="#FFF8EE" groundColor="#C3B49B" />

      {/* Key: low sun through the arched window */}
      <directionalLight
        ref={(el) => {
          keyRef.current = el
        }}
        position={[-11, 5.4, 3.4]}
        intensity={2.5}
        color="#FFE1B6"
        castShadow
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-camera-near={1}
        shadow-camera-far={32}
        shadow-camera-left={-13}
        shadow-camera-right={13}
        shadow-camera-top={9}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0006}
        shadow-normalBias={0.02}
      />

      {/* Rim from the right, keeps brass edges alive */}
      <directionalLight position={[9, 4, 4]} intensity={0.5} color="#FFEED8" />
      {/* Gentle front fill so nothing crushes to black */}
      <directionalLight position={[0, 2.4, 8]} intensity={0.32} color="#FFF6E8" />
    </>
  )
}
