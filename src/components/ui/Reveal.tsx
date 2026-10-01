import { useEffect, useRef, type ReactNode } from 'react'
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { EASE_EXPO } from '../../lib/motion'

/** Fades + lifts its children into view once — long travel, long settle. */
export function Reveal({
  children,
  delay = 0,
  y = 34,
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
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduced ? 0.4 : 1.25, ease: EASE_EXPO, delay: reduced ? 0 : delay }}
    >
      {children}
    </Comp>
  )
}

/**
 * Editorial line reveal — each line rises from behind a mask while it straightens.
 * The text itself stays in the DOM as real, crawlable, selectable text.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.11,
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
        // The static mask is what scroll-triggers the reveal. (Observing the moving line
        // itself never fires: it starts fully clipped, so its visible area is zero.)
        <motion.span
          key={i}
          className="block overflow-hidden pb-[0.1em] pt-[0.04em]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
        >
          <motion.span
            className={`block origin-[0%_100%] ${lineClassName ?? ''}`}
            variants={{
              hidden: reduced ? { opacity: 0 } : { y: '118%', rotate: 3.5 },
              show: {
                y: '0%',
                rotate: 0,
                opacity: 1,
                transition: {
                  duration: reduced ? 0.4 : 1.4,
                  ease: EASE_EXPO,
                  delay: reduced ? 0 : delay + i * stagger,
                },
              },
            }}
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </span>
  )
}

/** A gold hairline that draws itself in — the section signature. */
export function RevealRule({ delay = 0, className = '' }: { delay?: number; className?: string }) {
  return (
    <motion.span
      className={`block h-px origin-left bg-gradient-to-r from-gold/70 via-current/25 to-transparent ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1.6, ease: EASE_EXPO, delay }}
    />
  )
}

/**
 * A frame that *opens* into view, the way the hero does: an arch swells from a
 * small doorway to its full size while the picture inside settles. The plain
 * variant is a clean wipe. Put a ring (`arch-ring`) on a wrapper, not on this.
 */
export function RevealImage({
  children,
  arch = false,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  arch?: boolean
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()
  const from = arch ? 'inset(24% 26% 0% 26% round 999px 999px 0px 0px)' : 'inset(100% 0% 0% 0%)'
  const to = arch ? 'inset(0% 0% 0% 0% round 999px 999px 0px 0px)' : 'inset(0% 0% 0% 0%)'

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { clipPath: from }}
      whileInView={{ clipPath: to }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduced ? 0 : 1.7, ease: EASE_EXPO, delay }}
    >
      <motion.div
        className="h-full w-full"
        initial={reduced ? false : { scale: 1.3 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: reduced ? 0 : 2.1, ease: EASE_EXPO, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

function ScrollWord({
  progress,
  range,
  em,
  reduced,
  children,
}: {
  progress: MotionValue<number>
  range: [number, number]
  em: boolean
  reduced: boolean | null
  children: string
}) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <span className="inline-block whitespace-pre">
      <motion.span style={{ opacity: reduced ? 1 : opacity }} className={em ? 'italic text-gold-hi' : ''}>
        {children}
      </motion.span>{' '}
    </span>
  )
}

/**
 * A statement that lights up word by word as you scroll through it.
 * Wrap words in *asterisks* for the gold italic emphasis.
 */
export function ScrollWords({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.86', 'end 0.46'] })

  let emphasised = false
  const tokens = text.split(' ').map((raw) => {
    if (raw.startsWith('*')) emphasised = true
    const token = { word: raw.replace(/\*/g, ''), em: emphasised }
    if (raw.endsWith('*')) emphasised = false
    return token
  })
  const n = tokens.length

  return (
    <p ref={ref} className={className}>
      {tokens.map((t, i) => (
        <ScrollWord
          key={i}
          progress={scrollYProgress}
          range={[i / n, Math.min(1, (i + 2.4) / n)]}
          em={t.em}
          reduced={reduced}
        >
          {t.word}
        </ScrollWord>
      ))}
    </p>
  )
}

/** Counts up to a figure like "4.9", "12" or "9,400+" when it scrolls into view. */
export function Counter({ value, className = '' }: { value: string | number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduced = useReducedMotion()

  const match = String(value).match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/)
  const prefix = match?.[1] ?? ''
  const raw = match?.[2] ?? String(value)
  const suffix = match?.[3] ?? ''
  const target = parseFloat(raw.replace(/,/g, ''))
  const decimals = raw.includes('.') ? (raw.split('.')[1] ?? '').length : 0
  const grouped = raw.includes(',')

  const format = (v: number) =>
    prefix +
    v.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: grouped,
    }) +
    suffix

  useEffect(() => {
    const el = ref.current
    if (!el || Number.isNaN(target)) return
    if (reduced) {
      el.textContent = format(target)
      return
    }
    if (!inView) return
    const controls = animate(0, target, {
      duration: 2.2,
      ease: EASE_EXPO,
      onUpdate: (v) => {
        el.textContent = format(v)
      },
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, target])

  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      {format(Number.isNaN(target) ? 0 : reduced ? target : 0)}
    </span>
  )
}
