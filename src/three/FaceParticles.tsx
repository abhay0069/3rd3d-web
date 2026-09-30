import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { pointer, smoothPointer } from '../lib/pointer'
import type { DeviceTier } from '../hooks/useResponsive'

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

interface Cloud {
  scatter: Float32Array
  target: Float32Array
  colors: Float32Array
  sizes: Float32Array
  count: number
  width: number
  height: number
}

/**
 * Sampling window inside the photograph. The DOM portrait uses the same crop
 * (object-cover inside a 1.13 box), so the particles and the photograph line up
 * exactly when the face dissolves into it.
 */
const CROP = { x0: 0.2, x1: 0.8, y0: 0.02, y1: 0.99 }

/**
 * Samples a portrait and turns it into ~7,000 particles.
 *
 * Bright pixels become more, and larger, particles — so the face builds itself
 * out of light rather than being traced as an outline. Hair edges get a sparse,
 * feathered halo, which is exactly the effect we want in the dissolve.
 */
async function buildCloud(src: string, budget: number): Promise<Cloud> {
  const img = new Image()
  img.src = src
  await (img.decode ? img.decode() : new Promise((res, rej) => ((img.onload = res), (img.onerror = rej))))

  const W = 220
  const H = Math.round((img.height / img.width) * W)
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, 0, 0, W, H)
  const { data } = ctx.getImageData(0, 0, W, H)

  type Candidate = { x: number; y: number; l: number; r: number; g: number; b: number }
  const candidates: Candidate[] = []

  const sx0 = Math.floor(W * CROP.x0)
  const sx1 = Math.ceil(W * CROP.x1)
  const sy0 = Math.floor(H * CROP.y0)
  const sy1 = Math.ceil(H * CROP.y1)
  const cropW = sx1 - sx0
  const cropH = sy1 - sy0
  const aspect = cropW / cropH

  for (let y = sy0; y < sy1; y++) {
    for (let x = sx0; x < sx1; x++) {
      const i = (y * W + x) * 4
      const r = data[i] / 255
      const g = data[i + 1] / 255
      const b = data[i + 2] / 255
      const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) * (data[i + 3] / 255)
      if (l < 0.055) continue

      // normalise to a -1…1 plane, preserving the crop's aspect
      const nx = ((x - sx0) / cropW - 0.5) * 2 * aspect
      const ny = -((y - sy0) / cropH - 0.5) * 2
      candidates.push({ x: nx, y: ny, l, r, g, b })
    }
  }

  const count = Math.min(budget, candidates.length)
  const target = new Float32Array(count * 3)
  const scatter = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  // Weight the draw by luminance so highlights read strongest.
  const totalWeight = candidates.reduce((acc, c) => acc + 0.15 + c.l, 0)

  for (let i = 0; i < count; i++) {
    // importance sampling without sorting a huge array
    let pick = Math.random() * totalWeight
    let idx = 0
    while (pick > 0 && idx < candidates.length - 1) {
      pick -= 0.15 + candidates[idx].l
      idx++
    }
    const c = candidates[idx]

    target[i * 3] = c.x
    target[i * 3 + 1] = c.y
    target[i * 3 + 2] = (Math.random() - 0.5) * 0.14

    // scattered home position — a wide, soft cloud the particles gather from
    const theta = Math.random() * Math.PI * 2
    const radius = 1.6 + Math.random() * 3.4
    scatter[i * 3] = Math.cos(theta) * radius
    scatter[i * 3 + 1] = Math.sin(theta) * radius * 0.7
    scatter[i * 3 + 2] = (Math.random() - 0.5) * 2.4

    // Warm the sampled colour towards champagne/ivory — never neon, never a raw photo
    const warm = 0.42 + c.l * 0.35
    colors[i * 3] = Math.min(1, c.r * 0.55 + warm * 0.92)
    colors[i * 3 + 1] = Math.min(1, c.g * 0.5 + warm * 0.8)
    colors[i * 3 + 2] = Math.min(1, c.b * 0.45 + warm * 0.63)

    sizes[i] = 0.7 + c.l * 1.5 + Math.random() * 0.35
  }

  return { scatter, target, colors, sizes, count, width: 2 * aspect, height: 2 }
}

