import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { EASE_SILK } from '../../lib/motion'
import { publicAsset } from '../../lib/assets'
import { Magnetic } from '../ui/Magnetic'
import { useBooking } from '../../store/booking'
import { hasWebGL } from '../../lib/webgl'
import { CanvasBoundary } from '../ui/CanvasBoundary'
import type { DeviceTier } from '../../hooks/useResponsive'

const HeroScene = lazy(() => import('../../three/HeroScene'))

const HEADLINE = ['Where Beauty Becomes', 'An Experience.']

export function Hero({
  tier,
  reduced,
  started,
  onSceneReady,
}: {
  tier: DeviceTier
  reduced: boolean
  started: boolean
  onSceneReady: () => void
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)
  // Probed synchronously so we never mount a canvas we cannot support.
  const [webglFailed, setWebglFailed] = useState(() => !hasWebGL())
  const openBooking = useBooking((s) => s.open)
  const motionReduced = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end start'] })
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.5, 0.86], [1, 1, 0])
  const canvasScale = useTransform(scrollYProgress, [0, 1], [1, 1.04])
  const photoOpacity = useTransform(scrollYProgress, [0.52, 0.9], [0, 1])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.32], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.32], [0, -36])

  // Unmount the WebGL scene once the hero is well out of view.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '20% 0px 20% 0px',
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const show3d = !webglFailed && (tier !== 'low' || !reduced)

  return (
    <div id="home" ref={wrapRef} className="relative h-[210vh]">
      <section
        className="sticky top-0 h-screen h-[100svh] overflow-hidden bg-sand"
        aria-label="LUMIÈRE — where beauty becomes an experience"
      >
        {/* Continuity plate: the same room, photographed. The 3D scene dissolves into it. */}
        <motion.img
          src={publicAsset('/img/salon-interior-wide.jpg')}
          alt="The LUMIÈRE styling floor: travertine, boucle chairs and brass-framed mirrors lit by late afternoon light"
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ opacity: webglFailed ? 1 : photoOpacity }}
          decoding="async"
        />

        {/* The 3D salon */}
        {show3d && inView && (
          <motion.div className="absolute inset-0" style={{ opacity: canvasOpacity, scale: canvasScale }}>
            <CanvasBoundary fallback={null} onError={() => setWebglFailed(true)}>
              <Suspense fallback={null}>
                <HeroScene
                  started={started}
                  tier={tier}
                  reduced={reduced}
                  onFirstFrame={onSceneReady}
                  onContextLost={() => setWebglFailed(true)}
                />
              </Suspense>
            </CanvasBoundary>
          </motion.div>
        )}

        {/* Cinematic framing — keeps the type legible without dulling the room */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ivory via-ivory/55 to-transparent"
          style={{ top: 'auto', height: '62%' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ivory/70 to-transparent"
        />

        {/* Copy */}
        <motion.div
          className="absolute inset-x-0 bottom-0 pb-14 sm:pb-16 lg:pb-20"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          <div className="container-editorial">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-[46rem]">
                <motion.p
                  className="eyebrow flex items-center gap-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={started ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.9, ease: EASE_SILK, delay: 0.15 }}
                >
                  <span className="h-px w-8 bg-champagne" />
                  Bandra West · Mumbai
                </motion.p>

                <h1 className="display-xl mt-5 text-charcoal" style={{ textWrap: 'balance' }}>
                  {HEADLINE.map((line, i) => (
                    <span key={line} className="block overflow-hidden pb-[0.04em]">
                      <motion.span
                        className="block"
                        initial={reduced ? { opacity: 0 } : { y: '108%' }}
                        animate={started ? { y: '0%', opacity: 1 } : {}}
                        transition={{
                          duration: reduced ? 0.5 : 1.4,
                          ease: EASE_SILK,
                          delay: reduced ? 0.1 : 0.3 + i * 0.13,
                        }}
                      >
                        {i === 1 ? (
                          <em className="not-italic">
                            An <span className="italic text-brass">Experience.</span>
                          </em>
                        ) : (
                          line
                        )}
                      </motion.span>
                    </span>
                  ))}
                </h1>
              </div>

              <div className="max-w-sm lg:pb-3">
                <motion.p
                  className="font-sans text-[15px] leading-relaxed text-smoke"
                  initial={{ opacity: 0, y: 16 }}
                  animate={started ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1, ease: EASE_SILK, delay: 0.75 }}
                >
                  Hair. Beauty. Confidence. Designed around you — in a studio built for calm,
                  precision and a very good mirror.
                </motion.p>

                <motion.div
                  className="mt-8 flex flex-wrap items-center gap-3"
                  initial={{ opacity: 0, y: 18 }}
                  animate={started ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1, ease: EASE_SILK, delay: 0.9 }}
                >
                  <Magnetic strength={0.18}>
                    <button
                      type="button"
                      onClick={() => openBooking()}
                      data-cursor="hover"
                      className="btn btn-primary"
                    >
                      Book your experience
                    </button>
                  </Magnetic>
                  <Magnetic strength={0.14}>
                    <a href="#services" className="btn btn-ghost" data-cursor="hover">
                      Explore services
                    </a>
                  </Magnetic>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
          style={{ opacity: contentOpacity }}
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : {}}
          transition={{ delay: 1.4, duration: 1 }}
        >
          <span className="font-sans text-[9px] uppercase tracking-label text-taupe">Scroll</span>
          <span className="relative block h-14 w-px overflow-hidden bg-charcoal/15">
            <motion.span
              className="absolute inset-x-0 top-0 block h-4 bg-champagne"
              animate={motionReduced ? {} : { y: [-16, 56] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.div>
      </section>
    </div>
  )
}
