import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { SITE, TESTIMONIALS } from '../../data/salon'
import { EASE_SILK } from '../../lib/motion'
import { SectionHeading, Stars } from '../ui/Bits'
import { Reveal } from '../ui/Reveal'
import { useInView } from '../../hooks/useResponsive'

const ROTATE_MS = 7600

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 })

  useEffect(() => {
    if (paused || !inView || reduced) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), ROTATE_MS)
    return () => window.clearInterval(id)
  }, [paused, inView, reduced])

  const active = TESTIMONIALS[index]

  const stats = [
    { value: SITE.stats.rating.toFixed(1), label: 'Google rating', detail: `${SITE.stats.reviews} reviews` },
    { value: `${SITE.stats.years}`, label: 'Years in Bandra', detail: 'Est. since 2013' },
    { value: SITE.stats.clients, label: 'Clients looked after', detail: 'Since opening' },
    { value: SITE.stats.services, label: 'Services performed', detail: 'Hair, skin & bridal' },
  ]

  return (
    <section
      id="reviews"
      className="relative bg-ink py-24 text-ivory sm:py-28 lg:py-36"
      aria-labelledby="reviews-title"
    >
      <div className="container-editorial">
        <SectionHeading
          index="09"
          eyebrow="In Their Words"
          tone="light"
          lines={['What clients', 'actually say.']}
          as="h2"
        />

        <div
          ref={ref}
          className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* The quote */}
          <div className="relative min-h-[280px]">
            <Stars value={active.rating} className="text-champagne" />

            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.75, ease: EASE_SILK }}
                className="mt-7"
              >
                <p className="font-display text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.24] text-ivory/95">
                  “{active.quote}”
                </p>
                <footer className="mt-7 flex items-center gap-4">
                  <span className="h-px w-10 bg-champagne" />
                  <cite className="not-italic">
                    <span className="font-sans text-[13px] text-ivory">— {active.name}</span>
                    <span className="ml-3 font-sans text-[10px] uppercase tracking-label text-ivory/45">
                      {active.context}
                    </span>
                  </cite>
                </footer>
              </motion.blockquote>
            </AnimatePresence>

            {/* index / controls */}
            <div className="mt-10 flex items-center gap-6">
              <p className="font-sans text-[10px] tracking-label text-ivory/40">
                {String(index + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}
              </p>
              <div className="relative h-px flex-1 overflow-hidden bg-ivory/15">
                <motion.span
                  key={`${active.id}-${paused}-${inView}`}
                  className="absolute inset-y-0 left-0 bg-champagne"
                  initial={{ width: '0%' }}
                  animate={{ width: paused || reduced ? '0%' : '100%' }}
                  transition={{ duration: paused || reduced ? 0 : ROTATE_MS / 1000, ease: 'linear' }}
                />
              </div>
              <ul className="flex items-center gap-3">
                {TESTIMONIALS.map((t, i) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Read testimonial from ${t.name}`}
                      aria-current={i === index}
                      className={`block h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                        i === index ? 'bg-champagne' : 'bg-ivory/25 hover:bg-ivory/60'
                      }`}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Named list, doubles as navigation */}
          <div className="border-t border-ivory/12 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <p className="font-sans text-[10px] uppercase tracking-label text-ivory/45">
              Recent guests
            </p>
            <ul className="mt-5 space-y-3">
              {TESTIMONIALS.map((t, i) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`group flex w-full items-center justify-between gap-4 py-1.5 text-left transition-colors duration-500 ${
                      i === index ? 'text-ivory' : 'text-ivory/45 hover:text-ivory/80'
                    }`}
                  >
                    <span className="font-display text-xl">{t.name}</span>
                    <span className="font-sans text-[10px] uppercase tracking-label">{t.context}</span>
                  </button>
                </li>
              ))}
            </ul>

            <Reveal delay={0.15}>
              <p className="mt-8 text-[12px] leading-relaxed text-ivory/40">
                Reviews are collected after every appointment. Nothing is edited, and nothing is
                bought.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Numbers */}
        <dl className="mt-20 grid grid-cols-2 gap-y-10 border-t border-ivory/12 pt-12 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <dt className="font-sans text-[10px] uppercase tracking-label text-ivory/45">
                {s.label}
              </dt>
              <dd className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-none text-champagne">
                {s.value}
              </dd>
              <p className="mt-2 font-sans text-[11px] text-ivory/40">{s.detail}</p>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
