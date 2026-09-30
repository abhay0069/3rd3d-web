import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { pointer, smoothPointer } from '../lib/pointer'
import { scrollState } from '../lib/scroll'

type Quality = 'high' | 'medium' | 'low'

/**
 * Cinematic camera choreography.
 *
 *  • Intro   — starts outside/above the set and glides down into the room.
 *  • Pointer — a light parallax that follows the cursor with a soft spring.
 *  • Scroll  — travelling forward through the room, past the mirror wall, so the
 *             3D set can dissolve into the studio photograph with continuity.
 *
 * All three are layered into one target position and then critically damped, so
 * the camera never snaps and the motion always reads as one continuous move.
 */

/**
 * Two composed camera moves, blended by viewport shape.
 *
 * Landscape frames the full station wall — three mirrors, the arched window and
 * the olive tree, all inside the frame even at 21:9. Portrait cannot hold that
 * much width without shrinking everything, so the phone gets its own move: the
 * camera turns to the window end of the room, where a chair, the tree, the
 * curtains and one station stack naturally into a vertical composition.
 */
const LANDSCAPE = {
  from: new THREE.Vector3(0, 3.75, 13.6),
  to: new THREE.Vector3(0, 1.7, 6.6),
  lookFrom: new THREE.Vector3(0.2, 2.15, -2),
  lookTo: new THREE.Vector3(0, 1.75, -2.4),
  scrollTo: new THREE.Vector3(1.15, 1.9, 0.25),
  scrollLook: new THREE.Vector3(0.55, 1.95, -6.6),
}

const PORTRAIT = {
  from: new THREE.Vector3(-4.9, 3.6, 12.4),
  to: new THREE.Vector3(-4.9, 1.85, 5.6),
  lookFrom: new THREE.Vector3(-4.4, 2.35, -2),
  lookTo: new THREE.Vector3(-4.4, 1.9, -6.5),
  scrollTo: new THREE.Vector3(-4.6, 1.85, 2.6),
  scrollLook: new THREE.Vector3(-4.6, 1.95, -6.5),
}

/** 0 = landscape composition, 1 = portrait composition */
function portraitFactor(aspect: number) {
  const t = Math.min(1, Math.max(0, (aspect - 0.78) / (1.16 - 0.78)))
  return 1 - t * t * (3 - 2 * t)
}

const easeInOutCine = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export function CameraRig({
  started,
  quality,
  reduced,
}: {
  started: boolean
  quality: Quality
  reduced: boolean
}) {
  const { camera, size } = useThree()
  const progress = useRef(0)
  const lookAt = useRef(LANDSCAPE.lookFrom.clone())
  const target = useMemo(() => new THREE.Vector3().copy(LANDSCAPE.from), [])
  const tmpLook = useMemo(() => new THREE.Vector3(), [])
  const baseLook = useMemo(() => new THREE.Vector3(), [])
  const tmpVec = useMemo(() => new THREE.Vector3(), [])
  const tmpLook2 = useMemo(() => new THREE.Vector3(), [])
  const parallaxScale = quality === 'low' ? 0.45 : 1

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30)

    // intro timeline
    if (reduced) {
      progress.current = 1
    } else if (started && progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta / 3.4)
    }
    const intro = easeInOutCine(progress.current)

    smoothPointer(delta, 2.1)

    // Which of the two compositions are we in? (re-read every frame: cheap, and
    // it means rotating a phone or resizing a window re-blends the move)
    const pf = portraitFactor(size.width / Math.max(1, size.height))

    // base pose = intro blend, blended between the two compositions
    target.set(
      THREE.MathUtils.lerp(LANDSCAPE.from.x, PORTRAIT.from.x, pf),
      THREE.MathUtils.lerp(LANDSCAPE.from.y, PORTRAIT.from.y, pf),
      THREE.MathUtils.lerp(LANDSCAPE.from.z, PORTRAIT.from.z, pf),
    )
    tmpLook.set(
      THREE.MathUtils.lerp(LANDSCAPE.lookFrom.x, PORTRAIT.lookFrom.x, pf),
      THREE.MathUtils.lerp(LANDSCAPE.lookFrom.y, PORTRAIT.lookFrom.y, pf),
      THREE.MathUtils.lerp(LANDSCAPE.lookFrom.z, PORTRAIT.lookFrom.z, pf),
    )
    baseLook.set(
      THREE.MathUtils.lerp(LANDSCAPE.to.x, PORTRAIT.to.x, pf),
      THREE.MathUtils.lerp(LANDSCAPE.to.y, PORTRAIT.to.y, pf),
      THREE.MathUtils.lerp(LANDSCAPE.to.z, PORTRAIT.to.z, pf),
    )
    target.lerp(baseLook, intro)

    tmpLook.set(
      THREE.MathUtils.lerp(tmpLook.x, THREE.MathUtils.lerp(LANDSCAPE.lookTo.x, PORTRAIT.lookTo.x, pf), intro),
      THREE.MathUtils.lerp(tmpLook.y, THREE.MathUtils.lerp(LANDSCAPE.lookTo.y, PORTRAIT.lookTo.y, pf), intro),
      THREE.MathUtils.lerp(tmpLook.z, THREE.MathUtils.lerp(LANDSCAPE.lookTo.z, PORTRAIT.lookTo.z, pf), intro),
    )

    // scroll travel (starts gently, finishes firm)
    const p = reduced ? 0 : scrollState.hero
    const sp = p * p * (3 - 2 * p)
    if (sp > 0.0005) {
      target.lerp(
        tmpVec.set(
          THREE.MathUtils.lerp(LANDSCAPE.scrollTo.x, PORTRAIT.scrollTo.x, pf),
          THREE.MathUtils.lerp(LANDSCAPE.scrollTo.y, PORTRAIT.scrollTo.y, pf),
          THREE.MathUtils.lerp(LANDSCAPE.scrollTo.z, PORTRAIT.scrollTo.z, pf),
        ),
        sp * 0.96,
      )
      tmpLook.lerp(
        tmpLook2.set(
          THREE.MathUtils.lerp(LANDSCAPE.scrollLook.x, PORTRAIT.scrollLook.x, pf),
          THREE.MathUtils.lerp(LANDSCAPE.scrollLook.y, PORTRAIT.scrollLook.y, pf),
          THREE.MathUtils.lerp(LANDSCAPE.scrollLook.z, PORTRAIT.scrollLook.z, pf),
        ),
        sp * 0.9,
      )
    }

    // cursor parallax — small on purpose, felt more than seen
    const px = pointer.sx * 0.34 * parallaxScale * (1 - sp * 0.55)
    const py = pointer.sy * 0.16 * parallaxScale * (1 - sp * 0.55)
    target.x += px
    target.y += py

    // living breathing motion + a whisper of reaction to scroll velocity
    if (!reduced) {
      const t = performance.now() / 1000
      target.y += Math.sin(t * 0.34) * 0.035 + scrollState.velocity * 0.06
      target.x += Math.cos(t * 0.24) * 0.03
      tmpLook.y += pointer.sy * 0.09
      tmpLook.x += pointer.sx * 0.16
    }

    // critically damped follow
    const k = 1 - Math.exp(-(reduced ? 6 : 3.1) * delta)
    camera.position.lerp(target, k)
    lookAt.current.lerp(tmpLook, k)
    camera.lookAt(lookAt.current)

    // an almost imperceptible roll keeps the frame from feeling like a widget
    camera.rotation.z += (pointer.sx * 0.006 + scrollState.velocity * 0.004) * parallaxScale
  })

  return null
}

