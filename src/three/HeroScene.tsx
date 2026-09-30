import { Suspense, useState } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Environment, PerformanceMonitor } from '@react-three/drei'
import { CameraRig, DustParticles } from './CameraRig'
import { LightCards, SalonRoom, SceneLights } from './SalonRoom'
import type { DeviceTier } from '../hooks/useResponsive'

/**
 * The hero 3D scene. Loaded lazily (see Hero.tsx) so the shell of the page can
 * paint immediately, and unmounted once the visitor has scrolled well past it.
 */

export default function HeroScene({
  started,
  tier,
  reduced,
  onFirstFrame,
}: {
  started: boolean
  tier: DeviceTier
  reduced: boolean
  onFirstFrame?: () => void
}) {
  const [dpr, setDpr] = useState(tier === 'high' ? 1.75 : 1.35)
  const particleCount = tier === 'high' ? 1500 : tier === 'medium' ? 800 : 320

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={dpr}
      shadows={tier !== 'low'}
      gl={{
        antialias: tier === 'high',
        powerPreference: 'high-performance',
        alpha: false,
        stencil: false,
      }}
      camera={{ fov: 42, near: 0.1, far: 70, position: [0, 3.75, 13.6] }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.06
        gl.outputColorSpace = THREE.SRGBColorSpace
        scene.background = new THREE.Color('#E7DCC9')
        // Signal that the WebGL context is alive so the loader can hand over.
        onFirstFrame?.()
      }}
    >
      <fog attach="fog" args={['#E3D8C5', 12, 40]} />

      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
        onIncline={() => setDpr((d) => Math.min(tier === 'high' ? 1.75 : 1.35, d + 0.25))}
      />

      <SceneLights quality={tier} />

      <Suspense fallback={null}>
        {/* A one-off cube render of five emissive cards — reflections without a download */}
        <Environment resolution={tier === 'high' ? 128 : 64} frames={1}>
          <LightCards />
        </Environment>
        <SalonRoom quality={tier} />
      </Suspense>

      <DustParticles count={particleCount} reduced={reduced} />
      <CameraRig started={started} quality={tier} reduced={reduced} />
    </Canvas>
  )
}
