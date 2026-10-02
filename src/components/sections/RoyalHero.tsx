import { motion, useReducedMotion } from 'framer-motion'
import { SITE } from '../../data/salon'
import { useBooking } from '../../store/booking'
import { EASE_SILK } from '../../lib/motion'

export function RoyalHero({ revealed }: { revealed: boolean }) {
  const reduced = useReducedMotion()
  const openBooking = useBooking((state) => state.open)

  const enterHouse = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <section
      id="home"
      className="royal-hero relative z-10 flex min-h-[108svh] flex-col justify-end overflow-hidden px-5 pb-12 pt-28 text-ivory sm:px-10 sm:pb-16 lg:min-h-[112svh] lg:px-16 lg:pb-[7.5vh]"
      aria-labelledby="hero-title"
    >
      <div className="royal-hero-shade pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex w-full max-w-[1500px] items-center justify-between gap-5">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={revealed ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE_SILK }}
          className="font-sans text-[9px] uppercase tracking-[0.31em] text-champagne sm:text-[10px]"
        >
          {SITE.address.line2} · The House of LUMIÈRE
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1 } : undefined}
          transition={{ duration: 1, delay: 0.8 }}
          className="hidden font-sans text-[9px] uppercase tracking-[0.28em] text-ivory/55 md:block"
        >
          A new ritual of beauty <span className="mx-2 text-champagne">✳</span> Est. 2013
        </motion.p>
      </div>

      <div className="relative mx-auto mt-7 grid w-full max-w-[1500px] items-end gap-10 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.42fr)] lg:mt-10 lg:gap-16">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={revealed ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.28, ease: EASE_SILK }}
            className="mb-4 flex items-center gap-3 font-sans text-[9px] uppercase tracking-[0.34em] text-champagne sm:mb-6 sm:text-[10px]"
          >
            <span className="h-px w-8 bg-champagne/70" /> A royal beauty house
          </motion.p>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
            animate={revealed ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
            transition={{ duration: reduced ? 0.35 : 1.25, delay: 0.42, ease: EASE_SILK }}
            className="max-w-[950px] font-display text-[clamp(4.3rem,10vw,10.8rem)] leading-[0.78] tracking-[-0.065em] text-[#F1E7D8]"
          >
            Enter a world
            <br />
            <em className="ml-[0.28em] font-normal text-champagne">of beauty.</em>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={revealed ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.72, ease: EASE_SILK }}
            className="mt-7 flex max-w-[720px] flex-col gap-7 sm:mt-9 sm:flex-row sm:items-end sm:justify-between lg:mt-11"
          >
            <p className="max-w-[330px] text-[13px] leading-[1.8] text-ivory/68 sm:text-[14px]">
              A palace of possibility. Step through the atelier where artistry, ritual and a little
              golden light become entirely, unmistakably yours.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={enterHouse} className="royal-button royal-button--outline group">
                <span>Discover the house</span>
                <span aria-hidden className="royal-button-arrow transition-transform duration-500 group-hover:translate-x-1">↗</span>
              </button>
              <button type="button" onClick={() => openBooking({ step: 1 })} className="royal-button royal-button--gold">
                Reserve your visit
              </button>
            </div>
          </motion.div>
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={revealed ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 1.1, delay: 1.02, ease: EASE_SILK }}
          className="hidden justify-self-end border-l border-champagne/25 pl-6 pb-1 text-right lg:block"
        >
          <p className="font-display text-[38px] italic leading-none text-champagne">01</p>
          <p className="mt-3 font-sans text-[9px] uppercase tracking-[0.27em] text-ivory/54">The threshold</p>
          <p className="mt-5 max-w-[190px] text-[11px] leading-relaxed text-ivory/55">
            Leave the ordinary at the door. Your story begins on the other side.
          </p>
        </motion.aside>
      </div>

      <div className="relative mx-auto mt-12 flex w-full max-w-[1500px] items-end justify-between border-t border-ivory/18 pt-5 sm:mt-16 lg:mt-[7vh]">
        <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-ivory/45">
          Mumbai <span className="mx-2 text-champagne/70">/</span> Bandra West
        </p>
        <button type="button" onClick={enterHouse} className="group flex items-center gap-3 font-sans text-[9px] uppercase tracking-[0.27em] text-ivory/65 hover:text-ivory">
          <span>Scroll to enter</span>
          <span className="royal-scroll-chevron" aria-hidden>↓</span>
        </button>
        <p className="hidden font-sans text-[9px] uppercase tracking-[0.24em] text-ivory/45 sm:block">
          Hair <span className="mx-2 text-champagne/60">·</span> Skin <span className="mx-2 text-champagne/60">·</span> Bridal
        </p>
      </div>
    </section>
  )
}
