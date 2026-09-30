/**
 * A single, global, allocation-free pointer store.
 *
 * The 3D scene reads this every frame inside `useFrame`, so it must never trigger
 * a React re-render. Values are normalised to -1…1 with y pointing up.
 */
export const pointer = {
  /** raw, normalised device position */
  x: 0,
  y: 0,
  /** smoothed position — what the camera actually chases */
  sx: 0,
  sy: 0,
  /** -1 … 1, how far the pointer moved in the last frame (drives micro-reactions) */
  velocity: 0,
  /** true once the user has moved a mouse (we never fake parallax before that) */
  active: false,
  /** true when the pointing device is a mouse/trackpad rather than a finger */
  fine: true,
}

let bound = false

export function bindPointer() {
  if (bound || typeof window === 'undefined') return () => {}
  bound = true

  const onMove = (event: PointerEvent) => {
    const fine = event.pointerType === 'mouse' || event.pointerType === 'pen'
    pointer.fine = fine
    if (!fine) return
    const nx = (event.clientX / window.innerWidth) * 2 - 1
    const ny = -((event.clientY / window.innerHeight) * 2 - 1)
    pointer.velocity = Math.min(1, Math.hypot(nx - pointer.x, ny - pointer.y) * 4)
    pointer.x = nx
    pointer.y = ny
    pointer.active = true
  }

  const onLeave = () => {
    pointer.x = 0
    pointer.y = 0
    pointer.active = false
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerleave', onLeave, { passive: true })
  window.addEventListener('blur', onLeave)

  return () => {
    bound = false
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerleave', onLeave)
    window.removeEventListener('blur', onLeave)
  }
}

/** Frame-rate independent smoothing, called once per animation frame. */
export function smoothPointer(delta: number, stiffness = 2.4) {
  const t = 1 - Math.exp(-stiffness * Math.min(delta, 0.1))
  pointer.sx += (pointer.x - pointer.sx) * t
  pointer.sy += (pointer.y - pointer.sy) * t
  pointer.velocity *= 1 - Math.min(1, delta * 6)
}

/** Cheap 1D value noise — used for gentle organic drift in the scene. */
export function noise1(seed: number, t: number) {
  return (
    Math.sin(t * 0.7 + seed * 12.9898) * 0.5 +
    Math.sin(t * 1.31 + seed * 78.233) * 0.3 +
    Math.sin(t * 2.13 + seed * 39.425) * 0.2
  )
}
