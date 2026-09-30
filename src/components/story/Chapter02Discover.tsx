import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useStory } from '../../store/story'

export function Chapter02Discover() {
  const containerRef = useRef<HTMLDivElement>(null)
  const setCursor = useStory((s) => s.setCursor)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Staggered cinematic text reveals through depth
  const phase1Opacity = useTransform(scrollYProgress, [0.05, 0.2, 0.32], [0, 1, 0])
  const phase1Y = useTransform(scrollYProgress, [0.05, 0.32], [60, -60])
  const phase1Scale = useTransform(scrollYProgress, [0.05, 0.32], [0.92, 1.15])

  const phase2Opacity = useTransform(scrollYProgress, [0.32, 0.48, 0.62], [0, 1, 0])
  const phase2Y = useTransform(scrollYProgress, [0.32, 0.62], [60, -60])
  const phase2Scale = useTransform(scrollYProgress, [0.32, 0.62], [0.92, 1.15])

  const phase3Opacity = useTransform(scrollYProgress, [0.62, 0.78, 0.92], [0, 1, 0])
  const phase3Y = useTransform(scrollYProgress, [0.62, 0.92], [60, -60])
  const phase3Scale = useTransform(scrollYProgress, [0.62, 0.92], [0.92, 1.15])

  // Floating background portrait
  const portraitOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.85], [0, 0.35, 0])
  const portraitScale = useTransform(scrollYProgress, [0.2, 0.85], [1.1, 0.95])

  return (
    <section
      id="discover"
      ref={containerRef}
      className="relative h-[280vh] w-full bg-transparent"
      onMouseEnter={() => setCursor('explore', 'DISCOVER')}
      onMouseLeave={() => setCursor('default')}
    >
      {/* Sticky Cinematic Text Stage */}
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* Soft floating ambient portrait silhouette in background */}
        <motion.div
          style={{ opacity: portraitOpacity, scale: portraitScale }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform"
        >
          <div className="relative h-[70vh] w-[80vw] max-w-3xl overflow-hidden rounded-[3rem] border border-gold/15 p-2 opacity-50 filter blur-[1px]">
            <img
              src="/img/face-particles.jpg"
              alt=""
              className="h-full w-full object-cover object-[50%_35%] filter brightness-75 contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-[#0a0a0c]" />
          </div>
        </motion.div>

        {/* Phase 1: We don't just change how you look */}
        <motion.div
          style={{ opacity: phase1Opacity, y: phase1Y, scale: phase1Scale }}
          className="absolute max-w-5xl will-change-transform"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-white/[0.03] px-3.5 py-1 mb-5">
            <span className="text-gold text-[9px]">✦</span>
            <span className="font-sans text-[9px] uppercase tracking-[0.32em] text-gold/80">
              CHAPTER 02 · THE ESSENCE
            </span>
          </div>
          <h2 className="font-display text-[clamp(2.4rem,7vw,6.5rem)] font-light leading-[0.96] tracking-tight text-[#f7f3ec]">
            WE DON'T JUST CHANGE
            <span className="block italic text-gold-hi">HOW YOU LOOK.</span>
          </h2>
        </motion.div>

        {/* Phase 2: We change how you feel */}
        <motion.div
          style={{ opacity: phase2Opacity, y: phase2Y, scale: phase2Scale }}
          className="absolute max-w-5xl will-change-transform"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-white/[0.03] px-3.5 py-1 mb-5">
            <span className="text-gold text-[9px]">✦</span>
            <span className="font-sans text-[9px] uppercase tracking-[0.32em] text-gold/80">
              THE INNER RESONANCE
            </span>
          </div>
          <h2 className="font-display text-[clamp(2.4rem,7vw,6.5rem)] font-light leading-[0.96] tracking-tight text-[#f7f3ec]">
            WE CHANGE
            <span className="gold-foil block font-normal italic">HOW YOU FEEL.</span>
          </h2>
        </motion.div>

        {/* Phase 3: And sometimes, that changes everything */}
        <motion.div
          style={{ opacity: phase3Opacity, y: phase3Y, scale: phase3Scale }}
          className="absolute max-w-5xl will-change-transform"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-white/[0.03] px-3.5 py-1 mb-5">
            <span className="text-gold text-[9px]">✦</span>
            <span className="font-sans text-[9px] uppercase tracking-[0.32em] text-gold/80">
              THE TRANSFORMATION
            </span>
          </div>
          <h2 className="font-display text-[clamp(2.4rem,7vw,6.5rem)] font-light leading-[0.96] tracking-tight text-[#f7f3ec]">
            AND SOMETIMES...
            <span className="block text-gold-hi italic">THAT CHANGES EVERYTHING.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-lg font-sans text-[13px] leading-relaxed text-ivory/60">
            Ten unhurried minutes in daylight lamps. One master artisan. No rush, no pretense.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
