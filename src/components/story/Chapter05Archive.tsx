import { motion } from 'framer-motion'
import { useRef } from 'react'
import { sound } from '../../lib/audio'
import { useStory, type ModalImage } from '../../store/story'

const ARCHIVE_ITEMS: (ModalImage & {
  id: string
  year: string
  aspect: string
  depth: number
  rotate: number
  colSpan?: string
})[] = [
  {
    id: 'classic',
    src: '/img/look-classic.jpg',
    title: 'The Classic',
    subtitle: 'TIMELESS · POLISHED CHIGNON & BLOWOUT',
    year: 'LOOK 01',
    aspect: 'aspect-[3/4.2]',
    depth: 40,
    rotate: -1.5,
  },
  {
    id: 'interior',
    src: '/img/salon-interior-wide.jpg',
    title: 'The Styling Floor',
    subtitle: 'TRAVERTINE, BOUCLE & ARCHITECTURAL DAYLIGHT',
    year: 'ATELIER',
    aspect: 'aspect-[16/10]',
    depth: -30,
    rotate: 1.2,
  },
  {
    id: 'modern',
    src: '/img/look-modern.jpg',
    title: 'The Modern',
    subtitle: 'ARCHITECTURAL BLUNT BOB & GLASS LUSTER',
    year: 'LOOK 02',
    aspect: 'aspect-[3/4.2]',
    depth: 60,
    rotate: 2.0,
  },
  {
    id: 'bold',
    src: '/img/look-bold.jpg',
    title: 'The Bold',
    subtitle: 'DRAMATIC VOLUME & WARM COPPER BALAYAGE',
    year: 'LOOK 03',
    aspect: 'aspect-[3/4.4]',
    depth: -20,
    rotate: -1.8,
  },
  {
    id: 'colour',
    src: '/img/salon-color-studio.jpg',
    title: 'The Colour Lab',
    subtitle: 'AMMONIA-FREE BESPOKE TONERS & GLASS BOTTLES',
    year: 'ALCHEMY',
    aspect: 'aspect-[16/11]',
    depth: 50,
    rotate: 1.5,
  },
  {
    id: 'natural',
    src: '/img/look-natural.jpg',
    title: 'The Natural',
    subtitle: 'AIR-DRIED TEXTURE & LIT-FROM-WITHIN RADIANCE',
    year: 'LOOK 04',
    aspect: 'aspect-[4/5]',
    depth: 30,
    rotate: -1.0,
  },
]

export function Chapter05Archive() {
  const containerRef = useRef<HTMLDivElement>(null)
  const setCursor = useStory((s) => s.setCursor)
  const openModal = useStory((s) => s.openModalImage)

  return (
    <section
      id="archive"
      ref={containerRef}
      className="relative min-h-screen w-full py-28 sm:py-36 lg:py-44"
      onMouseEnter={() => setCursor('view', 'VIEW')}
      onMouseLeave={() => setCursor('default')}
    >
      <div className="container-editorial relative">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-gold/20 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.38em] text-gold">
              CHAPTER 05 · THE ARCHIVE
            </p>
            <h2 className="mt-2 font-display text-[clamp(2.4rem,6vw,5.5rem)] font-light leading-tight text-[#f7f3ec]">
              Curated expressions.
              <span className="block italic text-gold-hi">A spatial visual archive.</span>
            </h2>
          </div>
          <p className="max-w-xs font-sans text-[12px] leading-relaxed text-ivory/50">
            Click any work to enter the cinematic spotlight. Explore four looks and the studio's
            architecture.
          </p>
        </div>

        {/* Spatial Floating Gallery */}
        <div className="mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-14">
          {ARCHIVE_ITEMS.map((item, index) => {
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.0, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => {
                  sound.playTransition(659.25)
                  openModal(item)
                }}
                className="group relative cursor-pointer"
                style={{
                  transform: `rotate(${item.rotate}deg)`,
                }}
              >
                {/* Floating Image Card */}
                <div
                  className={`relative ${item.aspect} w-full overflow-hidden rounded-2xl border border-gold/30 bg-ink p-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] transition-all duration-700 group-hover:scale-[1.03] group-hover:border-gold group-hover:shadow-[0_25px_60px_-10px_rgba(205,170,110,0.35)]`}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-xl">
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-40" />

                    {/* Metadata pill */}
                    <div className="absolute left-4 top-4 rounded-full border border-ivory/20 bg-ink/70 px-3 py-1 backdrop-blur-md">
                      <span className="font-sans text-[9px] uppercase tracking-[0.24em] text-gold">
                        {item.year}
                      </span>
                    </div>

                    {/* Title caption overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-display text-[22px] font-light text-ivory group-hover:text-gold-hi">
                        {item.title}
                      </h3>
                      <p className="mt-1 font-sans text-[10px] uppercase tracking-wide2 text-ivory/60">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
