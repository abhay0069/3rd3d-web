import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { TRANSFORMATION } from '../../data/salon'
import { SectionHeading } from '../ui/Bits'
import { Reveal } from '../ui/Reveal'
import { useInView } from '../../hooks/useResponsive'

const clamp = (v: number, min = 0, max = 100) => Math.min(max, Math.max(min, v))

/**
 * A before/after that behaves like a sheet of paper rather than a slider:
 * the revealed side lifts, the seam carries a shadow, and the two photographs
 * drift at slightly different rates as you drag.
 */
export function Transformation() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const lastX = useRef(0)
  const reduced = useReducedMotion()
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ threshold: 0.35, once: true })

  const position = useMotionValue(50)
  const smooth = useSpring(position, { stiffness: 220, damping: 30, mass: 0.4 })
  const peel = useSpring(0, { stiffness: 150, damping: 20, mass: 0.5 })
  const [displayPos, setDisplayPos] = useState(50)

  const clip = useTransform(smooth, (v) => `inset(0 0 0 ${v}%)`)
  const leftPercent = useTransform(smooth, (v) => `${v}%`)
  const peelTransform = useTransform(peel, (v) => `perspective(1400px) rotateY(${v}deg) scale(1.02)`)
  const seamShadow = useTransform(peel, (v) => Math.min(0.42, Math.abs(v) / 26))
  const beforeShift = useTransform(smooth, [0, 100], reduced ? [0, 0] : [12, -12])
  const afterShift = useTransform(smooth, [0, 100], reduced ? [0, 0] : [-14, 14])

  useEffect(() => smooth.on('change', (v) => setDisplayPos(v)), [smooth])

  /** a short, deliberate introduction so nobody misses the interaction */
  useEffect(() => {
    if (!inView || reduced) return
    position.set(86)
    const t1 = window.setTimeout(() => position.set(34), 420)
    const t2 = window.setTimeout(() => position.set(50), 1500)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [inView, position, reduced])

  const update = useCallback(
    (clientX: number) => {
      const el = wrapRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const next = clamp(((clientX - rect.left) / rect.width) * 100)
      const velocity = next - position.get()
      position.set(next)
      peel.set(clamp(velocity * 1.1, -13, 13))
      lastX.current = clientX
    },
    [position, peel],
  )

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!dragging.current) return
      event.preventDefault()
      update(event.clientX)
    }
    const onUp = () => {
      if (!dragging.current) return
      dragging.current = false
      peel.set(0)
    }
    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [update, peel])

  const nudge = (delta: number) => {
    position.set(clamp(position.get() + delta))
    peel.set(delta > 0 ? 5 : -5)
    window.setTimeout(() => peel.set(0), 220)
  }

  return (
    <section id="gallery" className="relative bg-ink py-28 sm:py-32 lg:py-40">
      <div className="container-editorial">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="03"
            eyebrow="Gallery — The Transformation"
            tone="light"
            lines={['Drag to see', <em key="b">the difference.</em>]}
          />
          <Reveal delay={0.2} className="max-w-xs lg:pb-2">
            <p className="text-[13px] leading-relaxed text-ivory/60">
              {TRANSFORMATION.caption}. <span className="text-ivory/40">{TRANSFORMATION.stylist}.</span>{' '}
              Unretouched, shot in the same light, ten minutes apart.
            </p>
          </Reveal>
        </div>

        <div
          ref={viewRef}
          className="mt-14"
          style={{ perspective: 1600 }}
        >
          <div
            ref={wrapRef}
            role="slider"
            tabIndex={0}
            aria-label="Reveal the after photograph"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(displayPos)}
            aria-valuetext={`${Math.round(displayPos)} percent revealed`}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft') nudge(-4)
              if (event.key === 'ArrowRight') nudge(4)
              if (event.key === 'Home') position.set(0)
              if (event.key === 'End') position.set(100)
            }}
            onPointerDown={(event) => {
              dragging.current = true
              ;(event.target as HTMLElement).setPointerCapture?.(event.pointerId)
              update(event.clientX)
            }}
            className="relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden bg-umber ring-1 ring-gold/25 sm:aspect-[16/10]"
            style={{ touchAction: 'pan-y' }}
          >
            {/* BEFORE */}
            <motion.img
              src={TRANSFORMATION.before}
              alt={TRANSFORMATION.beforeAlt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ x: beforeShift }}
              draggable={false}
            />

            {/* AFTER — clipped at the seam, then peeled in 3D around the seam */}
            <motion.div
              className="absolute inset-0"
              style={{ clipPath: clip, transform: peelTransform, transformOrigin: 'left center' }}
            >
              <motion.img
                src={TRANSFORMATION.after}
                alt={TRANSFORMATION.afterAlt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ x: afterShift }}
                draggable={false}
              />
            </motion.div>

            {/* Seam: hairline + moving shadow */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-px bg-ivory/90"
              style={{ left: leftPercent }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-24"
              style={{
                left: leftPercent,
                background: 'linear-gradient(to right, rgba(13,12,10,0.45), transparent)',
                opacity: seamShadow,
              }}
            />

            {/* Labels */}
            <span className="pointer-events-none absolute left-5 top-5 font-sans text-[10px] uppercase tracking-label text-ivory/85 mix-blend-difference">
              Before
            </span>
            <span className="pointer-events-none absolute right-5 top-5 font-sans text-[10px] uppercase tracking-label text-ivory/85 mix-blend-difference">
              After
            </span>

            {/* Handle */}
            <motion.div
              className="pointer-events-none absolute top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/70 bg-ink/25 backdrop-blur-md"
              style={{ left: leftPercent }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-ivory" aria-hidden>
                <path d="M9 7L5 12l4 5M15 7l4 5-4 5" fill="none" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </motion.div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 font-sans text-[11px] uppercase tracking-wide2 text-ivory/40">
            <span>Slide, or use ← → keys</span>
            <span className="text-gold-hi">{Math.round(displayPos)}% revealed</span>
          </div>
        </div>
      </div>
    </section>
  )
}
