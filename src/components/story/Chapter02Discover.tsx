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
  const phase1Y = useTransform(scrollYProgress, [0.05, 0.32], [50, -50])
  const phase1Scale = useTransform(scrollYProgress, [0.05, 0.32], [0.94, 1.1])

  const phase2Opacity = useTransform(scrollYProgress, [0.32, 0.48, 0.62], [0, 1, 0])
  const phase2Y = useTransform(scrollYProgress, [0.32, 0.62], [50, -50])
  const phase2Scale = useTransform(scrollYProgress, [0.32, 0.62], [0.94, 1.1])

  const phase3Opacity = useTransform(scrollYProgress, [0.62, 0.78, 0.92], [0, 1, 0])
  const phase3Y = useTransform(scrollYProgress, [0.62, 0.92], [50, -50])
  const phase3Scale = useTransform(scrollYProgress, [0.62, 0.92], [0.94, 1.1])

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
        {/* Phase 1: In a world constantly shifting... */}
        <motion.div
          style={{ opacity: phase1Opacity, y: phase1Y, scale: phase1Scale }}
          className="absolute max-w-4xl will-change-transform space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-white/[0.03] px-3.5 py-1">
            <span className="text-gold text-[9px]">✦</span>
            <span className="font-sans text-[9px] uppercase tracking-[0.34em] text-gold/80">
              01 · THE JOURNEY
            </span>
          </div>
          <h2 className="font-display text-[clamp(2.2rem,6.5vw,5.5rem)] font-light leading-[1.0] tracking-tight text-[#f7f3ec]">
            IN A WORLD CONSTANTLY SHIFTING,
            <span className="block italic text-gold-hi mt-2">
              WHAT GUIDES US THROUGH CHANGE?
            </span>
          </h2>
          <p className="mx-auto max-w-md font-sans text-[13px] leading-relaxed text-ivory/60 pt-2">
            Stories emerge from fire, ash, and reinvention.
          </p>
        </motion.div>

        {/* Phase 2: The best stories don't just speak to us */}
        <motion.div
          style={{ opacity: phase2Opacity, y: phase2Y, scale: phase2Scale }}
          className="absolute max-w-4xl will-change-transform space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-white/[0.03] px-3.5 py-1">
            <span className="text-gold text-[9px]">✦</span>
            <span className="font-sans text-[9px] uppercase tracking-[0.34em] text-gold/80">
              02 · THE INVITATION
            </span>
          </div>
          <h2 className="font-display text-[clamp(2.2rem,6.5vw,5.5rem)] font-light leading-[1.0] tracking-tight text-[#f7f3ec]">
            THE BEST STORIES
            <span className="block opacity-80">DON'T JUST SPEAK TO US.</span>
            <span className="gold-foil block font-normal italic mt-2">
              THEY INVITE US INSIDE.
            </span>
          </h2>
        </motion.div>

        {/* Phase 3: How a spark becomes a fire */}
        <motion.div
          style={{ opacity: phase3Opacity, y: phase3Y, scale: phase3Scale }}
          className="absolute max-w-4xl will-change-transform space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-white/[0.03] px-3.5 py-1">
            <span className="text-gold text-[9px]">✦</span>
            <span className="font-sans text-[9px] uppercase tracking-[0.34em] text-gold/80">
              03 · THE TRANSMUTATION
            </span>
          </div>
          <h2 className="font-display text-[clamp(2.2rem,6.5vw,5.5rem)] font-light leading-[1.0] tracking-tight text-[#f7f3ec]">
            IT IS HOW A SPARK
            <span className="block text-gold-hi italic mt-2">
              BECOMES A LIVING FIRE.
            </span>
          </h2>
          <p className="mx-auto max-w-lg font-sans text-[13px] leading-relaxed text-ivory/60 pt-2">
            Storytelling is what you see, feel, hear, and interact with.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
