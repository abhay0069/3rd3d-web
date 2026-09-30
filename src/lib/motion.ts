import type { Transition, Variants } from 'framer-motion'

/** Editorial easing — long, calm, no bounce. */
export const EASE_SILK = [0.22, 1, 0.36, 1] as const
export const EASE_CINEMA = [0.65, 0, 0.35, 1] as const

export const springSoft: Transition = { type: 'spring', stiffness: 90, damping: 20, mass: 0.9 }

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_SILK } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: EASE_SILK } },
}

export const staggerChildren = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/** Masked line reveal — the classic editorial move. */
export const lineMask: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 1.15, ease: EASE_SILK } },
}

export const viewportOnce = { once: true, amount: 0.35 } as const

/** Shared Tailwind-friendly class strings for the “quiet luxury” look. */
export const SURFACE = {
  ivory: 'bg-ivory text-charcoal',
  porcelain: 'bg-porcelain text-charcoal',
  sand: 'bg-sand text-charcoal',
  ink: 'bg-ink text-ivory',
  charcoal: 'bg-charcoal text-ivory',
} as const
