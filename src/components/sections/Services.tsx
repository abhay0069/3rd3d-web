import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CATEGORIES, SERVICES, formatDuration, formatPrice, type Service } from '../../data/salon'
import { EASE_EXPO } from '../../lib/motion'
import { useBooking } from '../../store/booking'
import { SectionHeading } from '../ui/Bits'
import { Magnetic } from '../ui/Magnetic'
import { Reveal } from '../ui/Reveal'

function ServiceRow({
  service,
  index,
  active,
  onHover,
  onBook,
}: {
  service: Service
  index: number
  active: boolean
  onHover: () => void
  onBook: () => void
}) {
  return (
    <li
      onMouseEnter={onHover}
      onFocus={onHover}
      className="group relative border-b border-ivory/10 py-7 first:border-t sm:py-9"
    >
      {/* a gold hairline sweeps in under the row */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-gold via-gold-hi/70 to-transparent transition-transform duration-[900ms] ease-expo group-hover:scale-x-100"
      />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
        <div className="flex min-w-0 flex-1 gap-5 sm:gap-7">
          <span
            className={`mt-2.5 w-7 shrink-0 font-sans text-[11px] tracking-label transition-colors duration-500 ${
              active ? 'text-gold-hi' : 'text-gold/60'
            }`}
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          <div className="min-w-0">
            <h3
              className={`font-display text-[1.75rem] leading-tight transition-all duration-700 ease-expo sm:text-[2.35rem] ${
                active ? 'text-gold-hi sm:translate-x-2' : 'text-ivory'
              }`}
            >
              {service.name}
            </h3>
            <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-ivory/55">{service.description}</p>
            <p className="mt-3 hidden font-sans text-[11px] tracking-wide2 text-ivory/35 lg:block">
              {service.includes.join('  ·  ')}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-6 pl-12 sm:flex-col sm:items-end sm:justify-start sm:gap-4 sm:pl-0">
          <div className="text-left sm:text-right">
            <p className="font-sans text-[13px] text-ivory/85">{formatDuration(service.duration)}</p>
            <p className="font-sans text-[11px] uppercase tracking-wide2 text-gold">
              from {formatPrice(service.price)}
            </p>
          </div>

          <Magnetic strength={0.16} max={7}>
            <button
              type="button"
              onClick={onBook}
              data-cursor="hover"
              className={`btn !px-6 !py-2.5 ${active ? 'btn-gold' : 'btn-line'}`}
              aria-label={`Book ${service.name}`}
            >
              Book
            </button>
          </Magnetic>
        </div>
      </div>
    </li>
  )
}

export function Services() {
  const [category, setCategory] = useState(CATEGORIES[0].id)
  const [hovered, setHovered] = useState<string | null>(null)
  const openBooking = useBooking((s) => s.open)

  const list = useMemo(() => SERVICES.filter((s) => s.category === category), [category])
  const preview = useMemo(() => list.find((s) => s.id === hovered) ?? list[0], [list, hovered])
  const activeCategory = CATEGORIES.find((c) => c.id === category)!

  return (
    <section id="services" className="relative bg-noir py-28 sm:py-32 lg:py-40">
      <div className="container-editorial">
        <SectionHeading
          index="01"
          eyebrow="Services"
          tone="light"
          lines={['Considered work,', <em key="b">clearly priced.</em>]}
          intro="Every appointment begins with a consultation and ends with a plan for what happens after you leave the chair."
        />

        {/* Category switch */}
        <Reveal y={20} className="mt-16">
          <div
            className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-b border-ivory/10"
            role="tablist"
            aria-label="Service categories"
          >
            <div className="flex gap-x-5 xs:gap-x-7 sm:gap-x-12">
              {CATEGORIES.map((c) => {
                const count = SERVICES.filter((s) => s.category === c.id).length
                const on = category === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => {
                      setCategory(c.id)
                      setHovered(null)
                    }}
                    className={`relative pb-4 font-display text-[1.5rem] leading-none transition-colors duration-500 xs:text-[1.8rem] sm:text-[2.6rem] ${
                      on ? 'text-ivory' : 'text-ivory/30 hover:text-ivory/65'
                    }`}
                  >
                    {c.label}
                    <sup className="ml-1 align-super font-sans text-[9px] tracking-label text-gold sm:ml-1.5 sm:text-[10px]">
                      {String(count).padStart(2, '0')}
                    </sup>
                    {on && (
                      <motion.span
                        layoutId="service-tab"
                        className="absolute inset-x-0 -bottom-px h-px bg-gold"
                        transition={{ duration: 0.8, ease: EASE_EXPO }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
            <p className="hidden max-w-xs pb-4 text-[12.5px] leading-relaxed text-ivory/45 lg:block">
              {activeCategory.intro}
            </p>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          {/* List */}
          <div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.ul
                key={category}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: EASE_EXPO }}
                className="list-none"
              >
                {list.map((s, i) => (
                  <ServiceRow
                    key={s.id}
                    service={s}
                    index={i}
                    active={hovered === s.id}
                    onHover={() => setHovered(s.id)}
                    onBook={() => openBooking({ service: s })}
                  />
                ))}
              </motion.ul>
            </AnimatePresence>

            {/* Mobile preview — the visual follows the list instead of sitting beside it */}
            <div className="mt-12 lg:hidden">
              <div className="arch-ring mx-auto w-[72%] max-w-[340px]">
                <div className="arch relative aspect-[3/3.9] overflow-hidden bg-umber">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.img
                      key={preview.id}
                      src={preview.image}
                      alt={preview.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                      initial={{ opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: EASE_EXPO }}
                    />
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky arch preview */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="arch-ring mx-auto w-[86%]" aria-hidden>
                <div className="arch relative aspect-[3/4.05] overflow-hidden bg-umber">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.img
                      key={preview.id}
                      src={preview.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 1, ease: EASE_EXPO }}
                    />
                  </AnimatePresence>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent px-6 pb-8 pt-24 text-center">
                    <p className="font-sans text-[10px] uppercase tracking-label text-gold">{activeCategory.title}</p>
                    <p className="mt-2 font-display text-[1.7rem] leading-tight text-ivory">{preview.name}</p>
                  </div>
                </div>
              </div>

              <div className="mx-auto mt-10 flex w-[86%] items-baseline justify-between border-t border-ivory/10 pt-4 font-sans text-[11px] uppercase tracking-wide2 text-ivory/40">
                <span>{list.length} services</span>
                <span>All prices in INR</span>
              </div>

              <button
                type="button"
                onClick={() => openBooking()}
                data-cursor="hover"
                className="btn btn-line mx-auto mt-6 flex w-[86%]"
              >
                Book an appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
