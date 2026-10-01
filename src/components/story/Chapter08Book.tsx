import { motion } from 'framer-motion'
import { SITE } from '../../data/salon'
import { sound } from '../../lib/audio'
import { BookingFlow } from '../booking/BookingFlow'
import { useStory } from '../../store/story'

export function Chapter08Book() {
  const setCursor = useStory((s) => s.setCursor)

  return (
    <section
      id="book"
      className="relative min-h-screen w-full bg-transparent py-28 sm:py-36 lg:py-44"
      onMouseEnter={() => {
        setCursor('book', 'BOOK')
      }}
      onMouseLeave={() => setCursor('default')}
    >
      <div className="container-editorial relative">
        {/* Story Climax & Resolution Header */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans text-[10px] uppercase tracking-[0.4em] text-gold"
          >
            CHAPTER 08 · THE ARRIVAL
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.1 }}
            className="mt-6 font-display text-[clamp(2.8rem,7vw,7.5rem)] font-light leading-[0.94] tracking-tight text-[#f7f3ec]"
          >
            READY?
            <span className="gold-foil block font-normal italic">
              LET’S CREATE YOUR NEXT LOOK.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.25 }}
            className="mx-auto mt-6 max-w-xl text-[14.5px] leading-relaxed text-ivory/60"
          >
            Five quick steps — ritual, artisan, date, time, confirm. No deposit, no account, and an
            artisan confirms every appointment in person.
          </motion.p>
        </div>

        {/* Integrated Story Booking Portal */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          {/* Booking Flow Widget */}
          <div className="rounded-3xl border border-gold/30 bg-[#f7f3ec] p-6 text-charcoal shadow-[0_25px_80px_-20px_rgba(205,170,110,0.35)] sm:p-10">
            <BookingFlow variant="inline" />
          </div>

          {/* Studio Coordinates & Atelier Facts */}
          <div className="flex flex-col justify-between space-y-8 rounded-3xl border border-ivory/15 bg-ink/80 p-8 backdrop-blur-xl sm:p-10">
            <div className="space-y-6">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold">
                STUDIO COORDINATES
              </span>

              <div>
                <p className="font-sans text-[10px] uppercase tracking-label text-ivory/40">
                  Location
                </p>
                <p className="mt-1 text-[15px] leading-relaxed text-ivory">
                  {SITE.address.line1}
                  <br />
                  {SITE.address.line2}
                </p>
              </div>

              <div>
                <p className="font-sans text-[10px] uppercase tracking-label text-ivory/40">
                  Direct Line & Inquiries
                </p>
                <a
                  href={SITE.phoneHref}
                  onClick={() => sound.playClick()}
                  className="link-underline mt-1 inline-block font-display text-[26px] text-gold-hi"
                >
                  {SITE.phone}
                </a>
                <p className="mt-1 text-[12px] text-ivory/50">{SITE.email}</p>
              </div>

              <div>
                <p className="font-sans text-[10px] uppercase tracking-label text-ivory/40">
                  Opening Hours
                </p>
                <dl className="mt-2 space-y-2 text-[13px]">
                  {SITE.hours.map((h) => (
                    <div key={h.days} className="flex justify-between border-b border-ivory/10 pb-1.5">
                      <dt className="text-ivory/60">{h.days}</dt>
                      <dd className="font-medium text-ivory">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="border-t border-ivory/10 pt-6">
              <p className="text-[12px] text-ivory/40">
                All appointments include a private consultation, daylight analysis, and botanical
                refreshments.
              </p>
            </div>
          </div>
        </div>

        {/* Final Watermark & Credits */}
        <div className="mt-32 border-t border-gold/15 pt-12 text-center">
          <p className="gold-foil select-none font-display text-[18vw] font-medium leading-[0.8] tracking-[0.08em] opacity-15">
            LUMIÈRE
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 font-sans text-[11px] text-ivory/40">
            <span>© {new Date().getFullYear()} LUMIÈRE SALON ATELIER. ALL RIGHTS RESERVED.</span>
            <span>BANDRA WEST · MUMBAI · DIGITAL ART EXPERIENCE</span>
          </div>
        </div>
      </div>
    </section>
  )
}
