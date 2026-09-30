import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Reveal, RevealImage, ScrollWords } from '../ui/Reveal'

/** A floating arch window at the margin: parallaxes as the statement is read. */
function FloatArch({ src, className, travel }: { src: string; className: string; travel: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [travel, -travel])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      <div className="arch-ring">
        <RevealImage arch className="arch aspect-[2/3.05] overflow-hidden bg-umber" delay={0.1}>
          <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </RevealImage>
      </div>
    </motion.div>
  )
}

/**
 * The statement after the hook: what the studio believes, lit up word by word
 * as you read it. Two arch windows float at the margins on wide screens.
 */
export function Manifesto() {
  return (
    <section id="manifesto" aria-label="Our philosophy" className="relative overflow-hidden bg-ink py-28 sm:py-36 lg:py-52">
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
        <FloatArch src="/img/look-classic.jpg" className="absolute left-[4.5%] top-[44%] w-[12vw] max-w-[190px]" travel={70} />
        <FloatArch src="/img/look-bold.jpg" className="absolute right-[4.5%] top-[10%] w-[13vw] max-w-[210px]" travel={-60} />
      </div>

      <div className="container-editorial relative">
        <Reveal y={14}>
          <p className="eyebrow flex items-center justify-center gap-4 text-gold">
            <span aria-hidden className="h-px w-10 bg-gold/60" />
            The studio · since 2013
            <span aria-hidden className="h-px w-10 bg-gold/60" />
          </p>
        </Reveal>

        <ScrollWords
          text="Luxury, to us, is *attention.* An unhurried consultation, honest mirrors, and one specialist who stays with you from the first question to the final finish."
          className="mx-auto mt-12 max-w-[56rem] text-center font-display text-[clamp(1.9rem,4.3vw,3.9rem)] leading-[1.14] tracking-[-0.02em] text-ivory"
        />

        <Reveal delay={0.1} className="mx-auto mt-14 max-w-md text-center">
          <p className="font-sans text-[15px] leading-relaxed text-ivory/60">
            Hair. Beauty. Confidence. Designed around you — in a studio built for calm, precision and a very good
            mirror.
          </p>
          <a
            href="#services"
            data-cursor="hover"
            className="link-underline mt-8 inline-block font-sans text-[11px] uppercase tracking-wide2 text-gold transition-colors hover:text-gold-hi"
          >
            See what we do →
          </a>
        </Reveal>
      </div>
    </section>
  )
}
