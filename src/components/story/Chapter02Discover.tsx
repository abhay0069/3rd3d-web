import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useStory } from '../../store/story'

export function Chapter02Discover() {
  const containerRef = useRef<HTMLDivElement>(null)
  const setCursor = useStory((s) => s.setCursor)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Staggered cinematic text reveals through depth
  const phase1Opacity = useTransform(scrollYProgress, [0.1, 0.22, 0.32], [0, 1, 0])
  const phase1Y = useTransform(scrollYProgress, [0.1, 0.32], [80, -80])
  const phase1Scale = useTransform(scrollYProgress, [0.1, 0.32], [0.9, 1.25])

  const phase2Opacity = useTransform(scrollYProgress, [0.32, 0.44, 0.54], [0, 1, 0])
  const phase2Y = useTransform(scrollYProgress, [0.32, 0.54], [80, -80])
  const phase2Scale = useTransform(scrollYProgress, [0.32, 0.54], [0.9, 1.25])

  const phase3Opacity = useTransform(scrollYProgress, [0.54, 0.66, 0.78], [0, 1, 0])
  const phase3Y = useTransform(scrollYProgress, [0.54, 0.78], [80, -80])
  const phase3Scale = useTransform(scrollYProgress, [0.54, 0.78], [0.9, 1.25])

  // Portrait emergence
  const portraitOpacity = useTransform(scrollYProgress, [0.4, 0.6, 0.85], [0, 0.85, 0])
  const portraitScale = useTransform(scrollYProgress, [0.4, 0.85], [1.15, 0.95])
  const portraitRotate = useTransform(scrollYProgress, [0.4, 0.85], [-2, 2])

  // Final revelation
  const revealOpacity = useTransform(scrollYProgress, [0.76, 0.88, 1.0], [0, 1, 0.3])
  const revealY = useTransform(scrollYProgress, [0.76, 0.95], [60, 0])

  return (
    <section
      id="discover"
      ref={containerRef}
      className="relative h-[320vh] w-full overflow-hidden bg-transparent"
      onMouseEnter={() => setCursor('explore', 'DISCOVER')}
      onMouseLeave={() => setCursor('default')}
    >
      {/* Background Floating Beauty Portrait emerging in deep perspective */}
      <motion.div
        style={{
          opacity: portraitOpacity,
          scale: portraitScale,
          rotate: portraitRotate,
        }}
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center will-change-transform"
      >
        <div className="relative h-[85vh] w-[90vw] max-w-4xl overflow-hidden rounded-[2.5rem] border border-gold/25 p-2 shadow-[0_0_120px_rgba(205,170,110,0.15)]">
          <img
            src="/img/face-particles.jpg"
            alt="The living presence of beauty"
            className="h-full w-full object-cover object-[50%_35%] filter brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-ink/40 to-ink" />
        </div>
      </motion.div>

      {/* Sticky Cinematic Text Stage */}
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center px-6 text-center">
        {/* Phase 1: We don't just change how you look */}
        <motion.div
          style={{ opacity: phase1Opacity, y: phase1Y, scale: phase1Scale }}
          className="absolute max-w-5xl will-change-transform"
        >
          <p className="font-sans text-[10px] uppercase tracking-[0.34em] text-gold/70">
            CHAPTER 02 · THE AWAKENING
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.5rem,7.5vw,7.2rem)] font-light leading-[0.96] tracking-tight text-[#f7f3ec]">
            WE DON'T JUST CHANGE
            <span className="block italic text-gold-hi">HOW YOU LOOK.</span>
          </h2>
        </motion.div>

        {/* Phase 2: We change how you feel */}
        <motion.div
          style={{ opacity: phase2Opacity, y: phase2Y, scale: phase2Scale }}
          className="absolute max-w-5xl will-change-transform"
        >
          <p className="font-sans text-[10px] uppercase tracking-[0.34em] text-gold/70">
            THE INTERNAL RESONANCE
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.5rem,7.5vw,7.2rem)] font-light leading-[0.96] tracking-tight text-[#f7f3ec]">
            WE CHANGE
            <span className="gold-foil block font-normal italic">HOW YOU FEEL.</span>
          </h2>
        </motion.div>

        {/* Phase 3: And sometimes, that changes everything */}
        <motion.div
          style={{ opacity: phase3Opacity, y: phase3Y, scale: phase3Scale }}
          className="absolute max-w-5xl will-change-transform"
        >
          <p className="font-sans text-[10px] uppercase tracking-[0.34em] text-gold/70">
            THE ALCHEMY
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.5rem,7.5vw,7.2rem)] font-light leading-[0.96] tracking-tight text-[#f7f3ec]">
            AND SOMETIMES...
            <span className="block text-gold-hi italic">THAT CHANGES EVERYTHING.</span>
          </h2>
        </motion.div>

        {/* Final Revelation of the salon's premise */}
        <motion.div
          style={{ opacity: revealOpacity, y: revealY }}
          className="absolute max-w-2xl px-6 will-change-transform"
        >
          <div className="rounded-2xl border border-gold/20 bg-ink/80 p-8 backdrop-blur-xl sm:p-12">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold">
              THE SALON PROMISE
            </span>
            <p className="mt-5 font-display text-[clamp(1.4rem,2.8vw,2.2rem)] font-light leading-relaxed text-[#f7f3ec]">
              Every appointment begins with ten unhurried minutes in daylight lamps. No upselling,
              no rushed consultations. One artisan stays with you from the first brush stroke to the
              final glance.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 text-[11px] uppercase tracking-wide2 text-gold-hi">
              <span>EST. 2013</span>
              <span className="h-1 w-1 rounded-full bg-gold" />
              <span>14 TURNER ROAD, BANDRA WEST</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