function ParticleFace({
  src,
  budget,
  reduced,
  containerRef,
  onReady,
}: {
  src: string
  budget: number
  reduced: boolean
  containerRef: React.RefObject<HTMLElement>
  onReady?: () => void
}) {
  const [cloud, setCloud] = useState<Cloud | null>(null)
  const { size } = useThree()

  useEffect(() => {
    let alive = true
    buildCloud(src, budget).then((c) => {
      if (alive) {
        setCloud(c)
        onReady?.()
      }
    })
    return () => {
      alive = false
    }
  }, [src, budget, onReady])

  const geometry = useMemo(() => {
    if (!cloud) return null
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(cloud.scatter, 3))
    geo.setAttribute('aTarget', new THREE.BufferAttribute(cloud.target, 3))
    geo.setAttribute('aColor', new THREE.BufferAttribute(cloud.colors, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(cloud.sizes, 1))
    return geo
  }, [cloud])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uDisperse: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uPointerStrength: { value: 0 },
      uSize: { value: 5.4 },
      uPixelRatio: { value: 1 },
      uOpacity: { value: 0 },
      uAspect: { value: 1 },
      /** how much the cloud is scaled to fit the viewport */
      uFit: { value: 0.62 },
    }),
    [],
  )

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30)
    const el = containerRef.current
    uniforms.uTime.value += delta
    uniforms.uPixelRatio.value = state.gl.getPixelRatio()
    uniforms.uAspect.value = size.width / Math.max(1, size.height)

    // Fit the portrait to whatever viewport we are given
    if (cloud) {
      const cam = state.camera as THREE.PerspectiveCamera
      const dist = Math.abs(cam.position.z)
      const visibleH = 2 * Math.tan(((cam.fov * Math.PI) / 180) / 2) * dist
      const visibleW = visibleH * (size.width / Math.max(1, size.height))
      const fit = Math.min(visibleW / cloud.width, visibleH / cloud.height) * 0.9
      uniforms.uFit.value += (fit - uniforms.uFit.value) * 0.12
    }

    smoothPointer(delta, 1.8)
    uniforms.uPointer.value.set(pointer.sx, pointer.sy)
    uniforms.uPointerStrength.value +=
      ((pointer.active ? 0.55 : 0) + pointer.velocity * 1.2 - uniforms.uPointerStrength.value) * 0.07

    if (!el) return

    // progress through the sticky section
    const rect = el.getBoundingClientRect()
    const span = Math.max(1, rect.height - window.innerHeight)
    const p = clamp(-rect.top / span)

    // gather → hold → dissolve
    const gather = smoothstep(0.04, 0.3, p)
    const dissolve = smoothstep(0.7, 0.98, p)
    const morphTarget = reduced ? 1 : gather * (1 - dissolve)
    uniforms.uMorph.value += (morphTarget - uniforms.uMorph.value) * (reduced ? 1 : 0.045)
    uniforms.uDisperse.value += (dissolve * 1.6 - uniforms.uDisperse.value) * 0.05

    // the cloud breathes with the scroll and only becomes visible as it gathers
    const opacityTarget = reduced ? 0.9 : clamp(smoothstep(0, 0.12, p)) * (0.55 + 0.45 * uniforms.uMorph.value)
    uniforms.uOpacity.value += (opacityTarget - uniforms.uOpacity.value) * 0.06
  })

  if (!geometry) return null

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          uniform float uTime;
          uniform float uMorph;
          uniform float uDisperse;
          uniform vec2  uPointer;
          uniform float uPointerStrength;
          uniform float uSize;
          uniform float uPixelRatio;
          uniform float uAspect;
          uniform float uFit;

          attribute vec3  aTarget;
          attribute vec3  aColor;
          attribute float aSize;

          varying vec3  vColor;
          varying float vAlpha;

          void main() {
            // ---- formation ----
            vec3 home = mix(position, aTarget, uMorph);

            // the whole portrait turns, very slightly, towards the cursor
            float turn = uPointer.x * 0.06 * uMorph;
            float tilt = uPointer.y * 0.04 * uMorph;
            home.x += turn * (1.0 - abs(aTarget.y) * 0.35);
            home.y += tilt * (1.0 - abs(aTarget.x) * 0.25);
            home.x += aTarget.y * turn * 0.5; // a hint of yaw, not a rotation

            // ---- life: a slow drift, stronger while scattered ----
            float t = uTime * 0.5;
            float loose = 1.0 - uMorph * 0.82;
            home.x += sin(t + aTarget.y * 3.1) * 0.02 * loose;
            home.y += cos(t * 0.85 + aTarget.x * 2.4) * 0.022 * loose;
            home.z += sin(t * 0.7 + aTarget.x * 5.0) * 0.05 * loose;

            // ---- dispersion on exit: particles stream up and outward ----
            home += normalize(home + vec3(0.001)) * uDisperse * (0.5 + aSize * 0.4);
            home.y += uDisperse * 0.55 * aSize;

            // ---- cursor: particles part softly around the pointer ----
            vec2 focal = uPointer * vec2(1.45, 0.95);
            vec2 d = home.xy - focal;
            float dist = length(d) + 0.001;
            float push = smoothstep(0.72, 0.0, dist) * (0.22 + uPointerStrength);
            home.xy += (d / dist) * push * 0.4;

            // ---- fit the formation to the viewport ----
            home.xy *= uFit;

            vec4 mv = modelViewMatrix * vec4(home, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = uSize * aSize * uPixelRatio * (1.0 / max(0.35, -mv.z));

            vColor = aColor;
            float fade = smoothstep(11.0, 5.0, -mv.z);
            vAlpha = (0.25 + 0.75 * aSize * 0.6) * fade;
          }
        `}
        fragmentShader={/* glsl */ `
          uniform float uOpacity;
          varying vec3  vColor;
          varying float vAlpha;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float r = length(uv);
            if (r > 0.5) discard;
            float a = smoothstep(0.5, 0.05, r);
            gl_FragColor = vec4(vColor, a * a * vAlpha * uOpacity);
            #include <colorspace_fragment>
          }
        `}
      />
    </points>
  )
}

export default function FaceParticles({
  src,
  tier,
  reduced,
  containerRef,
  onReady,
}: {
  src: string
  tier: DeviceTier
  reduced: boolean
  containerRef: React.RefObject<HTMLElement>
  onReady?: () => void
}) {
  const budget = reduced ? 2600 : tier === 'high' ? 7600 : tier === 'medium' ? 4600 : 2400

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={tier === 'high' ? 1.6 : 1.25}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance', stencil: false }}
      camera={{ fov: 40, position: [0, 0, 4.6], near: 0.1, far: 30 }}
    >
      <ParticleFace src={src} budget={budget} reduced={reduced} containerRef={containerRef} onReady={onReady} />
    </Canvas>
  )
}
