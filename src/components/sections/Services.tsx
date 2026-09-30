import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CATEGORIES, SERVICES, SITE, formatDuration, formatPrice, type Service } from '../../data/salon'
import { EASE_SILK } from '../../lib/motion'
import { useBooking } from '../../store/booking'
import { SectionHeading } from '../ui/Bits'
import { Magnetic } from '../ui/Magnetic'

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
      className="group relative border-b border-charcoal/10 py-6 first:border-t sm:py-7"
    >
      {/* the hover wash stays almost invisible — it is there to give depth, not colour */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-4 inset-y-0 -z-10 bg-charcoal/[0.025] opacity-0 transition-opacity duration-500 ease-silk group-hover:opacity-100"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
        <div className="flex min-w-0 flex-1 gap-5">
          <span
            className={`mt-1 font-sans text-[10px] tracking-label text-taupe transition-all duration-500 ease-silk ${
              active ? 'text-brass' : ''
            }`}
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          <div className="min-w-0">
            <h3
              className={`font-display text-[1.6rem] leading-tight text-charcoal transition-all duration-500 ease-silk sm:text-[2rem] ${
                active ? 'sm:translate-x-1.5' : ''
              }`}
            >
              {service.name}
            </h3>
            <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-smoke">
              {service.description}
            </p>
            <p className="mt-3 hidden font-sans text-[11px] tracking-wide2 text-taupe lg:block">
              {service.includes.join('  ·  ')}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end sm:justify-start sm:gap-3">
          <div className="text-left sm:text-right">
            <p className="font-sans text-[13px] text-charcoal">
              {formatDuration(service.duration)}
            </p>
            <p className="font-sans text-[11px] uppercase tracking-wide2 text-taupe">
              from {formatPrice(service.price)}
            </p>
          </div>

          <Magnetic strength={0.16} max={7}>
            <button
              type="button"
              onClick={onBook}
              data-cursor="hover"
              className={`btn !px-6 !py-2.5 transition-colors duration-500 ${
                active ? 'btn-primary' : 'btn-ghost'
              }`}
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
  const preview = useMemo(
    () => list.find((s) => s.id === hovered) ?? list[0],
    [list, hovered],
  )
  const activeCategory = CATEGORIES.find((c) => c.id === category)!

  return (
    <section id="services" className="relative bg-ivory py-24 sm:py-28 lg:py-36">
      <div className="container-editorial">
        <SectionHeading
          index="01"
          eyebrow="Services"
          lines={['Considered work,', <em key="b" className="italic text-brass">clearly priced.</em>]}
          intro="Every appointment begins with a consultation and ends with a plan for what happens after you leave the chair."
        />

        {/* Category switch */}
        <div className="mt-12 flex flex-wrap items-baseline gap-x-8 gap-y-3" role="tablist" aria-label="Service categories">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={category === c.id}
              onClick={() => {
                setCategory(c.id)
                setHovered(null)
              }}
              className={`relative pb-2 font-sans text-[11px] uppercase tracking-wide2 transition-colors duration-500 ${
                category === c.id ? 'text-charcoal' : 'text-taupe hover:text-charcoal/80'
              }`}
            >
              {c.label}
              {category === c.id && (
                <motion.span
                  layoutId="service-tab"
                  className="absolute inset-x-0 -bottom-px h-px bg-champagne"
                  transition={{ duration: 0.6, ease: EASE_SILK }}
                />
              )}
            </button>
          ))}
          <p className="ml-auto hidden max-w-xs text-[12px] leading-relaxed text-taupe lg:block">
            {activeCategory.intro}
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          {/* List */}
          <div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.ul
                key={category}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: EASE_SILK }}
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
            <div className="mt-8 overflow-hidden bg-sand lg:hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={preview.id}
                  src={preview.image}
                  alt={preview.name}
                  loading="lazy"
                  decoding="async"
                  className="h-56 w-full object-cover sm:h-72"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE_SILK }}
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Sticky preview */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden bg-sand" aria-hidden>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={preview.id}
                    src={preview.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.9, ease: EASE_SILK }}
                  />
                </AnimatePresence>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-6 pt-16">
                  <p className="font-sans text-[10px] uppercase tracking-label text-ivory/60">
                    {activeCategory.title}
                  </p>
                  <p className="mt-1 font-display text-2xl text-ivory">{preview.name}</p>
                </div>
              </div>

              <div className="mt-5 flex items-baseline justify-between border-t border-charcoal/10 pt-4 font-sans text-[11px] uppercase tracking-wide2 text-taupe">
                <span>{list.length} services</span>
                <span>All prices in {SITE.address.country === 'India' ? 'INR' : 'INR'}</span>
              </div>

              <button
                type="button"
                onClick={() => openBooking()}
                data-cursor="hover"
                className="btn btn-ghost mt-6 w-full"
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
