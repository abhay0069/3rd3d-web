import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { sound } from '../../lib/audio'
import { useBooking } from '../../store/booking'
import { useStory, type Mood } from '../../store/story'

interface Discipline {
  id: string
  num: string
  name: string
  mood: Mood
  subtitle: string
  image: string
  description: string
  rituals: { name: string; duration: string; price: string; note: string }[]
}

const DISCIPLINES: Discipline[] = [
  {
    id: 'hair',
    num: '01',
    name: 'HAIR',
    mood: 'hair',
    subtitle: 'ARCHITECTURE & WEIGHTLESS TEXTURE',
    image: '/img/service-hair.jpg',
    description:
      'Dry-cut consultation sculpted to your bone structure, followed by signature wash and blow-sculpting.',
    rituals: [
      { name: 'Precision Haircut & Sculpt', duration: '60 min', price: '₹1,800', note: 'Dry & wet cutting, custom finish' },
      { name: 'Signature Glass Blowout', duration: '45 min', price: '₹1,500', note: 'Heat-shield infused, ultra-gloss' },
      { name: 'Keratin Bond Rebuild', duration: '75 min', price: '₹3,200', note: 'Intensive cellular repair' },
    ],
  },
  {
    id: 'color',
    num: '02',
    name: 'COLOR',
    mood: 'color',
    subtitle: 'AMMONIA-FREE GLOSS & HAND-PAINTED LIGHT',
    image: '/img/salon-color-studio.jpg',
    description:
      'Crafted in our dedicated daylight colour lab. Formulated to flatter your individual skin undertone.',
    rituals: [
      { name: 'Hand-Painted Balayage', duration: '150 min', price: '₹6,500', note: 'Freehand dimensional light' },
      { name: 'Lumière Global Gloss', duration: '120 min', price: '₹4,500', note: 'Ammonia-free radiant coverage' },
      { name: 'Face-Framing Micro Highlights', duration: '90 min', price: '₹3,800', note: 'Soft natural perimeter sun' },
    ],
  },
  {
    id: 'skin',
    num: '03',
    name: 'SKIN',
    mood: 'skin',
    subtitle: 'CELLULAR HYDRATION & SCULPTING',
    image: '/img/service-beauty.jpg',
    description:
      'Facial rituals performed in private acoustic suites. Gentle lymphatic drainage with botanical actives.',
    rituals: [
      { name: 'Cellular Hydration Infusion', duration: '75 min', price: '₹3,400', note: 'Deep moisture, barrier restoration' },
      { name: 'Lifting Lymphatic Facial', duration: '60 min', price: '₹2,900', note: 'Contour sculpting & glow' },
      { name: 'Enzyme Radiance Peel', duration: '45 min', price: '₹2,400', note: 'Unclogs and illuminates' },
    ],
  },
  {
    id: 'makeup',
    num: '04',
    name: 'MAKEUP',
    mood: 'makeup',
    subtitle: 'COUTURE CONTOUR & LIT-FROM-WITHIN',
    image: '/img/look-bold.jpg',
    description:
      'Editorial skin finish with weightless coverage. Tested under daylight, camera flash, and evening warmth.',
    rituals: [
      { name: 'Editorial Event Artistry', duration: '60 min', price: '₹3,800', note: 'Full signature evening look' },
      { name: 'Luminous Bare Skin Makeup', duration: '45 min', price: '₹2,600', note: 'Camera-ready effortless polish' },
      { name: 'Bespoke Lash & Brow Architecture', duration: '40 min', price: '₹1,900', note: 'Micro-sculpting and tint' },
    ],
  },
  {
    id: 'bridal',
    num: '05',
    name: 'BRIDAL',
    mood: 'bridal',
    subtitle: 'THE PRIVATE SUITE & COMPLETE ATELIER',
    image: '/img/salon-bridal-suite.jpg',
    description:
      'A private sanctuary reserved entirely for you. Trial consultations, veil draping, and calming rituals.',
    rituals: [
      { name: 'The Wedding Day Atelier', duration: '240 min', price: '₹18,000', note: 'Hair, makeup, veil & private suite' },
      { name: 'Complete Pre-Bridal Ritual', duration: '180 min', price: '₹9,500', note: 'Skin reset, gloss & hand ritual' },
      { name: 'Bridal Consultation & Trial', duration: '90 min', price: '₹4,500', note: 'Two trial looks with daylight check' },
    ],
  },
]

