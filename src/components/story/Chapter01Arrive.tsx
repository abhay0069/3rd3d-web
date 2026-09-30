import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { sound } from '../../lib/audio'
import { useStory } from '../../store/story'

export function Chapter01Arrive() {
  const containerRef = useRef<HTMLDivElement>(null)
  const setCursor = useStory((s) => s.setCursor)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Text moves forward into depth & dissolves as the user scrolls into the realm
  const textScale = useTransform(scrollYProgress, [0, 0.7], [1, 2.2])
  const textOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8], [1, 0.7, 0])
  const textZ = useTransform(scrollYProgress, [0, 0.8], [0, 240])

  const scrollToNext = () => {
    sound.playClick()
    const nextEl = document.getElementById('discover')
    if (nextEl) {
      nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section
      id="arrive"
      ref={containerRef}
      className="relative flex h-[150vh] w-full flex-col items-center justify-start overflow-hidden bg-transparent pt-[16vh] sm:pt-[20vh]"
      onMouseEnter={() => setCursor('explore', 'ENTER')}
      onMouseLeave={() => setCursor('default')}
    >
      <div className="sticky top-[14vh] sm:top-[16vh] flex w-full max-w-6xl flex-col items-center px-6 text-center">
        {/* Noomo-Style Chic Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-white/[0.04] px-4 py-1.5 backdrop-blur-md"
        >
          <span className="text-[11px] text-gold animate-pulse">✦</span>
          <span className="font-sans text-[9px] uppercase tracking-[0.34em] text-gold-hi sm:text-[10px]">
            AN INTERACTIVE DIGITAL ART EXPERIENCE
          </span>
          <span className="text-[11px] text-gold animate-pulse">✦</span>
        </motion.div>

        {/* Massive graphic typography occupying the environment */}
        <motion.div
          style={{
            scale: textScale,
            opacity: textOpacity,
            z: textZ,
          }}
          className="mt-8 will-change-transform"
        >
          <h1 className="font-display text-[clamp(2.7rem,8.6vw,7.8rem)] font-light leading-[0.92] tracking-[-0.035em] text-[#f7f3ec]">
            <span className="block opacity-90">WHAT IF</span>
            <span className="gold-foil block font-normal italic tracking-[-0.02em] py-1">
              BEAUTY
            </span>
            <span className="block opacity-90">WAS SOMETHING</span>
            <span className="block opacity-90">YOU COULD</span>
            <span className="block text-gold-hi drop-shadow-[0_0_40px_rgba(205,170,110,0.35)]">
              STEP INTO?
            </span>
          </h1>
        </motion.div>

        {/* Noomo-Style Interactive "Tap to Explore" Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col items-center gap-6"
        >
          <button
            type="button"
            onClick={scrollToNext}
            className="group relative flex items-center gap-3.5 rounded-full border border-gold/40 bg-gradient-to-r from-gold/20 via-gold-hi/30 to-gold/20 px-8 py-3.5 text-ivory backdrop-blur-xl shadow-[0_0_35px_rgba(205,170,110,0.25)] transition-all duration-500 hover:scale-105 hover:border-gold hover:shadow-[0_0_55px_rgba(205,170,110,0.45)]"
          >
            <span className="text-[13px] text-gold-hi group-hover:rotate-45 transition-transform duration-500">
              ✦
            </span>
            <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#f7f3ec] font-medium">
              TAP TO ENTER THE REALM
            </span>
            <span className="text-[13px] text-gold-hi group-hover:-rotate-45 transition-transform duration-500">
              ✦
            </span>
          </button>

          {/* Floating Chic Studio Spec Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-ivory/50 font-sans text-[10px] tracking-widest uppercase">
            <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1">
              BANDRA WEST · MUMBAI
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1">
              5500K DAYLIGHT CALIBRATED
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1">
              PRIVATE SANCTUARIES
            </span>
          </div>

          {/* Subtle Scroll Cue */}
          <div className="flex flex-col items-center gap-2 pt-2 opacity-60">
            <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-ivory/60">
              OR SCROLL TO DIVE DEEP
            </span>
            <div className="relative h-10 w-px overflow-hidden bg-ivory/20">
              <motion.div
                animate={{ y: [-16, 40] }}
                transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut' }}
                className="h-4 w-full bg-gradient-to-b from-transparent via-gold to-transparent"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
