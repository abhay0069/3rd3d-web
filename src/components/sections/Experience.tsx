import { assetUrl } from '../../lib/assets'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HOTSPOTS, type Hotspot } from '../../data/salon'
import { EASE_SILK } from '../../lib/motion'
import { useBooking } from '../../store/booking'
import { ParallaxMedia } from '../ui/ParallaxMedia'
import { SectionHeading } from '../ui/Bits'
import { Reveal } from '../ui/Reveal'

const PLATES = [
  { id: 'wide' as const, label: 'The Floor', src: assetUrl('/img/salon-interior-wide.jpg'), alt: 'The main styling floor' },
  { id: 'colour' as const, label: 'Colour Studio', src: assetUrl('/img/salon-color-studio.jpg'), alt: 'The colour mixing studio' },
  { id: 'bridal' as const, label: 'Bridal Suite', src: assetUrl('/img/salon-bridal-suite.jpg'), alt: 'The private bridal suite' },
]

/**
 * “Step inside” — the salon as a place you can explore.
 * Hotspots only ever describe things that genuinely exist in the photographs.
 */
export function Experience() {
  const [plate, setPlate] = useState<(typeof PLATES)[number]['id']>('wide')
  const [openId, setOpenId] = useState<string | null>(null)
  const openBooking = useBooking((s) => s.open)
  const cardRef = useRef<HTMLDivElement>(null)

  const active = PLATES.find((p) => p.id === plate)!
  const spots = HOTSPOTS.filter((h) => h.image === plate)
  const open = spots.find((s) => s.id === openId) ?? null

  useEffect(() => setOpenId(null), [plate])

  useEffect(() => {
    if (!openId) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenId(null)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openId])

  const place = (spot: Hotspot) => ({
    left: `${spot.x}%`,
    top: `${spot.y}%`,
  })

  return (
    <section id="experience" className="relative bg-ink py-24 text-ivory sm:py-28 lg:py-36">
      <div className="container-editorial">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="10"
            eyebrow="The Salon, at last"
            tone="light"
            lines={['And here,', <em key="b" className="italic text-champagne">the world becomes real.</em>]}
            intro="After the portals, portraits and rituals, meet the place that has been waiting at the end of the golden thread: the LUMIÈRE salon in Bandra West. Explore each room before you arrive."
          />
          <Reveal delay={0.2}>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Studio areas">
              {PLATES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={plate === p.id}
                  onClick={() => setPlate(p.id)}
                  className={`rounded-full border px-4 py-2 font-sans text-[10px] uppercase tracking-wide2 transition-colors duration-500 ${
                    plate === p.id
                      ? 'border-champagne bg-champagne/10 text-champagne'
                      : 'border-ivory/20 text-ivory/60 hover:border-ivory/50 hover:text-ivory'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="relative mt-14">
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={plate}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: EASE_SILK }}
              >
                <ParallaxMedia
                  src={active.src}
                  alt={`${active.alt} at the LUMIÈRE studio`}
                  className="aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[16/9]"
                  distance={50}
                  zoom={1.08}
                >
                  <span aria-hidden className="absolute inset-0 bg-ink/25" />

                  {/* Hotspots */}
                  {spots.map((spot) => {
                    const isOpen = openId === spot.id
                    return (
                      <button
                        key={spot.id}
                        type="button"
                        onClick={() => setOpenId(isOpen ? null : spot.id)}
                        aria-expanded={isOpen}
                        aria-label={`${spot.title} — show details`}
                        className="group absolute -translate-x-1/2 -translate-y-1/2 p-3"
                        style={place(spot)}
                      >
                        <span className="relative flex h-3 w-3 items-center justify-center">
                          <span
                            className={`absolute inset-0 rounded-full border transition-all duration-700 ease-silk ${
                              isOpen ? 'scale-[2.1] border-champagne' : 'border-ivory/80'
                            }`}
                          />
                          <span className="h-1.5 w-1.5 rounded-full bg-champagne" />
                          <span className="absolute inset-0 animate-ping rounded-full bg-champagne/40" />
                        </span>
                        <span
                          className={`absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-sans text-[10px] uppercase tracking-label text-ivory transition-opacity duration-500 ${
                            isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-80'
                          }`}
                        >
                          {spot.title}
                        </span>
                      </button>
                    )
                  })}
                </ParallaxMedia>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Detail card — anchored beside the marker on desktop, a sheet on mobile */}
          <AnimatePresence>
            {open && (
              <motion.div
                ref={cardRef}
                key={open.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.6, ease: EASE_SILK }}
                className="glass-dark absolute inset-x-4 bottom-4 rounded-sm p-6 sm:inset-x-auto sm:bottom-auto sm:w-[22rem] sm:p-7"
                style={{
                  ...(open.x > 55 ? { right: `${100 - open.x + 6}%` } : { left: `${open.x + 6}%` }),
                  top: `${Math.min(open.y, 52)}%`,
                }}
              >
                <p className="font-sans text-[10px] uppercase tracking-label text-champagne">
                  {active.label}
                </p>
                <h3 className="mt-3 font-display text-2xl text-ivory">{open.title}</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-ivory/70">{open.description}</p>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => openBooking()}
                    className="font-sans text-[11px] uppercase tracking-wide2 text-champagne underline-offset-4 hover:underline"
                  >
                    Book an appointment
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenId(null)}
                    aria-label="Close details"
                    className="font-sans text-[11px] uppercase tracking-wide2 text-ivory/50 hover:text-ivory"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Supporting detail strip */}
        <div className="mt-10 grid gap-6 border-t border-ivory/12 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Address', '14 Turner Road, Bandra West'],
            ['Hours', 'Tue–Sat 10:00–20:00 · Sun 11:00–18:00'],
            ['Private rooms', 'Beauty room & bridal suite, lockable'],
            ['Complimentary', 'Consultation, tea, and honest advice'],
          ].map(([label, value]) => (
            <Reveal key={label} y={14}>
              <p className="font-sans text-[10px] uppercase tracking-label text-ivory/45">{label}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-ivory/85">{value}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
