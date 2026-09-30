import { motion } from 'framer-motion'
import { EXPERTS } from '../../data/salon'
import { useBooking } from '../../store/booking'
import { SectionHeading } from '../ui/Bits'
import { Reveal } from '../ui/Reveal'

export function Experts() {
  const openBooking = useBooking((s) => s.open)

  return (
    <section id="stylists" className="relative bg-porcelain py-24 sm:py-28 lg:py-36">
      <div className="container-editorial">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="07"
            eyebrow="Our Experts"
            lines={['The people', <em key="b" className="italic text-brass">behind the chair.</em>]}
          />
          <Reveal delay={0.2}>
            <p className="max-w-xs text-[13px] leading-relaxed text-smoke lg:pb-2">
              Three specialists, one studio. You will always know who is looking after you — and you
              can ask for them by name.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {EXPERTS.map((expert, i) => (
            <Reveal as="li" key={expert.id} delay={i * 0.1} className="group">
              <article>
                <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                  <img
                    src={expert.image}
                    alt={`${expert.name}, ${expert.role} at LUMIÈRE`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-silk group-hover:scale-[1.045]"
                  />

                  {/* Info panel rises on hover; on touch devices it simply sits there */}
                  <motion.div
                    className="absolute inset-x-0 bottom-0 glass-dark p-5 text-ivory transition-transform duration-700 ease-silk sm:translate-y-[calc(100%-0px)] sm:group-hover:translate-y-0 sm:group-focus-within:translate-y-0"
                    initial={false}
                  >
                    <p className="font-sans text-[10px] uppercase tracking-label text-champagne">
                      {expert.experience} experience
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-ivory/80">{expert.bio}</p>
                    <button
                      type="button"
                      onClick={() => openBooking({ step: 1 })}
                      className="mt-4 font-sans text-[11px] uppercase tracking-wide2 text-ivory underline-offset-4 hover:underline"
                    >
                      Book with {expert.name.split(' ')[0]}
                    </button>
                  </motion.div>
                </div>

                <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-charcoal/10 pt-4">
                  <div>
                    <h3 className="font-display text-2xl leading-tight text-charcoal">
                      {expert.name}
                    </h3>
                    <p className="mt-1 font-sans text-[10px] uppercase tracking-label text-taupe">
                      {expert.role}
                    </p>
                  </div>
                  <p className="text-right font-sans text-[11px] leading-relaxed text-smoke">
                    {expert.specialty}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.2}>
          <p className="mt-12 text-center font-sans text-[11px] uppercase tracking-wide2 text-taupe">
            Every stylist is trained in-studio on colour correction and bond-building
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export function About() {
  return (
    <section id="about" className="relative bg-ivory py-24 sm:py-28 lg:py-36">
      <div className="container-editorial">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden bg-sand">
              <img
                src="/img/salon-bridal-suite.jpg"
                alt="The curtained bridal suite at LUMIÈRE, with a chaise, arch mirror and silk curtains"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>

          <div>
            <SectionHeading
              index="08"
              eyebrow="About the Studio"
              lines={['A quiet room,', <em key="b" className="italic text-brass">and a serious standard.</em>]}
              intro="LUMIÈRE was built for people who are tired of being upsold. We keep the music low, the appointments generous and the mirrors honest — daylight-balanced, so what you see here is what you get outside."
            />

            <ul className="mt-10 space-y-5">
              {[
                ['Consultation first', 'Every service begins with ten unhurried minutes and a plan you agree to.'],
                ['One client, one specialist', 'No handovers mid-service. The person who starts your hair finishes it.'],
                ['Prices you hear twice', 'Once when you book, once before we begin. Nothing is added in the chair.'],
              ].map(([title, copy], i) => (
                <Reveal as="li" key={title} delay={0.1 + i * 0.08}>
                  <div className="flex gap-5 border-t border-charcoal/10 pt-5">
                    <span className="font-sans text-[10px] tracking-label text-taupe">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-display text-xl text-charcoal">{title}</h3>
                      <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-smoke">{copy}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
