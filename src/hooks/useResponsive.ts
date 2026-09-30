import { useEffect, useRef, useState } from 'react'

/** Tailwind-aligned media query hook (SSR-safe, no layout thrash). */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)')
}

export function useIsTouch() {
  return useMediaQuery('(hover: none), (pointer: coarse)')
}

export type DeviceTier = 'high' | 'medium' | 'low'

/**
 * A deliberately conservative capability guess. We would rather run a slightly
 * simpler scene than drop frames on someone's three-year-old phone.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>('high')

  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number }
    const cores = nav.hardwareConcurrency ?? 4
    const memory = nav.deviceMemory ?? 8
    const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 500
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // A quick real-world signal: if a 4-frame sample runs slower than 45fps, downgrade.
    let frames = 0
    let start = 0
    let raf = 0
    const probe = (now: number) => {
      if (!start) start = now
      frames += 1
      if (frames < 5) {
        raf = requestAnimationFrame(probe)
        return
      }
      const fps = (frames / (now - start)) * 1000
      const weak = fps < 45
      setTier((current) => {
        if (reduced) return 'low'
        // Only genuinely constrained hardware gets the lightest scene: a measured
        // sub-45fps sample, or a device reporting very little to work with.
        if (weak || cores <= 3 || memory <= 3) return smallScreen || coarse ? 'low' : 'medium'
        // Phones and tablets run the medium scene — simpler, still cinematic.
        if (smallScreen || coarse) return 'medium'
        // Never silently upgrade past a downgrade we already made.
        return current === 'low' ? 'medium' : 'high'
      })
    }
    raf = requestAnimationFrame(probe)
    return () => cancelAnimationFrame(raf)
  }, [])

  return tier
}

/** IntersectionObserver that returns whether the element is (or was) on screen. */
export function useInView<T extends HTMLElement>(
  options: { threshold?: number; rootMargin?: string; once?: boolean } = {},
) {
  const { threshold = 0.15, rootMargin = '0px', once = false } = options
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, inView }
}

/** Locks body scroll (booking modal, mobile nav). */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const { overflow, paddingRight } = document.body.style
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [locked])
}
