import { EXPERTS } from '../../data/salon'
import { useBooking } from '../../store/booking'
import { SectionHeading } from '../ui/Bits'
import { Reveal, RevealImage } from '../ui/Reveal'

export function Experts() {
  const openBooking = useBooking((s) => s.open)

  return (
    <section id="stylists" className="relative bg-ink py-28 sm:py-32 lg:py-40">
      <div className="container-editorial">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="07"
            eyebrow="Our Experts"
            tone="light"
            lines={['The people', <em key="b">behind the chair.</em>]}
          />
          <Reveal delay={0.2}>
            <p className="max-w-xs text-[13.5px] leading-relaxed text-ivory/55 lg:pb-2">
              Three specialists, one studio. You will always know who is looking after you — and you can ask for
              them by name.
            </p>
          </Reveal>
        </div>

        <ul className="mt-20 grid gap-20 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {EXPERTS.map((expert, i) => (
            <li
              key={expert.id}
              className={`group ${i === 1 ? 'lg:mt-24' : ''} ${i === 2 ? 'sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:mx-0 lg:mt-10 lg:w-auto' : ''}`}
            >
              <article>
                <div className="arch-ring mx-auto w-[80%] sm:w-[84%]">
                  <RevealImage arch delay={i * 0.12} className="arch relative aspect-[3/4.1] overflow-hidden bg-umber">
                    <img
                      src={expert.image}
                      alt={`${expert.name}, ${expert.role} at LUMIÈRE`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-[1400ms] ease-expo group-hover:scale-[1.05]"
                    />

                    {/* Info panel rises on hover — only on devices that can hover, so it never covers a face on touch screens */}
                    <div className="glass-dark absolute inset-x-0 bottom-0 hidden px-5 pb-6 pt-5 text-center text-ivory transition-transform duration-700 ease-expo [@media(hover:hover)]:block [@media(hover:hover)]:translate-y-full [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-hover:translate-y-0">
                      <p className="font-sans text-[10px] uppercase tracking-label text-gold">
                        {expert.experience} experience
                      </p>
                      <p className="mt-2 text-[13px] leading-relaxed text-ivory/80">{expert.bio}</p>
                      <button
                        type="button"
                        onClick={() => openBooking({ step: 1 })}
                        className="mt-4 font-sans text-[11px] uppercase tracking-wide2 text-gold-hi underline-offset-4 hover:underline"
                      >
                        Book with {expert.name.split(' ')[0]}
                      </button>
                    </div>
                  </RevealImage>
                </div>

                <div className="mt-9 text-center">
                  <h3 className="font-display text-[2rem] leading-tight text-ivory">{expert.name}</h3>
                  <p className="mt-2 font-sans text-[10px] uppercase tracking-label text-gold">{expert.role}</p>
                  <p className="mt-3 font-sans text-[12px] leading-relaxed text-ivory/50">{expert.specialty}</p>

                  {/* touch devices: the bio sits below the portrait instead of over it */}
                  <div className="mx-auto mt-5 max-w-[19rem] [@media(hover:hover)]:hidden">
                    <p className="text-[13.5px] leading-relaxed text-ivory/65">{expert.bio}</p>
                    <button
                      type="button"
                      onClick={() => openBooking({ step: 1 })}
                      className="mt-4 font-sans text-[11px] uppercase tracking-wide2 text-gold-hi underline underline-offset-4"
                    >
                      Book with {expert.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <Reveal delay={0.2}>
          <p className="mt-20 text-center font-sans text-[11px] uppercase tracking-wide2 text-ivory/40">
            Every stylist is trained in-studio on colour correction and bond-building
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export function About() {
  return (
    <section id="about" className="relative bg-noir py-28 sm:py-32 lg:py-40">
      <div className="container-editorial">
        <div className="grid gap-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-24">
          <div className="arch-ring mx-auto w-[82%] max-w-[500px] lg:w-full">
            <RevealImage arch className="arch relative aspect-[3/4.2] overflow-hidden bg-umber">
              <img
                src="/img/salon-bridal-suite.jpg"
                alt="The curtained bridal suite at LUMIÈRE, with a chaise, arch mirror and silk curtains"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </RevealImage>
          </div>

          <div>
            <SectionHeading
              index="08"
              eyebrow="About the Studio"
              tone="light"
              lines={['A quiet room,', <em key="b">and a serious standard.</em>]}
              intro="LUMIÈRE was built for people who are tired of being upsold. We keep the music low, the appointments generous and the mirrors honest — daylight-balanced, so what you see here is what you get outside."
            />

            <ul className="mt-12">
              {[
                ['Consultation first', 'Every service begins with ten unhurried minutes and a plan you agree to.'],
                ['One client, one specialist', 'No handovers mid-service. The person who starts your hair finishes it.'],
                ['Prices you hear twice', 'Once when you book, once before we begin. Nothing is added in the chair.'],
              ].map(([title, copy], i) => (
                <Reveal as="li" key={title} delay={0.1 + i * 0.08}>
                  <div className="grid grid-cols-[auto_1fr] items-start gap-x-7 border-t border-ivory/10 py-7">
                    <span className="font-display text-[2.6rem] leading-[0.9] text-gold/80">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-display text-[1.65rem] leading-tight text-ivory">{title}</h3>
                      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-ivory/55">{copy}</p>
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
