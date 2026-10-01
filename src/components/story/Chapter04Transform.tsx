import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { sound } from '../../lib/audio'
import { useStory } from '../../store/story'

const clamp = (v: number, min = 0, max = 100) => Math.min(max, Math.max(min, v))

export function Chapter04Transform() {
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const setCursor = useStory((s) => s.setCursor)
  const setStoryProgress = useStory((s) => s.setTransformationProgress)

  const position = useMotionValue(50)
  const smooth = useSpring(position, { stiffness: 240, damping: 28, mass: 0.35 })
  const peelAngle = useSpring(0, { stiffness: 180, damping: 22, mass: 0.4 })
  const [displayPercent, setDisplayPercent] = useState(50)

  const clip = useTransform(smooth, (v) => `inset(0 0 0 ${v}%)`)
  const lineLeft = useTransform(smooth, (v) => `${v}%`)
  const transformStyle = useTransform(
    peelAngle,
    (v) => `perspective(1200px) rotateY(${v}deg) scale(1.01)`
  )

  useEffect(() => {
    return smooth.on('change', (v) => {
      setDisplayPercent(v)
      setStoryProgress(v / 100)
    })
  }, [smooth, setStoryProgress])

  const update = useCallback(
    (clientX: number) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const next = clamp(((clientX - rect.left) / rect.width) * 100)
      const delta = next - position.get()
      position.set(next)
      peelAngle.set(clamp(delta * 1.2, -14, 14))
      sound.updateVelocity(delta * 0.1)
    },
    [position, peelAngle]
  )

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!dragging.current) return
      e.preventDefault()
      update(e.clientX)
    }
    const handleUp = () => {
      if (!dragging.current) return
      dragging.current = false
      peelAngle.set(0)
    }
    window.addEventListener('pointermove', handleMove, { passive: false })
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleUp)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
    }
  }, [update, peelAngle])

  return (
    <section
      id="transform"
      className="relative min-h-screen w-full py-28 sm:py-36 lg:py-44"
      onMouseEnter={() => setCursor('drag', 'DRAG')}
      onMouseLeave={() => setCursor('default')}
    >
      <div className="container-editorial relative">
        {/* Chapter Header */}
        <div className="flex flex-col gap-4 border-b border-gold/20 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.38em] text-gold">
              CHAPTER 04 · THE SHIFT
            </p>
            <h2 className="mt-2 font-display text-[clamp(2.4rem,6vw,5.5rem)] font-light leading-tight text-[#f7f3ec]">
              The core concept:
              <span className="gold-foil block font-normal italic">TRANSFORMATION.</span>
            </h2>
          </div>
          <p className="max-w-sm font-sans text-[12px] leading-relaxed text-ivory/50">
            Drag across the canvas to shift between the raw consultation and the editorial reality.
            Unretouched, identical light.
          </p>
        </div>

        {/* Interactive Transformation Stage */}
        <div className="mt-14 space-y-6">
          <div
            ref={containerRef}
            role="slider"
            tabIndex={0}
            aria-label="Drag to transform"
            aria-valuenow={Math.round(displayPercent)}
            onPointerDown={(e) => {
              dragging.current = true
              update(e.clientX)
              sound.playChime(520)
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') position.set(clamp(position.get() - 5))
              if (e.key === 'ArrowRight') position.set(clamp(position.get() + 5))
            }}
            className="group relative aspect-[16/10] w-full cursor-ew-resize select-none overflow-hidden rounded-3xl border border-gold/30 bg-ink shadow-[0_25px_80px_-20px_rgba(205,170,110,0.25)] sm:aspect-[21/10]"
          >
            {/* Layer 1: BEFORE (Consultation reality) */}
            <img
              src="/img/before.jpg"
              alt="Raw consultation state"
              className="absolute inset-0 h-full w-full object-cover filter brightness-95"
              draggable={false}
            />

            {/* Layer 2: AFTER (Editorial finish) clipped by seam */}
            <motion.div
              className="absolute inset-0 will-change-transform"
              style={{
                clipPath: clip,
                transform: transformStyle,
                transformOrigin: 'left center',
              }}
            >
              <img
                src="/img/after.jpg"
                alt="Transformed luminous hair finish"
                className="absolute inset-0 h-full w-full object-cover filter contrast-105 brightness-105"
                draggable={false}
              />
            </motion.div>

            {/* Divider Hairline & Moving Caustic Light */}
            <motion.div
              className="pointer-events-none absolute inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-gold-hi to-transparent shadow-[0_0_15px_rgba(243,224,181,0.8)]"
              style={{ left: lineLeft }}
            />
            <motion.div
              className="pointer-events-none absolute inset-y-0 w-32"
              style={{
                left: lineLeft,
                background: 'linear-gradient(to right, rgba(10,9,8,0.55), transparent)',
              }}
            />

            {/* Floating Labels */}
            <div className="pointer-events-none absolute left-8 top-8 rounded-full border border-ivory/20 bg-ink/70 px-4 py-1.5 backdrop-blur-md">
              <span className="font-sans text-[10px] uppercase tracking-[0.26em] text-ivory/80">
                01 · CONSULTATION
              </span>
            </div>
            <div className="pointer-events-none absolute right-8 top-8 rounded-full border border-gold/30 bg-ink/70 px-4 py-1.5 backdrop-blur-md">
              <span className="font-sans text-[10px] uppercase tracking-[0.26em] text-gold-hi">
                02 · REVELATION
              </span>
            </div>

            {/* Center Handle */}
            <motion.div
              className="pointer-events-none absolute top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-ink/90 shadow-[0_0_30px_rgba(205,170,110,0.5)] backdrop-blur-lg"
              style={{ left: lineLeft }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold-hi" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
              </svg>
            </motion.div>
          </div>

          {/* Interactive Status & Notes */}
          <div className="flex flex-wrap items-center justify-between gap-4 font-sans text-[11px] text-ivory/50">
            <span className="tracking-wide2 uppercase">
              Drag horizontally · or use Arrow Left/Right keys
            </span>
            <div className="flex items-center gap-6">
              <span>ARTISAN: ARJUN SHARMA</span>
              <span className="text-gold-hi font-medium">
                {Math.round(displayPercent)}% TRANSFORMED
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
