import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE_SILK } from '../../lib/motion'
import { SITE } from '../../data/salon'

/**
 * A very short, very calm opening: the wordmark, a hairline that draws itself,
 * and the handover into the 3D hero. Capped at ~2.4s no matter what the network
 * or GPU is doing, so the visitor is never held hostage by a loading screen.
 */
export function Preloader({
  sceneReady,
  onReveal,
}: {
  sceneReady: boolean
  /** called the moment the 3D intro should begin (veil still lifting) */
  onReveal: () => void
}) {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const revealed = useRef(false)

  useEffect(() => {
    const start = performance.now()
    const minDuration = reduced ? 500 : 1500
    const hardCap = reduced ? 900 : 2500

    let raf = 0
    const tick = (now: number) => {
      const elapsed = now - start
      // ease toward 0.92 until the scene reports ready, then complete
      const target = sceneReady && elapsed > minDuration ? 1 : 0.92
      setProgress((p) => {
        const next = p + (target - p) * 0.06
        return next > 0.995 ? 1 : next
      })
      if (!revealed.current && ((sceneReady && elapsed > minDuration) || elapsed > hardCap)) {
        revealed.current = true
        onReveal()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [sceneReady, onReveal, reduced])

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ivory"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: reduced ? 0 : -18 }}
      transition={{ duration: reduced ? 0.3 : 0.85, ease: EASE_SILK }}
      aria-hidden="true"
    >
      <div className="grain pointer-events-none absolute inset-0 opacity-40" />

      <motion.p
        className="relative font-display text-[13vw] leading-none tracking-[0.16em] text-charcoal sm:text-[64px]"
        initial={{ opacity: 0, letterSpacing: '0.42em' }}
        animate={{ opacity: 1, letterSpacing: '0.16em' }}
        transition={{ duration: reduced ? 0.3 : 1.6, ease: EASE_SILK }}
      >
        {SITE.name}
      </motion.p>

      <motion.p
        className="relative mt-4 font-sans text-[9px] uppercase tracking-label text-taupe sm:text-[10px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0.1 : 0.7, duration: 0.8 }}
      >
        {SITE.tagline}
      </motion.p>

      <div className="relative mt-12 h-px w-[180px] overflow-hidden bg-charcoal/12 sm:w-[240px]">
        <motion.span
          className="absolute inset-y-0 left-0 bg-champagne"
          style={{ width: `${Math.round(progress * 100)}%` }}
          transition={{ ease: 'linear' }}
        />
      </div>

      <p className="relative mt-5 font-sans text-[10px] uppercase tracking-label text-taupe/80">
        Preparing your experience…
      </p>
    </motion.div>
  )
}
