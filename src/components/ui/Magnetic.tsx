import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useSpring } from 'framer-motion'

/**
 * Subtle magnetic pull towards the cursor.
 * Deliberately small (a few pixels) — it should register as quality, not as a trick.
 */
export function Magnetic({
  children,
  strength = 0.22,
  max = 9,
  className = '',
}: {
  children: ReactNode
  strength?: number
  max?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const x = useSpring(0, { stiffness: 170, damping: 18, mass: 0.35 })
  const y = useSpring(0, { stiffness: 170, damping: 18, mass: 0.35 })

  const enabled = !reduced && typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

  return (
    <motion.span
      ref={ref}
      className={`inline-flex ${className}`}
      style={{ x, y }}
      onPointerMove={(event) => {
        if (!enabled || event.pointerType !== 'mouse') return
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const dx = event.clientX - (rect.left + rect.width / 2)
        const dy = event.clientY - (rect.top + rect.height / 2)
        x.set(Math.max(-max, Math.min(max, dx * strength)))
        y.set(Math.max(-max, Math.min(max, dy * strength)))
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.span>
  )
}
