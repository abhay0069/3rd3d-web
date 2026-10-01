/**
 * The LUMIÈRE intro, as data.
 *
 * The opening is a single master clock (seconds). Every element's state is a
 * pure function of `t`, so the sequence is perfectly in sync, can be skipped by
 * simply fast-forwarding the clock, and can be scrubbed to any frame.
 */

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
/** 0…1 progress of `t` between `a` and `b` */
export const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a))
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

export const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)
export const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4)
export const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x))
export const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
export const easeInOutQuart = (x: number) => (x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2)
/** 0 → 1 → 0 */
export const bell = (x: number) => Math.sin(Math.PI * clamp(x))

/** The timeline, in seconds. The spectacle lands by ~2.1s; the copy settles by ~3.4s. */
export const TL = {
  /** a single point of light, then it splits and draws the arch from the apex down */
  spark: [0.0, 0.22],
  arch: [0.14, 0.92],
  glow: [0.5, 1.1],
  /** the portrait "develops" inside the arch */
  develop: [0.52, 1.25],
  /** wordmark letters rise, unlit */
  letters: { start: 0.78, stagger: 0.06, dur: 0.58 },
  /** the beam of light that ignites them */
  beam: [1.12, 1.78],
  /** the arch opens into the full frame */
  expand: [1.3, 2.12],
  flash: [1.86, 2.34],
  navIn: 2.3,
  /** when the last piece of copy has landed */
  end: 3.4,
} as const

/** Copy reveals: [start, duration] */
export const COPY_AT = {
  kicker: 2.0,
  line1: 2.06,
  line2: 2.18,
  para: 2.3,
  cta: 2.4,
  meta: 2.52,
  cue: 2.66,
} as const

export interface ArchGeom {
  x0: number
  x1: number
  y0: number
  y1: number
  w: number
  h: number
  r: number
  cx: number
  cy: number
}

/**
 * The resting arch: centred, standing above the wordmark.
 * `wmTop` is the viewport-Y of the top of the wordmark's capitals.
 */
export function archGeometry(W: number, H: number, wmTop: number): ArchGeom {
  const top = Math.max(H * 0.09, 68)
  const gap = Math.max(H * 0.05, 26)
  let h = Math.min(H * 0.62, wmTop - gap - top)
  h = Math.max(h, H * 0.36)
  const w = Math.min(h * 0.52, W * 0.72)
  const cx = W / 2
  return { x0: cx - w / 2, x1: cx + w / 2, y0: top, y1: top + h, w, h, r: w / 2, cx, cy: top + h / 2 }
}

/**
 * clip-path for the arch at opening progress `e` (0 = resting arch, 1 = full frame).
 * `pad` grows the shape outwards — used for the thin gold rim (whose bottom edge
 * is pushed off-screen with `padBottom`, so it never cuts across the wordmark).
 */
export function archClip(g: ArchGeom, W: number, H: number, e: number, pad = 0, padBottom = pad) {
  const left = lerp(g.x0, 0, e) - pad
  const right = lerp(W - g.x1, 0, e) - pad
  const top = lerp(g.y0, 0, e) - pad
  const bottom = lerp(H - g.y1, 0, e) - padBottom
  // The dome stays a true semicircle for as long as it is narrower than the frame,
  // then relaxes to a square corner as it reaches the edges.
  const r = (g.r + pad) * Math.pow(1 - e, 1.7)
  return `inset(${top.toFixed(2)}px ${right.toFixed(2)}px ${bottom.toFixed(2)}px ${left.toFixed(2)}px round ${r.toFixed(2)}px ${r.toFixed(2)}px 0px 0px)`
}

/** Scale the photograph so the face sits snugly inside the resting arch. */
export function startScale(g: ArchGeom, W: number, H: number, originY = 0.4) {
  const k = Math.max(W / 1408, H / 768) // object-cover scale of the 1408×768 portrait
  const faceW = 290 * k // the face (incl. hair edge) in cover pixels
  const fit = (g.w * 0.96) / faceW
  // the scaled frame must still cover the whole arch
  const oy = H * originY
  const coverTop = (oy - g.y0) / oy
  const coverBottom = (g.y1 - oy) / (H - oy)
  return clamp(Math.max(fit, coverTop + 0.02, coverBottom + 0.02, 0.62), 0.62, 1)
}
