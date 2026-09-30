/**
 * Global scroll state, read inside `useFrame` / rAF loops.
 * Never causes a React render — the 3D scene samples it every frame instead.
 */
export const scrollState = {
  /** raw window scrollY */
  y: 0,
  /** scroll progress through the hero wrapper, clamped 0…1 */
  hero: 0,
  /** normalised document progress 0…1 */
  page: 0,
  /** signed scroll velocity, roughly -1…1 */
  velocity: 0,
  /** ms timestamp of the last scroll event */
  last: 0,
}

let bound = false

export function bindScroll() {
  if (bound || typeof window === 'undefined') return () => {}
  bound = true

  let previous = window.scrollY
  let raf = 0
  let settle = 0

  const measure = () => {
    raf = 0
    const y = window.scrollY
    const heroEl = document.getElementById('home')
    const heroSpan = heroEl ? Math.max(1, heroEl.offsetHeight) : window.innerHeight
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)

    scrollState.y = y
    scrollState.hero = Math.min(1, Math.max(0, y / heroSpan))
    scrollState.page = Math.min(1, Math.max(0, y / max))
    scrollState.velocity = Math.max(-1, Math.min(1, (y - previous) / 90))
    previous = y
    scrollState.last = performance.now()
  }

  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(measure)
  }

  /** decays velocity towards zero when scrolling stops */
  const tick = () => {
    if (performance.now() - scrollState.last > 90) scrollState.velocity *= 0.9
    settle = requestAnimationFrame(tick)
  }
  settle = requestAnimationFrame(tick)

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  measure()

  return () => {
    bound = false
    cancelAnimationFrame(raf)
    cancelAnimationFrame(settle)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  }
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
