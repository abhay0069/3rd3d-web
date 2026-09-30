import { Suspense, lazy, useState } from 'react'
import { motion } from 'framer-motion'
import { PRODUCTS, formatPrice } from '../../data/salon'
import type { DeviceTier } from '../../hooks/useResponsive'
import { useInView } from '../../hooks/useResponsive'
import { useBooking } from '../../store/booking'
import { hasWebGL } from '../../lib/webgl'
import { CanvasBoundary } from '../ui/CanvasBoundary'
import { EASE_SILK } from '../../lib/motion'
import { SectionHeading } from '../ui/Bits'
import { Reveal } from '../ui/Reveal'

const ProductStage = lazy(() => import('../../three/ProductStage'))

/**
 * Four products we actually use in the chair, presented as objects you can turn
 * in your hand — not a catalogue. Nothing here is for sale online.
 */
export function Products({ tier }: { tier: DeviceTier }) {
  const [index, setIndex] = useState(0)
  const [webgl, setWebgl] = useState(() => hasWebGL())
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 })
  const openBooking = useBooking((s) => s.open)
  const product = PRODUCTS[index]

  return (
    <section id="products" className="relative bg-ivory py-24 sm:py-28 lg:py-36">
      <div className="container-editorial">
        <SectionHeading
          index="06"
          eyebrow="The Shelf"
          lines={['What we use', <em key="b" className="italic text-brass">in the chair.</em>]}
          intro="A short list, chosen for how it performs on Indian hair and humidity. Turn one over — literally."
        />

        <div ref={ref} className="mt-14 grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          {/* Stage */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-sand/70 via-porcelain to-ivory sm:aspect-[4/3] lg:aspect-square">
              {webgl && inView && (
                <CanvasBoundary fallback={null} onError={() => setWebgl(false)}>
                  <Suspense fallback={null}>
                    <ProductStage product={product} tier={tier} />
                  </Suspense>
                </CanvasBoundary>
              )}

              {/* Product name, resting on the plinth */}
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE_SILK }}
                className="pointer-events-none absolute inset-x-0 bottom-0 p-6 text-center"
              >
                <p className="font-display text-2xl text-charcoal">{product.name}</p>
                <p className="mt-1 font-sans text-[10px] uppercase tracking-label text-taupe">
                  {product.volume} · {formatPrice(product.price)}
                </p>
              </motion.div>

              <p className="pointer-events-none absolute left-5 top-5 font-sans text-[10px] uppercase tracking-label text-taupe/70">
                Drag to rotate
              </p>
            </div>
          </div>

          {/* Selector + copy */}
          <div className="order-1 lg:order-2">
            <ul className="border-t border-charcoal/10">
              {PRODUCTS.map((p, i) => {
                const active = i === index
                return (
                  <li key={p.id} className="border-b border-charcoal/10">
                    <button
                      type="button"
                      onMouseEnter={() => setIndex(i)}
                      onFocus={() => setIndex(i)}
                      onClick={() => setIndex(i)}
                      aria-pressed={active}
                      className="group flex w-full items-baseline justify-between gap-6 py-5 text-left"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-sans text-[10px] tracking-label text-taupe">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`font-display text-[1.35rem] transition-all duration-500 ease-silk sm:text-[1.6rem] ${
                            active ? 'text-charcoal' : 'text-charcoal/45 group-hover:text-charcoal/80'
                          }`}
                        >
                          {p.name}
                        </span>
                      </span>
                      <span className="whitespace-nowrap font-sans text-[11px] uppercase tracking-wide2 text-taupe">
                        {p.volume}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_SILK }}
              className="mt-8"
            >
              <p className="font-sans text-[10px] uppercase tracking-label text-champagne">
                {product.notes}
              </p>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-smoke">{product.detail}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => openBooking()}
                  data-cursor="hover"
                  className="btn btn-primary"
                >
                  Book a treatment
                </button>
                <span className="font-sans text-[11px] leading-relaxed text-taupe">
                  Also available to take home from the studio.
                </span>
              </div>
            </motion.div>

            <Reveal delay={0.15}>
              <p className="mt-10 border-t border-charcoal/10 pt-6 text-[12px] leading-relaxed text-taupe">
                We keep the shelf deliberately small: four products, refilled in studio, with no
                labels we would not explain to you at the basin.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
