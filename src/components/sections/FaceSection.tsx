import { assetUrl } from '../../lib/assets'
import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { DeviceTier } from '../../hooks/useResponsive'
import { useBooking } from '../../store/booking'
import { hasWebGL } from '../../lib/webgl'

const FaceParticles = lazy(() => import('../../three/FaceParticles'))

/**
 * The one place where the site lets itself be cinematic.
 *
 * A portrait assembled from ~7,000 particles. It gathers as you scroll in,
 * reacts gently to the cursor, and dissolves back into the photograph as you
 * leave — so the effect always has a reason and never repeats.
 */
export function FaceSection({ tier }: { tier: DeviceTier }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [webgl] = useState(() => hasWebGL())
  const reduced = useReducedMotion()
  const openBooking = useBooking((s) => s.open)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const photoOpacity = useTransform(scrollYProgress, [0.68, 0.92], [0, 1])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.14, 0.62, 0.78], [0, 1, 1, 0])
  const copyY = useTransform(scrollYProgress, [0, 0.14], [24, 0])
  const promptOpacity = useTransform(scrollYProgress, [0.72, 0.9], [0, 1])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '30% 0px 30% 0px',
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const showParticles = webgl && !reduced && inView

  return (
    <section
      id="artistry"
      ref={containerRef}
      className="relative h-[250vh] bg-ink"
      aria-labelledby="artistry-title"
    >
      <div className="sticky top-0 h-screen h-[100svh] overflow-hidden">
        {/* The photograph: the particles' destination, and the graceful fallback */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: reduced ? 1 : photoOpacity }}
        >
          <img
            src={assetUrl('/img/face-particles.jpg')}
            alt="A LUMIÈRE client, lit against a dark studio backdrop — the portrait the particles resolve into"
            className="h-full w-full object-cover object-center opacity-70 sm:opacity-80"
            loading="lazy"
            decoding="async"
            style={{
              maskImage: 'radial-gradient(75% 75% at 50% 45%, #000 55%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(75% 75% at 50% 45%, #000 55%, transparent 100%)',
            }}
          />
        </motion.div>

        {/* Particles */}
        {showParticles && (
          <Suspense fallback={null}>
            <FaceParticles
              src={assetUrl('/img/face-particles.jpg')}
              tier={tier}
              reduced={Boolean(reduced)}
              containerRef={containerRef}
            />
          </Suspense>
        )}

        {/* vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(90% 70% at 50% 45%, transparent 40%, rgba(11,10,9,0.85) 100%)',
          }}
        />

        {/* Copy */}
        <motion.div
          className="container-editorial absolute inset-x-0 top-0 pt-28 text-center sm:pt-32"
          style={{ opacity: copyOpacity, y: copyY }}
        >
          <p className="eyebrow !text-ivory/50">05 — The becoming</p>
          <h2 id="artistry-title" className="display-lg mx-auto mt-6 max-w-3xl text-ivory">
            A new look,
            <em className="italic text-champagne"> written in light.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[14px] leading-relaxed text-ivory/60">
            {reduced
              ? 'An artist’s eye, a considered transformation and a finish checked in daylight before you leave the chair.'
              : 'Scroll to watch a portrait gather from thousands of warm points of light, then move your cursor. The image resolves into a real face: the artistry, and the person, together.'}
          </p>
        </motion.div>

        {/* Bottom conversion prompt, arriving with the dissolve */}
        <motion.div
          className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 pb-14 sm:pb-16"
          style={{ opacity: promptOpacity }}
        >
          <p className="font-sans text-[11px] uppercase tracking-label text-ivory/50">
            Ready when you are
          </p>
          <button
            type="button"
            onClick={() => openBooking()}
            className="btn btn-light"
            data-cursor="hover"
          >
            Book your experience
          </button>
        </motion.div>
      </div>
    </section>
  )
}
