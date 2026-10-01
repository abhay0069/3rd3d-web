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
  const textScale = useTransform(scrollYProgress, [0, 0.7], [1, 2.0])
  const textOpacity = useTransform(scrollYProgress, [0, 0.45, 0.8], [1, 0.6, 0])
  const textZ = useTransform(scrollYProgress, [0, 0.8], [0, 200])

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
      className="relative flex h-[160vh] w-full flex-col items-center justify-start overflow-hidden bg-transparent pt-[14vh] sm:pt-[18vh]"
      onMouseEnter={() => setCursor('explore', 'ENTER')}
      onMouseLeave={() => setCursor('default')}
    >
      <div className="sticky top-[12vh] sm:top-[14vh] flex w-full max-w-6xl flex-col items-center px-6 text-center">
        {/* Noomo Agency Exact Headline Style */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          <p className="font-sans text-[11px] sm:text-[13px] tracking-[0.55em] uppercase text-ivory/70 font-light">
            T H E &nbsp; P O W E R &nbsp; O F &nbsp; D I G I T A L
          </p>
          <h1 className="font-display text-[clamp(2.8rem,8.2vw,7.6rem)] font-light leading-[0.9] tracking-[0.06em] text-[#f7f3ec] uppercase">
            S T O R Y T E L L I N G
          </h1>
        </motion.div>

        {/* Crystalline Subtitle */}
        <motion.div
          style={{
            scale: textScale,
            opacity: textOpacity,
            z: textZ,
          }}
          className="mt-6 will-change-transform max-w-2xl"
        >
          <p className="font-serif italic text-[16px] sm:text-[21px] text-gold-hi leading-relaxed drop-shadow-[0_0_30px_rgba(205,170,110,0.3)]">
            "What if beauty was something you could step into?"
          </p>
        </motion.div>

        {/* Noomo Signature "Tap to explore" button with pixel stars */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col items-center gap-6"
        >
          <button
            type="button"
            onClick={scrollToNext}
            className="group relative flex items-center gap-3.5 rounded-full border border-gold/40 bg-gradient-to-r from-gold/15 via-gold-hi/25 to-gold/15 px-8 py-3 text-ivory backdrop-blur-2xl shadow-[0_0_35px_rgba(205,170,110,0.25)] transition-all duration-500 hover:scale-105 hover:border-gold hover:shadow-[0_0_55px_rgba(205,170,110,0.45)]"
          >
            <span className="text-[13px] text-gold-hi group-hover:rotate-45 transition-transform duration-500">
              ✦
            </span>
            <span className="font-sans text-[11px] uppercase tracking-[0.32em] text-[#f7f3ec] font-medium">
              TAP TO EXPLORE
            </span>
            <span className="text-[13px] text-gold-hi group-hover:-rotate-45 transition-transform duration-500">
              ✦
            </span>
          </button>

          {/* Floating Chic Specs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-ivory/50 font-sans text-[9.5px] tracking-[0.24em] uppercase">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1">
              REIMAGINE PHOENIX
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1">
              ATELIER BANDRA WEST
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1">
              DAYLIGHT CALIBRATED
            </span>
          </div>

          {/* Minimalist Scroll Arrow Cue */}
          <div className="flex flex-col items-center gap-2 pt-4 opacity-60">
            <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-ivory/50">
              SCROLL TO FLY
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
