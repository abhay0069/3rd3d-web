import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { EASE_SILK } from '../../lib/motion'

/** Fades + lifts its children into view once. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'header' | 'figure'
}) {
  const reduced = useReducedMotion()
  const Comp = motion[as] as typeof motion.div

  return (
    <Comp
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reduced ? 0.4 : 0.95, ease: EASE_SILK, delay: reduced ? 0 : delay }}
    >
      {children}
    </Comp>
  )
}

/**
 * Editorial line reveal — each line rides up from behind a mask.
 * The text itself stays in the DOM as real, crawlable, selectable text.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
}: {
  lines: (string | ReactNode)[]
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
}) {
  const reduced = useReducedMotion()
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className={`block ${lineClassName ?? ''}`}
            initial={reduced ? { opacity: 0 } : { y: '108%' }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: reduced ? 0.4 : 1.15,
              ease: EASE_SILK,
              delay: reduced ? 0 : delay + i * stagger,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/** A hairline that draws itself in — used as a section signature. */
export function RevealRule({ delay = 0, className = '' }: { delay?: number; className?: string }) {
  return (
    <motion.span
      className={`block h-px origin-left bg-charcoal/20 ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1.2, ease: EASE_SILK, delay }}
    />
  )
}
