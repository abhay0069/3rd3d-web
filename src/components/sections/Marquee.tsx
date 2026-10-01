import { SITE } from '../../data/salon'
import { Counter, Reveal } from '../ui/Reveal'

const WORDS = ['Hair', 'Colour', 'Skin', 'Bridal', 'Consultation-led', 'Daylight-checked']

function Spark() {
  return (
    <svg viewBox="0 0 24 24" className="h-[0.36em] w-[0.36em] shrink-0 text-gold" aria-hidden>
      <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0z" fill="currentColor" />
    </svg>
  )
}

function Track({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-[0.8em] pr-[0.8em]">
      {WORDS.map((word, i) => (
        <li key={word} className="flex items-center gap-[0.8em]">
          <span
            className={
              i % 2
                ? 'text-transparent [-webkit-text-stroke:1px_rgba(205,170,110,0.75)]'
                : 'text-ivory/90'
            }
          >
            {word}
          </span>
          <Spark />
        </li>
      ))}
    </ul>
  )
}

/**
 * Directly under the hero: a slow band of what the studio does, then the
 * credentials as numbers that count up when they arrive.
 */
export function Marquee() {
  const stats = [
    { value: SITE.stats.rating.toFixed(1), label: 'Google rating', note: `${SITE.stats.reviews} reviews` },
    { value: String(SITE.stats.years), label: 'Years in Bandra West', note: 'Est. 2013' },
    { value: SITE.stats.clients, label: 'Clients looked after', note: 'Since opening' },
    { value: SITE.stats.services, label: 'Services performed', note: 'Hair, skin & bridal' },
  ]

  return (
    <section aria-label="What we do, and the numbers behind it" className="relative border-y border-gold/15 bg-ink">
      <div className="group relative overflow-hidden py-7 [mask-image:linear-gradient(90deg,transparent,#000_9%,#000_91%,transparent)] sm:py-10">
        <div className="flex w-max animate-marquee font-display text-[clamp(2.5rem,6.6vw,5.8rem)] italic leading-none [font-variation-settings:'opsz'_40] group-hover:[animation-play-state:paused]">
          <Track />
          <Track hidden />
        </div>
      </div>

      <div className="container-editorial border-t border-ivory/[0.07]">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} y={22}>
              <div
                className={`px-1 py-9 sm:py-11 lg:px-8 ${i % 2 ? 'border-l border-ivory/[0.07]' : ''} ${
                  i > 0 ? 'lg:border-l lg:border-ivory/[0.07]' : ''
                } ${i > 1 ? 'border-t border-ivory/[0.07] lg:border-t-0' : ''}`}
              >
                <dd className="font-display text-[clamp(2.3rem,4.6vw,3.8rem)] leading-none text-gold-hi">
                  <Counter value={s.value} />
                </dd>
                <dt className="mt-4 font-sans text-[10px] uppercase tracking-label text-ivory/70">{s.label}</dt>
                <p className="mt-1.5 font-sans text-[11px] text-ivory/40">{s.note}</p>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