export function Chapter03Explore() {
  const [activeId, setActiveId] = useState<string>('hair')
  const setMood = useStory((s) => s.setMood)
  const setCursor = useStory((s) => s.setCursor)
  const openBooking = useBooking((s) => s.open)

  const activeDiscipline = DISCIPLINES.find((d) => d.id === activeId) || DISCIPLINES[0]

  const handleSelect = (d: Discipline) => {
    setActiveId(d.id)
    setMood(d.mood)
    sound.playChime(587.33 + DISCIPLINES.indexOf(d) * 50)
  }

  return (
    <section
      id="explore"
      className="relative min-h-screen w-full py-28 sm:py-36 lg:py-44"
      onMouseEnter={() => setCursor('explore', 'SPECTRUM')}
      onMouseLeave={() => {
        setCursor('default')
        setMood('noir')
      }}
    >
      <div className="container-editorial relative">
        {/* Chapter Header */}
        <div className="flex flex-col gap-4 border-b border-gold/20 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.38em] text-gold">
              CHAPTER 03 · THE SPECTRUM
            </p>
            <h2 className="mt-2 font-display text-[clamp(2.2rem,5vw,4.5rem)] font-light leading-tight text-[#f7f3ec]">
              Interaction is the content.
              <span className="block italic text-gold-hi">Hover to transform the realm.</span>
            </h2>
          </div>
          <p className="max-w-xs font-sans text-[12px] leading-relaxed text-ivory/50">
            Each discipline possesses its own color temperature, lighting, and rituals. Select to
            enter.
          </p>
        </div>

        {/* Main Interactive Stage */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          {/* Left: Giant Typographic Disciplines */}
          <div className="space-y-4">
            {DISCIPLINES.map((d) => {
              const isActive = d.id === activeId
              return (
                <div
                  key={d.id}
                  onMouseEnter={() => handleSelect(d)}
                  onClick={() => handleSelect(d)}
                  className={`group relative cursor-pointer border-b border-ivory/10 pb-6 pt-4 transition-all duration-700 ${
                    isActive ? 'border-gold/60' : 'hover:border-ivory/30'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex items-baseline gap-6 sm:gap-10">
                      <span
                        className={`font-sans text-[12px] tracking-[0.28em] transition-colors duration-500 ${
                          isActive ? 'text-gold' : 'text-ivory/30 group-hover:text-gold/70'
                        }`}
                      >
                        {d.num}
                      </span>
                      <h3
                        className={`font-display text-[10vw] font-light leading-[0.92] tracking-tight transition-all duration-700 sm:text-[4.8rem] lg:text-[5.4rem] ${
                          isActive
                            ? 'translate-x-3 text-gold-hi italic'
                            : 'text-ivory/40 group-hover:translate-x-2 group-hover:text-ivory'
                        }`}
                      >
                        {d.name}
                      </h3>
                    </div>
                    <span
                      className={`hidden font-sans text-[10px] uppercase tracking-[0.24em] transition-opacity duration-500 sm:block ${
                        isActive ? 'text-gold opacity-100' : 'opacity-0'
                      }`}
                    >
                      ACTIVE REALM
                    </span>
                  </div>

                  {/* Subtitle / micro text */}
                  <div className="mt-2 pl-12 sm:pl-16">
                    <p
                      className={`font-sans text-[11px] uppercase tracking-wide2 transition-colors duration-500 ${
                        isActive ? 'text-ivory/70' : 'text-ivory/20'
                      }`}
                    >
                      {d.subtitle}
                    </p>
                  </div>

                  {/* Mobile ritual listing directly under the active item */}
                  <div className="mt-6 pl-12 lg:hidden">
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 pt-4"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-gold/30">
                          <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
                        </div>
                        <ul className="space-y-3">
                          {d.rituals.map((r) => (
                            <li
                              key={r.name}
                              className="flex items-center justify-between rounded-lg bg-ink/70 p-3"
                            >
                              <div>
                                <p className="font-display text-[16px] text-ivory">{r.name}</p>
                                <p className="font-sans text-[11px] text-ivory/50">
                                  {r.duration} · {r.note}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  sound.playClick()
                                  openBooking()
                                }}
                                className="btn-gold !px-3 !py-1.5 !text-[10px]"
                              >
                                {r.price}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right: Floating Living Portal & Rituals (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-28 space-y-8">
              {/* Floating Image with dynamic transition */}
              <div className="relative aspect-[4/4.5] overflow-hidden rounded-2xl border border-gold/40 p-2 shadow-[0_20px_60px_-15px_rgba(205,170,110,0.3)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDiscipline.id}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative h-full w-full overflow-hidden rounded-xl"
                  >
                    <img
                      src={activeDiscipline.image}
                      alt={activeDiscipline.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-gold">
                        {activeDiscipline.subtitle}
                      </span>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-ivory/80">
                        {activeDiscipline.description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Rituals selection panel */}
              <div className="rounded-2xl border border-ivory/15 bg-ink/75 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-ivory/10 pb-4">
                  <span className="font-sans text-[10px] uppercase tracking-wide2 text-gold">
                    AVAILABLE RITUALS
                  </span>
                  <span className="font-sans text-[10px] text-ivory/40">DAYLIGHT CHECKED</span>
                </div>

                <ul className="mt-4 divide-y divide-ivory/10">
                  {activeDiscipline.rituals.map((ritual) => (
                    <li
                      key={ritual.name}
                      className="group flex items-center justify-between py-3.5 transition-colors hover:text-gold"
                    >
                      <div>
                        <p className="font-display text-[17px] text-ivory group-hover:text-gold-hi">
                          {ritual.name}
                        </p>
                        <p className="font-sans text-[11px] text-ivory/50">
                          {ritual.duration} · {ritual.note}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-sans text-[12px] font-medium text-gold">
                          {ritual.price}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick()
                            openBooking()
                          }}
                          className="btn-gold !px-4 !py-1.5 !text-[10px]"
                          data-cursor="book"
                        >
                          Book
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
