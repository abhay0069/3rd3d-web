import type { ReactNode } from 'react'
import { Reveal, RevealLines, RevealRule } from './Reveal'

export function Stars({ value = 5, className = '' }: { value?: number; className?: string }) {
  const rounded = Math.round(value)
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
          <path
            d="M12 2.5l2.9 6.06 6.6.86-4.83 4.6 1.2 6.48L12 17.4l-5.87 3.1 1.2-6.48L2.5 9.42l6.6-.86L12 2.5z"
            fill={i < rounded ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.1"
            opacity={i < rounded ? 1 : 0.35}
          />
        </svg>
      ))}
    </span>
  )
}

/** The recurring editorial section header: index, eyebrow, big serif line. */
export function SectionHeading({
  index,
  eyebrow,
  lines,
  intro,
  align = 'left',
  tone = 'dark',
  className = '',
  as = 'h2',
}: {
  index?: string
  eyebrow: string
  lines: (string | ReactNode)[]
  intro?: string
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  className?: string
  as?: 'h2' | 'h3'
}) {
  const Heading = as
  return (
    <div
      className={`${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'} ${className}`}
    >
      <Reveal y={14}>
        <div
          className={`flex items-center gap-4 ${align === 'center' ? 'justify-center' : ''} ${
            tone === 'light' ? 'text-ivory/60' : 'text-taupe'
          }`}
        >
          {index && <span className="font-sans text-[10px] tracking-label">{index}</span>}
          <span className="eyebrow">{eyebrow}</span>
        </div>
      </Reveal>

      <Heading
        className={`display-lg mt-5 ${tone === 'light' ? 'text-ivory' : 'text-charcoal'}`}
      >
        <RevealLines lines={lines} />
      </Heading>

      {intro && (
        <Reveal delay={0.15}>
          <p
            className={`mt-6 max-w-xl text-[15px] leading-relaxed ${
              align === 'center' ? 'mx-auto' : ''
            } ${tone === 'light' ? 'text-ivory/70' : 'text-smoke'}`}
          >
            {intro}
          </p>
        </Reveal>
      )}

      <RevealRule delay={0.25} className={`mt-8 ${tone === 'light' ? '!bg-ivory/25' : ''}`} />
    </div>
  )
}

/** Small labelled meta line — duration, price, category. */
export function Meta({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="font-sans text-[10px] uppercase tracking-label text-taupe">{label}</span>
      <span className="font-sans text-[13px] text-charcoal">{value}</span>
    </span>
  )
}
