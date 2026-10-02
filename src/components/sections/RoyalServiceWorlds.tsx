import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { formatDuration, formatPrice, SERVICES, type Service } from '../../data/salon'
import { EASE_SILK } from '../../lib/motion'
import { useBooking } from '../../store/booking'

const WORLDS: { label: string; title: string; service: string; line: string }[] = [
  { label: 'Hair', title: 'The Hair Atelier', service: 'haircut', line: 'Sculpted to move. Made to belong to you.' },
  { label: 'Colour', title: 'The Colour Salon', service: 'hair-colour', line: 'Light, tone and dimension, painted by hand.' },
  { label: 'Skin', title: 'The Skin Ritual', service: 'facial', line: 'Restorative care, considered down to the last touch.' },
  { label: 'Makeup', title: 'The Beauty Room', service: 'makeup', line: 'Your own features, seen in their most luminous light.' },
  { label: 'Bridal', title: 'The Bridal Suite', service: 'bridal-makeup', line: 'A private world for the day you will remember.' },
]

function getService(id: string): Service {
  return SERVICES.find((service) => service.id === id) ?? SERVICES[0]
}

export function RoyalServiceWorlds() {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const openBooking = useBooking((state) => state.open)
  const world = WORLDS[active]
  const service = getService(world.service)

  return (
    <section id="services" className="royal-panel relative z-10 overflow-hidden py-24 text-ivory sm:py-32 lg:py-40">
      <div className="royal-panel-ornament pointer-events-none absolute inset-0" />
      <div className="container-editorial relative">
        <div className="royal-section-kicker" data-royal-reveal>
          <span>02</span><i /><span>Choose your world</span>
        </div>

        <div className="mt-7 grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(390px,0.8fr)] lg:items-end lg:gap-20">
          <div>
            <p data-royal-reveal className="max-w-2xl font-display text-[clamp(3rem,6.2vw,6rem)] leading-[0.93] tracking-[-0.045em] text-[#F1E7D8]">
              Artistry is a
              <br />
              <em className="font-normal text-champagne">world of its own.</em>
            </p>
            <p data-royal-reveal className="mt-7 max-w-[440px] text-[13px] leading-[1.85] text-ivory/62 sm:text-[14px]">
              Each ritual has its own language. Choose a doorway; your artist will shape everything
              around the person you are, and the one you are becoming.
            </p>

            <div role="tablist" aria-label="Salon service worlds" className="mt-9 border-y border-champagne/20">
              {WORLDS.map((item, index) => (
                <button
                  key={item.service}
                  type="button"
                  role="tab"
                  aria-selected={active === index}
                  aria-controls="service-world-panel"
                  onClick={() => setActive(index)}
                  className={`royal-world-tab group flex w-full items-center gap-4 border-b border-ivory/10 py-4 text-left last:border-b-0 sm:gap-6 sm:py-[18px] ${active === index ? 'is-active' : ''}`}
                >
                  <span className="font-sans text-[9px] tracking-[0.2em] text-champagne/65">0{index + 1}</span>
                  <span className="min-w-0 flex-1 font-display text-[clamp(1.28rem,2.25vw,2rem)] leading-none text-ivory/56 transition-colors duration-500 group-hover:text-ivory">
                    {item.title}
                  </span>
                  <span aria-hidden className="royal-world-arrow text-champagne">↗</span>
                </button>
              ))}
            </div>
          </div>

          <div id="service-world-panel" role="tabpanel" aria-live="polite" className="relative">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={world.service}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.99 }}
                transition={{ duration: reduced ? 0.25 : 0.75, ease: EASE_SILK }}
                className="royal-world-portrait"
              >
                <div className="relative aspect-[4/4.8] overflow-hidden">
                  <img
                    src={service.image}
                    alt={`${world.label} ritual at LUMIÈRE`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <div className="royal-world-image-wash absolute inset-0" />
                  <div className="absolute left-5 top-5 flex items-center gap-3 sm:left-7 sm:top-7">
                    <span className="h-2 w-2 rounded-full bg-champagne shadow-[0_0_18px_rgba(224,188,125,0.85)]" />
                    <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-ivory/85">The {world.label} world</span>
                  </div>
                  <p className="absolute inset-x-6 bottom-6 max-w-[360px] font-display text-[clamp(2rem,4vw,3.3rem)] leading-[0.99] text-ivory sm:inset-x-8 sm:bottom-8">
                    {world.line}
                  </p>
                  <div className="royal-photo-corner" aria-hidden />
                </div>

                <div className="mt-5 flex flex-wrap items-end justify-between gap-5 border-t border-champagne/22 pt-5">
                  <div>
                    <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-champagne/78">A considered beginning</p>
                    <p className="mt-2 max-w-[300px] text-[12px] leading-relaxed text-ivory/58">{service.description}</p>
                    <p className="mt-3 font-sans text-[10px] tracking-[0.12em] text-ivory/42">
                      {formatDuration(service.duration)} <span className="mx-2 text-champagne/60">/</span> from {formatPrice(service.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openBooking({ service })}
                    className="royal-button royal-button--gold shrink-0"
                  >
                    Begin this ritual
                  </button>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
