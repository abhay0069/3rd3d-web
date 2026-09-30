import { SITE } from '../../data/salon'
import { Stars } from '../ui/Bits'
import { Reveal } from '../ui/Reveal'

/** Immediate, quiet credibility the moment the hero releases you. */
export function TrustStrip() {
  const items = [
    {
      key: 'rating',
      node: (
        <span className="flex items-center gap-3">
          <Stars value={SITE.stats.rating} className="text-brass" />
          <span className="font-sans text-[12px] text-charcoal">
            {SITE.stats.rating.toFixed(1)}
            <span className="text-taupe"> · {SITE.stats.reviews} Google reviews</span>
          </span>
        </span>
      ),
    },
    { key: 'years', node: <span className="font-sans text-[12px] text-smoke">{SITE.stats.years} years in Bandra West</span> },
    { key: 'clients', node: <span className="font-sans text-[12px] text-smoke">{SITE.stats.clients} clients looked after</span> },
    { key: 'services', node: <span className="font-sans text-[12px] text-smoke">{SITE.stats.services} services performed</span> },
  ]

  return (
    <div className="border-b border-charcoal/8 bg-ivory">
      <div className="container-editorial">
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-6 lg:justify-between">
          {items.map((item, i) => (
            <Reveal as="li" key={item.key} delay={i * 0.06} y={10}>
              <span className="flex items-center gap-3">
                {i > 0 && <span aria-hidden className="hidden h-3 w-px bg-charcoal/15 lg:block" />}
                {item.node}
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  )
}
