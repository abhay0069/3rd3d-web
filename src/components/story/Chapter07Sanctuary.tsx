import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { sound } from '../../lib/audio'
import { useStory } from '../../store/story'

const SANCTUARY_SPACES = [
  {
    id: 'floor',
    title: 'The Styling Floor',
    subtitle: '10 BESPOKE STYLING STATIONS · NATURAL LIGHTING',
    image: '/img/salon-interior-wide.jpg',
    description:
      'Travertine consoles, custom boucle chairs and daylight-balanced mirrors ensure your colour and cut look as true inside the studio as they do under Mumbai afternoon sun.',
    specs: ['Daylight-balanced 5500K lamps', 'Ergonomic Japanese basins', 'Acoustically softened ceiling'],
  },
  {
    id: 'colour',
    title: 'The Colour Studio',
    subtitle: 'CUSTOM AMMONIA-FREE MIXOLOGY · AMBER GLASS',
    image: '/img/salon-color-studio.jpg',
    description:
      'A dedicated space for bespoke formulation. Every bowl is measured to the gram and catalogued in your personal client formulation logbook.',
    specs: ['Over 200 ammonia-free tones', 'Organic bond-multiplying elixirs', 'Client formulation archive'],
  },
  {
    id: 'bridal',
    title: 'The Bridal Suite',
    subtitle: 'PRIVATE DRESSING SANCTUARY · SECLUDED ENTRANCE',
    image: '/img/salon-bridal-suite.jpg',
    description:
      'A completely private suite for brides and bridal parties with full-length arch mirrors, silk curtains, and a private wash basin.',
    specs: ['Private lockable door', 'Dedicated lounge & tea station', 'Steam-ironing & veil rigging hooks'],
  },
]

const TESTIMONIALS = [
  {
    quote:
      'The attention to detail is remarkable. They checked my balayage twice under natural light before letting me leave.',
    name: 'Ritika Menon',
    detail: 'BALAYAGE & CUT · 4 YEARS GUEST',
  },
  {
    quote:
      'An unhurried sanctuary in the middle of Bandra. You never feel like you are on an assembly line.',
    name: 'Sana Qureshi',
    detail: 'CELLULAR SKIN RITUAL',
  },
  {
    quote:
      'Arjun understands how hair moves naturally. Best cut I have ever had in Mumbai or London.',
    name: 'Farah D’Souza',
    detail: 'PRECISION HAIRCUT',
  },
]

export function Chapter07Sanctuary() {
  const [activeSpace, setActiveSpace] = useState('floor')
  const [activeReview, setActiveReview] = useState(0)
  const setCursor = useStory((s) => s.setCursor)

  const currentSpace = SANCTUARY_SPACES.find((s) => s.id === activeSpace) || SANCTUARY_SPACES[0]

  return (
    <section
      id="sanctuary"
      className="relative min-h-screen w-full py-28 sm:py-36 lg:py-44"
      onMouseEnter={() => setCursor('explore', 'SANCTUARY')}
      onMouseLeave={() => setCursor('default')}
    >
      <div className="container-editorial relative">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-gold/20 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.38em] text-gold">
              CHAPTER 07 · THE SANCTUARY
            </p>
            <h2 className="mt-2 font-display text-[clamp(2.4rem,6vw,5.5rem)] font-light leading-tight text-[#f7f3ec]">
              The physical atelier.
              <span className="block italic text-gold-hi">14 Turner Road, Bandra West.</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 text-gold">
            <span className="font-sans text-[11px] uppercase tracking-[0.22em]">
              4.9 RATING · 412 VERIFIED REVIEWS
            </span>
          </div>
        </div>

        {/* Space Selector Tabs */}
        <div className="mt-12 flex flex-wrap gap-4 border-b border-ivory/10 pb-6">
          {SANCTUARY_SPACES.map((space) => {
            const on = activeSpace === space.id
            return (
              <button
                key={space.id}
                type="button"
                onClick={() => {
                  setActiveSpace(space.id)
                  sound.playChime(680)
                }}
                className={`rounded-full border px-5 py-2.5 font-sans text-[11px] uppercase tracking-wide2 transition-all duration-500 ${
                  on
                    ? 'border-gold bg-gold/15 text-gold-hi shadow-[0_0_20px_rgba(205,170,110,0.25)]'
                    : 'border-ivory/20 text-ivory/50 hover:border-ivory/50 hover:text-ivory'
                }`}
              >
                {space.title}
              </button>
            )
          })}
        </div>

        {/* Space Showcase Stage */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          {/* Left: Architectural Space Image with smooth transition */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-gold/30 p-2 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSpace.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-full w-full overflow-hidden rounded-xl"
              >
                <img
                  src={currentSpace.image}
                  alt={currentSpace.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-gold">
                    {currentSpace.subtitle}
                  </span>
                  <p className="mt-2 text-[14px] leading-relaxed text-ivory/80">
                    {currentSpace.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Architectural Specs & Words from Guests */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-ivory/15 bg-ink/75 p-6 backdrop-blur-xl">
              <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-gold">
                ATELIER SPECIFICATIONS
              </span>
              <ul className="mt-4 space-y-3">
                {currentSpace.specs.map((spec) => (
                  <li key={spec} className="flex items-center gap-3 text-[13px] text-ivory/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Guest Words Carousel */}
            <div className="rounded-2xl border border-gold/25 bg-ink/75 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-ivory/10 pb-3">
                <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-gold">
                  IN THEIR WORDS
                </span>
                <span className="font-sans text-[11px] text-gold-hi">★★★★★</span>
              </div>
              <p className="mt-4 font-display text-[19px] italic leading-relaxed text-ivory">
                "{TESTIMONIALS[activeReview].quote}"
              </p>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="font-sans text-[12px] font-medium text-gold">
                    {TESTIMONIALS[activeReview].name}
                  </p>
                  <p className="font-sans text-[10px] uppercase tracking-wide2 text-ivory/40">
                    {TESTIMONIALS[activeReview].detail}
                  </p>
                </div>
                <div className="flex gap-2">
                  {TESTIMONIALS.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setActiveReview(i)
                        sound.playClick()
                      }}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        activeReview === i ? 'bg-gold' : 'bg-ivory/20'
                      }`}
                      aria-label={`View testimonial ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
