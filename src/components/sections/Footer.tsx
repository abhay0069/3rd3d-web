import { NAV_LINKS, SITE } from '../../data/salon'
import { useBooking } from '../../store/booking'
import { Reveal } from '../ui/Reveal'
import { Magnetic } from '../ui/Magnetic'

export function Footer() {
  const openBooking = useBooking((s) => s.open)
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-charcoal pb-32 pt-20 text-ivory md:pb-16">
      <div className="container-editorial">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-16">
          <div>
            <Reveal y={16}>
              <p className="font-display text-[clamp(2.6rem,7vw,4.5rem)] leading-[0.95] tracking-[0.18em] text-ivory">
                {SITE.name}
              </p>
              <p className="mt-3 font-sans text-[10px] uppercase tracking-label text-ivory/45">
                {SITE.tagline} · Est. 2013
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-sm text-[14px] leading-relaxed text-ivory/60">
                Hair, beauty and bridal artistry in Bandra West. Consultation-led, daylight-checked,
                and never rushed.
              </p>
            </Reveal>

            <Magnetic strength={0.16}>
              <button type="button" onClick={() => openBooking()} className="btn btn-light mt-9">
                Book appointment
              </button>
            </Magnetic>
          </div>

          <nav aria-label="Footer">
            <p className="font-sans text-[10px] uppercase tracking-label text-ivory/40">Explore</p>
            <ul className="mt-5 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="link-underline font-sans text-[13px] text-ivory/70 transition-colors duration-400 hover:text-ivory"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => openBooking()}
                  className="link-underline font-sans text-[13px] text-ivory/70 transition-colors duration-400 hover:text-ivory"
                >
                  Book online
                </button>
              </li>
            </ul>
          </nav>

          <div>
            <p className="font-sans text-[10px] uppercase tracking-label text-ivory/40">Studio</p>
            <address className="mt-5 space-y-3 not-italic">
              <p className="font-sans text-[13px] leading-relaxed text-ivory/70">
                {SITE.address.line1}
                <br />
                {SITE.address.line2}
                <br />
                {SITE.address.country}
              </p>
              <a
                href={SITE.phoneHref}
                className="link-underline block font-sans text-[13px] text-ivory/70 hover:text-ivory"
              >
                {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="link-underline block font-sans text-[13px] text-ivory/70 hover:text-ivory"
              >
                {SITE.email}
              </a>
            </address>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {SITE.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    rel="noreferrer noopener"
                    target="_blank"
                    className="link-underline font-sans text-[11px] uppercase tracking-wide2 text-ivory/55 hover:text-ivory"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ivory/12 pt-7 font-sans text-[11px] text-ivory/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {SITE.name} Salon &amp; Beauty Studio. All rights reserved.</p>
          <p className="max-w-md sm:text-right">
            Demonstration site: imagery, prices, reviews and figures are placeholder content and
            should be replaced with the studio’s verified details before launch.
          </p>
        </div>
      </div>

      {/* A last, quiet flourish: the wordmark bleeding off the edge */}
      <p
        aria-hidden
        className="pointer-events-none select-none whitespace-nowrap text-center font-display text-[22vw] leading-[0.8] tracking-[0.12em] text-ivory/[0.035]"
      >
        LUMIÈRE
      </p>
    </footer>
  )
}
