import { motion } from 'framer-motion'
import { useState } from 'react'
import { sound } from '../../lib/audio'
import { useBooking } from '../../store/booking'
import { useStory } from '../../store/story'

interface Artisan {
  id: string
  name: string
  role: string
  experience: string
  specialty: string
  bio: string
  image: string
  accent: string
}

const ARTISANS: Artisan[] = [
  {
    id: 'arjun',
    name: 'Arjun Sharma',
    role: 'CREATIVE HAIR DIRECTOR',
    experience: '12+ YEARS',
    specialty: 'Precision Dry Cutting · Hand-Painted Balayage',
    bio: 'Trained in London and Milan. Arjun approaches hair as living architecture — sculpted around your facial contours and personal rhythm.',
    image: '/img/expert-1.jpg',
    accent: '#dcb878',
  },
  {
    id: 'meera',
    name: 'Meera Kapoor',
    role: 'BEAUTY & SKIN DIRECTOR',
    experience: '9 YEARS',
    specialty: 'Cellular Hydration · Lymphatic Facial Sculpting',
    bio: 'A clinical aesthetician by background. Meera designs bespoke rituals that restore skin barrier health before introducing radiance.',
    image: '/img/expert-2.jpg',
    accent: '#f2c9b4',
  },
  {
    id: 'anaya',
    name: 'Anaya Iyer',
    role: 'BRIDAL ARTISTRY LEAD',
    experience: '8 YEARS',
    specialty: 'Couture Veil Setting · Luminous Skin Finishes',
    bio: 'Having dressed over two hundred brides across India and abroad, Anaya plans every hair and skin detail backwards from evening flash photography.',
    image: '/img/expert-3.jpg',
    accent: '#fbf0dc',
  },
]

export function Chapter06Artisans() {
  const [activeArtisan, setActiveArtisan] = useState<string>('arjun')
  const setCursor = useStory((s) => s.setCursor)
  const openBooking = useBooking((s) => s.open)

  return (
    <section
      id="artisans"
      className="relative min-h-screen w-full py-28 sm:py-36 lg:py-44"
      onMouseEnter={() => setCursor('explore', 'ARTISANS')}
      onMouseLeave={() => setCursor('default')}
    >
      <div className="container-editorial relative">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-gold/20 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.38em] text-gold">
              CHAPTER 06 · THE ARTISANS
            </p>
            <h2 className="mt-2 font-display text-[clamp(2.4rem,6vw,5.5rem)] font-light leading-tight text-[#f7f3ec]">
              The human presence.
              <span className="block italic text-gold-hi">Three masters. One standard.</span>
            </h2>
          </div>
          <p className="max-w-xs font-sans text-[12px] leading-relaxed text-ivory/50">
            No junior handovers mid-service. The person who begins your hair or skin is the one who
            finishes it.
          </p>
        </div>

        {/* Artisans Gallery */}
        <div className="mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-14">
          {ARTISANS.map((artisan) => {
            const isHovered = activeArtisan === artisan.id
            return (
              <motion.article
                key={artisan.id}
                onMouseEnter={() => {
                  setActiveArtisan(artisan.id)
                  sound.playChime(620)
                }}
                className={`group relative cursor-pointer transition-transform duration-500 ${
                  isHovered ? 'scale-[1.02]' : 'opacity-85'
                }`}
              >
                {/* Arch Portrait Frame */}
                <div className="relative aspect-[3/4.2] w-full overflow-hidden rounded-t-[999px] border border-gold/30 bg-ink p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-700 group-hover:border-gold group-hover:shadow-[0_25px_60px_-10px_rgba(205,170,110,0.3)]">
                  <div className="relative h-full w-full overflow-hidden rounded-t-[999px]">
                    <img
                      src={artisan.image}
                      alt={artisan.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />

                    {/* Floating experience pill */}
                    <div className="absolute right-4 top-6 rounded-full border border-gold/30 bg-ink/75 px-3 py-1 backdrop-blur-md">
                      <span className="font-sans text-[9px] uppercase tracking-[0.24em] text-gold-hi">
                        {artisan.experience}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Artisan Info */}
                <div className="mt-6 text-center">
                  <h3 className="font-display text-[26px] font-light text-ivory group-hover:text-gold-hi">
                    {artisan.name}
                  </h3>
                  <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.28em] text-gold">
                    {artisan.role}
                  </p>
                  <p className="mt-3 font-sans text-[12px] text-ivory/60">
                    {artisan.specialty}
                  </p>
                  <p className="mx-auto mt-3 max-w-xs text-[13px] leading-relaxed text-ivory/40">
                    {artisan.bio}
                  </p>

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick()
                        openBooking({ step: 1 })
                      }}
                      className="btn-gold !px-5 !py-2 !text-[10px]"
                      data-cursor="book"
                    >
                      Book with {artisan.name.split(' ')[0]}
                    </button>
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
