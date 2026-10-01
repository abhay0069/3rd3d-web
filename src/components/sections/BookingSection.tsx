import { SITE } from '../../data/salon'
import { BookingFlow } from '../booking/BookingFlow'
import { SectionHeading } from '../ui/Bits'
import { Reveal } from '../ui/Reveal'

export function BookingSection() {
  return (
    <section id="book" className="relative bg-ivory pb-28 pt-28 text-charcoal sm:pb-32 sm:pt-32 lg:pb-40 lg:pt-40">
      <div className="container-editorial">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="10"
            eyebrow="Booking"
            lines={['Your next look', <em key="b" className="italic text-brass">starts here.</em>]}
          />
          <Reveal delay={0.15}>
            <p className="max-w-sm text-[13px] leading-relaxed text-smoke lg:pb-2">
              Five quick steps — service, artist, date, time, confirm. No account, no deposit, and a
              real person confirms every appointment.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          {/* Inline flow */}
          <div className="border border-charcoal/10 bg-porcelain p-6 sm:p-9">
            <BookingFlow variant="inline" />
          </div>

          {/* Studio card */}
          <aside className="flex flex-col gap-8">
            <div className="relative aspect-[5/4] overflow-hidden bg-sand lg:aspect-[4/3]">
              <img
                src="/img/salon-color-studio.jpg"
                alt="Colour mixing at the LUMIÈRE studio: amber glass bottles, brass bowls and folded towels on travertine"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-label text-taupe">Visit</p>
                <p className="mt-2 text-[14px] leading-relaxed text-charcoal">
                  {SITE.address.line1}
                  <br />
                  {SITE.address.line2}
                </p>
              </div>

              <div>
                <p className="font-sans text-[10px] uppercase tracking-label text-taupe">Hours</p>
                <dl className="mt-2 space-y-1.5">
                  {SITE.hours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-4 text-[13px]">
                      <dt className="text-smoke">{h.days}</dt>
                      <dd className="text-charcoal">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <p className="font-sans text-[10px] uppercase tracking-label text-taupe">
                  Rather talk to us?
                </p>
                <a href={SITE.phoneHref} className="link-underline mt-2 inline-block font-display text-2xl">
                  {SITE.phone}
                </a>
                <p className="mt-2 text-[12px] text-taupe">{SITE.email}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
