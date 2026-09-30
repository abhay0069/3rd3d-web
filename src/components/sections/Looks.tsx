import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LOOKS, SERVICES, formatPrice } from '../../data/salon'
import { EASE_SILK } from '../../lib/motion'
import { useBooking } from '../../store/booking'
import { Magnetic } from '../ui/Magnetic'
import { Reveal, RevealLines } from '../ui/Reveal'

/**
 * “Choose your look” — a digital consultation rather than a filter.
 * Selecting a look re-tunes the entire section: surface colour, type, imagery,
 * and the services we would recommend to get you there.
 */
export function Looks() {
  const [selectedId, setSelectedId] = useState(LOOKS[0].id)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const openBooking = useBooking((s) => s.open)

  const selected = LOOKS.find((l) => l.id === selectedId)!
  const preview = LOOKS.find((l) => l.id === (previewId ?? selectedId))!
  const recommended = useMemo(
    () => selected.services.map((id) => SERVICES.find((s) => s.id === id)!).filter(Boolean),
    [selected],
  )

  return (
    <section
      id="looks"
      className="relative overflow-hidden py-24 transition-colors duration-1000 ease-silk sm:py-28 lg:py-36"
      style={{ backgroundColor: selected.palette.base, color: selected.palette.text }}
      aria-labelledby="looks-title"
    >
      {/* a very quiet ambient wash derived from the active palette */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        animate={{
          background: `radial-gradient(120% 80% at 78% 30%, ${selected.palette.surface} 0%, transparent 60%)`,
        }}
        transition={{ duration: 1.2, ease: EASE_SILK }}
      />

      <div className="container-editorial relative">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20">
          {/* ── Left: the consultation ─────────────────────────────────── */}
          <div>
            <Reveal y={12}>
              <div className="flex items-center gap-4 opacity-70">
                <span className="font-sans text-[10px] tracking-label">02</span>
                <span className="eyebrow !text-current">Choose your look</span>
              </div>
            </Reveal>

            <h2
              id="looks-title"
              className="display-lg mt-5"
              style={{ letterSpacing: selected.typeStyle.tracking }}
            >
              <RevealLines lines={['Four ways', 'to wear it.']} />
            </h2>

            <ul className="mt-10 space-y-1">
              {LOOKS.map((look) => {
                const isSelected = look.id === selectedId
                return (
                  <li key={look.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(look.id)}
                      onMouseEnter={() => setPreviewId(look.id)}
                      onMouseLeave={() => setPreviewId(null)}
                      onFocus={() => setPreviewId(look.id)}
                      onBlur={() => setPreviewId(null)}
                      aria-pressed={isSelected}
                      className="group relative block w-full py-2 text-left"
                    >
                      <span className="flex items-baseline gap-4">
                        <span
                          aria-hidden
                          className="h-px transition-all duration-700 ease-silk"
                          style={{
                            width: isSelected ? 40 : 0,
                            backgroundColor: selected.palette.accent,
                          }}
                        />
                        <span
                          className={`font-display text-[8vw] leading-[1.06] transition-all duration-700 ease-silk sm:text-[2.6rem] ${
                            isSelected ? 'opacity-100' : 'opacity-35 group-hover:opacity-70'
                          } ${look.typeStyle.italic && isSelected ? 'italic' : ''}`}
                          style={{
                            letterSpacing: isSelected ? look.typeStyle.tracking : '0.01em',
                          }}
                        >
                          {look.name}
                        </span>
                      </span>
                      <span className="mt-1 block pl-[3.4rem] font-sans text-[10px] uppercase tracking-label opacity-50">
                        {look.subtitle}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_SILK }}
              className="mt-10 max-w-lg border-t pt-7"
              style={{ borderColor: `${selected.palette.text}22` }}
            >
              <p className="text-[15px] leading-relaxed opacity-80">{selected.description}</p>

              <div className="mt-6">
                <p className="font-sans text-[10px] uppercase tracking-label opacity-50">
                  Recommended for this look
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {recommended.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => openBooking({ service: s })}
                        className="rounded-full border px-4 py-2 font-sans text-[11px] tracking-wide2 transition-colors duration-500 hover:border-current"
                        style={{ borderColor: `${selected.palette.text}26` }}
                      >
                        {s.name} · {formatPrice(s.price)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <Magnetic strength={0.16}>
                <button
                  type="button"
                  onClick={() => openBooking({ service: recommended[0] })}
                  data-cursor="hover"
                  className="btn mt-8 border"
                  style={{
                    backgroundColor: selected.palette.text,
                    color: selected.palette.base,
                    borderColor: selected.palette.text,
                  }}
                >
                  Book this look
                </button>
              </Magnetic>
            </motion.div>
          </div>

          {/* ── Right: the portrait ───────────────────────────────────── */}
          <div className="relative">
            <div className="relative aspect-[3/4] overflow-hidden bg-black/5 sm:aspect-[4/5]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={preview.id}
                  src={preview.image}
                  alt={`${preview.name} — ${preview.subtitle}`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.07 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 1, ease: EASE_SILK }}
                />
              </AnimatePresence>

              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${selected.palette.base} 0%, transparent 34%)`,
                }}
              />
            </div>

            <div className="absolute -left-2 bottom-6 hidden sm:block lg:-left-8">
              <motion.p
                key={preview.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE_SILK }}
                className="font-display text-3xl italic sm:text-4xl"
                style={{ color: selected.palette.text }}
              >
                {preview.name}
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
