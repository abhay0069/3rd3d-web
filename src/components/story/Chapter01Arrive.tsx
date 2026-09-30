import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useStory } from '../../store/story'

export function Chapter01Arrive() {
  const containerRef = useRef<HTMLDivElement>(null)
  const setCursor = useStory((s) => s.setCursor)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Text moves forward into depth & fades away as camera moves through
  const textScale = useTransform(scrollYProgress, [0, 0.75], [1, 2.4])
  const textOpacity = useTransform(scrollYProgress, [0, 0.45, 0.85], [1, 0.8, 0])
  const textZ = useTransform(scrollYProgress, [0, 0.85], [0, 200])

  return (
    <section
      id="arrive"
      ref={containerRef}
      className="relative flex h-[140vh] w-full flex-col items-center justify-start overflow-hidden bg-transparent pt-[18vh]"
      onMouseEnter={() => setCursor('explore', 'EXPLORE')}
      onMouseLeave={() => setCursor('default')}
    >
      <div className="sticky top-[18vh] flex w-full max-w-6xl flex-col items-center px-6 text-center">
        {/* Subtle curiosity whisper */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="font-sans text-[10px] uppercase tracking-[0.38em] text-gold/80 sm:text-[11px]"
        >
          AN INTERACTIVE REALM OF BEAUTY
        </motion.p>

        {/* Massive graphic typography occupying the environment */}
        <motion.div
          style={{
            scale: textScale,
            opacity: textOpacity,
            z: textZ,
          }}
          className="mt-6 will-change-transform"
        >
          <h1 className="font-display text-[clamp(2.8rem,9vw,8.5rem)] font-light leading-[0.94] tracking-[-0.03em] text-[#f7f3ec]">
            <span className="block">WHAT IF</span>
            <span className="gold-foil block font-normal italic">BEAUTY</span>
            <span className="block">WAS SOMETHING</span>
            <span className="block">YOU COULD</span>
            <span className="block text-gold-hi">STEP INTO?</span>
          </h1>
        </motion.div>

        {/* First interactive hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.0 }}
          className="mt-14 flex flex-col items-center gap-3"
        >
          <span className="font-sans text-[9px] uppercase tracking-[0.32em] text-ivory/50">
            SCROLL TO ENTER THE WORLD
          </span>
          <div className="relative h-14 w-px overflow-hidden bg-ivory/20">
            <motion.div
              animate={{ y: [-24, 56] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="h-6 w-full bg-gradient-to-b from-transparent via-gold to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
