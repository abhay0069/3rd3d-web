import { SITE } from '../../data/salon'
import { BookingFlow } from '../booking/BookingFlow'
import { SectionHeading } from '../ui/Bits'
import { Reveal } from '../ui/Reveal'

export function BookingSection() {
  return (
    <section id="book" className="royal-final-booking relative z-10 overflow-hidden pb-24 pt-24 text-ivory sm:pb-28 sm:pt-28 lg:pb-36 lg:pt-36">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-12 h-[72vw] max-h-[860px] w-[72vw] max-w-[860px] -translate-x-1/2 rounded-full border border-champagne/10" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-12 h-[56vw] max-h-[670px] w-[56vw] max-w-[670px] -translate-x-1/2 rounded-full border border-champagne/10" />

      <div className="container-editorial relative">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading
            index="11"
            eyebrow="The invitation"
            align="center"
            tone="light"
            lines={['YOUR EXPERIENCE', <em key="b" className="italic text-champagne">AWAITS.</em>]}
            intro="The doors are open. Tell us what you have in mind; a real person from the studio will confirm your appointment and every detail before your visit."
          />
          <Reveal delay={0.25}>
            <p className="mt-8 font-sans text-[9px] uppercase tracking-[0.28em] text-champagne/72">
              {SITE.name} <span className="mx-3">✳</span> Bandra West, Mumbai
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[1.55fr_0.8fr] lg:gap-16">
          <div className="royal-booking-panel p-5 sm:p-8 lg:p-10">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-champagne/20 pb-5">
              <div>
                <p className="font-sans text-[9px] uppercase tracking-[0.26em] text-champagne/78">A private appointment</p>
                <h3 className="mt-2 font-display text-3xl text-ivory sm:text-4xl">Begin with a conversation.</h3>
              </div>
              <p className="max-w-[200px] text-[11px] leading-relaxed text-ivory/48">
                Five quiet steps. No account, no deposit, no surprises.
              </p>
            </div>
            <BookingFlow variant="inline" />
          </div>

          <aside className="flex flex-col justify-between gap-9">
            <div className="relative aspect-[5/4] overflow-hidden border border-champagne/30 bg-[#17100D]">
              <img
                src="/img/salon-color-studio.jpg"
                alt="Amber glass, brass bowls and folded towels in the LUMIÈRE colour studio"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover opacity-82"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080605]/80 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-5 font-sans text-[9px] uppercase tracking-[0.26em] text-ivory/80">
                The colour atelier
              </p>
            </div>

            <div className="space-y-7 border-t border-champagne/20 pt-6">
              <div>
                <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-champagne/72">Come find us</p>
                <p className="mt-2 text-[13px] leading-relaxed text-ivory/78">
                  {SITE.address.line1}<br />{SITE.address.line2}
                </p>
              </div>

              <div>
                <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-champagne/72">The house is open</p>
                <dl className="mt-2 space-y-1.5">
                  {SITE.hours.map((hours) => (
                    <div key={hours.days} className="flex justify-between gap-4 text-[12px]">
                      <dt className="text-ivory/50">{hours.days}</dt>
                      <dd className="text-ivory/84">{hours.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-champagne/72">A human, always</p>
                <a href={SITE.phoneHref} className="link-underline mt-2 inline-block font-display text-2xl text-ivory">
                  {SITE.phone}
                </a>
                <p className="mt-1.5 text-[11px] text-ivory/50">{SITE.email}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