/**
 * Hair-like particle strands + warm dust motes.
 *
 * Everything is animated in the vertex shader from two uniforms (time, pointer)
 * so the CPU cost is ~0 and the whole system can scale from 2,400 points on a
 * desktop to 320 on a phone.
 */
export function DustParticles({
  count = 1400,
  reduced = false,
}: {
  count?: number
  reduced?: boolean
}) {
  const material = useRef<THREE.ShaderMaterial>(null)

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    const scales = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = Math.random() * 5.4
      positions[i * 3 + 2] = -9 + Math.random() * 16
      seeds[i] = Math.random()
      scales[i] = 0.35 + Math.random() * 0.9
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 2.5, -2), 22)

    return {
      geometry: geo,
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2() },
        uStrength: { value: 0 },
        uOpacity: { value: 0 },
        uSize: { value: 26 },
        uPixelRatio: { value: 1 },
        uScroll: { value: 0 },
      },
    }
  }, [count])

  useFrame((state, rawDelta) => {
    const u = uniforms
    u.uTime.value += Math.min(rawDelta, 1 / 30)
    u.uPointer.value.set(pointer.sx, pointer.sy)
    u.uStrength.value += (pointer.velocity * 1.6 - u.uStrength.value) * 0.08
    u.uScroll.value = scrollState.hero
    u.uPixelRatio.value = state.gl.getPixelRatio()
    const fadeIn = Math.min(1, u.uTime.value / 2.4)
    const targetOpacity = reduced ? 0.32 : 0.62 * fadeIn
    u.uOpacity.value += (targetOpacity - u.uOpacity.value) * 0.03
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        vertexShader={/* glsl */ `
          uniform float uTime;
          uniform vec2  uPointer;
          uniform float uStrength;
          uniform float uSize;
          uniform float uPixelRatio;
          uniform float uScroll;

          attribute float aSeed;
          attribute float aScale;

          varying float vAlpha;
          varying float vTint;

          void main() {
            vec3 p = position;

            // slow organic drift, unique per mote
            float t = uTime * 0.12;
            p.x += sin(t * (0.6 + aSeed) + aSeed * 24.0) * 0.85;
            p.z += cos(t * (0.5 + aSeed * 0.7) + aSeed * 17.0) * 0.7;

            // perpetual, very slow rise; recycles at the ceiling
            p.y = mod(p.y + uTime * (0.06 + aSeed * 0.05), 5.6);

            // the scroll pushes the field gently toward the mirror wall
            p.z += uScroll * 2.6 * (0.4 + aSeed);

            // cursor repulsion: motes part softly around the pointer
            vec2 focal = uPointer * vec2(7.0, 3.2);
            vec2 d = p.xy - focal;
            float dist = length(d) + 0.001;
            float push = smoothstep(3.4, 0.15, dist) * (0.45 + uStrength);
            p.xy += (d / dist) * push * 0.9;

            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / max(0.35, -mv.z));

            // fade with distance and near the room edges
            float edge = 1.0 - smoothstep(6.0, 13.0, abs(p.x));
            vAlpha = uOpacity * edge * (0.3 + 0.7 * aScale);
            vTint = aSeed;
          }
        `}
        fragmentShader={/* glsl */ `
          varying float vAlpha;
          varying float vTint;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float r = length(uv);
            if (r > 0.5) discard;
            float a = smoothstep(0.5, 0.02, r);
            // warm champagne dust, never white-hot
            vec3 warm = mix(vec3(1.0, 0.94, 0.84), vec3(0.92, 0.84, 0.7), vTint);
            gl_FragColor = vec4(warm, a * a * vAlpha);
            #include <colorspace_fragment>
          }
        `}
      />
    </points>
  )
}
