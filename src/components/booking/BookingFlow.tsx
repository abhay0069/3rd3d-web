import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CATEGORIES,
  EXPERTS,
  SERVICES,
  formatDuration,
  formatPrice,
  getExpert,
  getService,
  type ServiceCategory,
} from '../../data/salon'
import {
  availableSlots,
  formatDay,
  formatDayNumber,
  formatLongDate,
  formatMonth,
  stylistsForCategory,
  toDateKey,
  upcomingDays,
} from '../../lib/availability'
import { EASE_SILK } from '../../lib/motion'
import { useBooking } from '../../store/booking'
import { Magnetic } from '../ui/Magnetic'

const STEPS = [
  { n: 1, label: 'Service' },
  { n: 2, label: 'Stylist' },
  { n: 3, label: 'Date' },
  { n: 4, label: 'Time' },
  { n: 5, label: 'Confirm' },
] as const

/* ── small building blocks ─────────────────────────────────────────────── */

function StepRail({ step, goTo }: { step: number; goTo: (n: never) => void }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Booking progress">
      {STEPS.map((s) => {
        const state = s.n === step ? 'current' : s.n < step ? 'done' : 'todo'
        return (
          <li key={s.n}>
            <button
              type="button"
              onClick={() => s.n <= step && goTo(s.n as never)}
              disabled={s.n > step}
              aria-current={state === 'current' ? 'step' : undefined}
              className={`group flex items-baseline gap-2 pb-1 transition-colors duration-300 ${
                state === 'current'
                  ? 'text-charcoal'
                  : state === 'done'
                    ? 'text-smoke hover:text-charcoal'
                    : 'cursor-not-allowed text-taupe/60'
              }`}
            >
              <span className="font-sans text-[10px] tracking-label">
                {String(s.n).padStart(2, '0')}
              </span>
              <span className="font-sans text-[11px] uppercase tracking-wide2">{s.label}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

function OptionCard({
  active,
  onClick,
  children,
  className = '',
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group relative w-full overflow-hidden border text-left transition-all duration-500 ease-silk ${
        active ? 'border-champagne bg-charcoal/[0.04]' : 'border-charcoal/12 hover:border-charcoal/35'
      } ${className}`}
    >
      {children}
      <span
        aria-hidden
        className={`absolute right-0 top-0 h-full w-[2px] origin-top bg-champagne transition-transform duration-500 ease-silk ${
          active ? 'scale-y-100' : 'scale-y-0'
        }`}
      />
    </button>
  )
}

/* ── the flow ──────────────────────────────────────────────────────────── */

export function BookingFlow({
  variant = 'inline',
  onDone,
}: {
  variant?: 'inline' | 'modal'
  onDone?: () => void
}) {
  const b = useBooking()
  const service = getService(b.serviceId)
  const stylist = getExpert(b.stylistId)

  const [category, setCategory] = useState<ServiceCategory>(service?.category ?? 'hair')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (service) setCategory(service.category)
  }, [service])

  const days = useMemo(() => upcomingDays(16, b.stylistId), [b.stylistId])
  const selectedDate = useMemo(() => days.find((d) => d.key === b.dateKey)?.date ?? null, [days, b.dateKey])
  const slots = useMemo(
    () => (selectedDate ? availableSlots(selectedDate, b.stylistId) : []),
    [selectedDate, b.stylistId],
  )

  const valid = b.name.trim().length > 1 && b.phone.replace(/\D/g, '').length >= 8

  const canAdvance =
    (b.step === 1 && !!b.serviceId) ||
    (b.step === 2 && true) ||
    (b.step === 3 && !!b.dateKey) ||
    (b.step === 4 && !!b.time) ||
    b.step === 5

  const contactFor = b.stylistId ? stylist?.name : 'First available artist'

  /* ── confirmed state ─────────────────────────────────────────────────── */
  if (b.confirmed) {
    return (
      <div className="mx-auto max-w-xl py-4 text-center">
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE_SILK }}
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-champagne/60"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-brass" aria-hidden>
            <path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </motion.div>

        <h3 className="display-md mt-6 text-charcoal">Your experience is reserved.</h3>
        <p className="mt-3 text-sm text-smoke">
          We have held{' '}
          <strong className="font-normal text-charcoal">
            {selectedDate ? formatLongDate(selectedDate) : ''} at {b.time}
          </strong>{' '}
          for {service?.name.toLowerCase()}. Our studio will confirm by phone within two hours.
        </p>

        <dl className="mt-8 space-y-3 border-t border-charcoal/10 pt-6 text-left">
          {[
            ['Service', service?.name ?? '—'],
            ['Artist', contactFor ?? '—'],
            ['Duration', service ? formatDuration(service.duration) : '—'],
            ['From', service ? formatPrice(service.price) : '—'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-6">
              <dt className="font-sans text-[10px] uppercase tracking-label text-taupe">{label}</dt>
              <dd className="font-sans text-[13px] text-charcoal">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            className="btn btn-ghost"
            href={`tel:${(b.phone || '').replace(/\s/g, '')}`}
            onClick={(e) => e.preventDefault()}
          >
            We’ll call you
          </a>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              b.reset()
              onDone?.()
            }}
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={variant === 'modal' ? '' : ''}>
      <StepRail step={b.step} goTo={b.goTo} />

      <div className="mt-8 min-h-[320px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={b.step}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: EASE_SILK }}
          >
            {/* ── 1. SERVICE ─────────────────────────────────────────── */}
            {b.step === 1 && (
              <div>
                <div className="flex flex-wrap gap-2" role="tablist" aria-label="Service category">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      role="tab"
                      aria-selected={category === c.id}
                      onClick={() => setCategory(c.id)}
                      className={`rounded-full border px-5 py-2 font-sans text-[11px] uppercase tracking-wide2 transition-colors duration-400 ${
                        category === c.id
                          ? 'border-charcoal bg-charcoal text-ivory'
                          : 'border-charcoal/15 text-smoke hover:border-charcoal/40'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6 divide-y divide-charcoal/10 border-y border-charcoal/10">
                  {SERVICES.filter((s) => s.category === category).map((s) => (
                    <OptionCard
                      key={s.id}
                      active={b.serviceId === s.id}
                      onClick={() => {
                        b.set('serviceId', s.id)
                        b.set('time', null)
                      }}
                      className="border-0 px-1 py-4"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-display text-xl text-charcoal">{s.name}</span>
                        <span className="whitespace-nowrap font-sans text-[12px] text-smoke">
                          {formatPrice(s.price)}
                        </span>
                      </div>
                      <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-smoke">
                        {s.description}
                      </p>
                      <span className="mt-2 inline-block font-sans text-[10px] uppercase tracking-label text-taupe">
                        {formatDuration(s.duration)}
                      </span>
                    </OptionCard>
                  ))}
                </div>
              </div>
            )}

            {/* ── 2. STYLIST ─────────────────────────────────────────── */}
            {b.step === 2 && (
              <div className="grid gap-3 sm:grid-cols-3">
                <OptionCard
                  active={b.stylistId === null}
                  onClick={() => {
                    b.set('stylistId', null)
                    b.set('time', null)
                  }}
                  className="p-4"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-charcoal/12 font-display text-lg text-brass">
                    ✦
                  </span>
                  <span className="mt-3 block font-display text-lg">First available</span>
                  <span className="mt-1 block text-[12px] text-smoke">
                    Soonest appointment across the team
                  </span>
                </OptionCard>

                {stylistsForCategory(service?.category).map((e) => (
                  <OptionCard
                    key={e.id}
                    active={b.stylistId === e.id}
                    onClick={() => {
                      b.set('stylistId', e.id)
                      b.set('time', null)
                    }}
                    className="overflow-hidden"
                  >
                    <span className="block aspect-[4/5] overflow-hidden bg-sand">
                      <img
                        src={e.image}
                        alt={`${e.name}, ${e.role}`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 ease-silk group-hover:scale-[1.03]"
                      />
                    </span>
                    <span className="block p-4">
                      <span className="block font-display text-lg leading-tight">{e.name}</span>
                      <span className="mt-1 block font-sans text-[11px] uppercase tracking-wide2 text-taupe">
                        {e.role}
                      </span>
                      <span className="mt-2 block text-[12px] text-smoke">{e.specialty}</span>
                    </span>
                  </OptionCard>
                ))}
              </div>
            )}

            {/* ── 3. DATE ────────────────────────────────────────────── */}
            {b.step === 3 && (
              <div>
                <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
                  {days.map((d) => (
                    <button
                      key={d.key}
                      type="button"
                      disabled={d.closed}
                      onClick={() => {
                        b.set('dateKey', d.key)
                        b.set('time', null)
                      }}
                      aria-pressed={b.dateKey === d.key}
                      className={`flex h-[86px] w-[68px] shrink-0 flex-col items-center justify-center border transition-all duration-400 ease-silk ${
                        d.closed
                          ? 'cursor-not-allowed border-charcoal/8 text-taupe/40'
                          : b.dateKey === d.key
                            ? 'border-champagne bg-charcoal text-ivory'
                            : 'border-charcoal/12 text-charcoal hover:border-charcoal/40'
                      }`}
                    >
                      <span className="font-sans text-[9px] uppercase tracking-label">
                        {formatDay(d.date)}
                      </span>
                      <span className="mt-1 font-display text-2xl leading-none">
                        {formatDayNumber(d.date)}
                      </span>
                      <span className="mt-1 font-sans text-[9px] uppercase tracking-label">
                        {d.closed ? 'Closed' : formatMonth(d.date)}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-[12px] text-taupe">
                  The studio is closed on Mondays. Private bridal appointments are available outside
                  these hours — call the studio.
                </p>
              </div>
            )}

            {/* ── 4. TIME ────────────────────────────────────────────── */}
            {b.step === 4 && (
              <div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {slots.map(({ time, available }) => (
                    <button
                      key={time}
                      type="button"
                      disabled={!available}
                      onClick={() => b.set('time', time)}
                      aria-pressed={b.time === time}
                      className={`border py-4 font-sans text-[13px] transition-all duration-400 ease-silk ${
                        !available
                          ? 'cursor-not-allowed border-charcoal/8 text-taupe/40 line-through'
                          : b.time === time
                            ? 'border-champagne bg-charcoal text-ivory'
                            : 'border-charcoal/12 hover:border-charcoal/40'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-[12px] text-taupe">
                  Greyed times are already taken. Your slot is held for 15 minutes once confirmed.
                </p>
              </div>
            )}

            {/* ── 5. CONFIRM ─────────────────────────────────────────── */}
            {b.step === 5 && (
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-5">
                  <label className="block">
                    <span className="font-sans text-[10px] uppercase tracking-label text-taupe">
                      Full name *
                    </span>
                    <input
                      className="field"
                      value={b.name}
                      onChange={(e) => b.set('name', e.target.value)}
                      placeholder="Your name"
                      autoComplete="name"
                      aria-invalid={touched && b.name.trim().length < 2}
                    />
                  </label>
                  <label className="block">
                    <span className="font-sans text-[10px] uppercase tracking-label text-taupe">
                      Mobile *
                    </span>
                    <input
                      className="field"
                      value={b.phone}
                      onChange={(e) => b.set('phone', e.target.value)}
                      placeholder="+91 00000 00000"
                      inputMode="tel"
                      autoComplete="tel"
                      aria-invalid={touched && b.phone.replace(/\D/g, '').length < 8}
                    />
                  </label>
                  <label className="block">
                    <span className="font-sans text-[10px] uppercase tracking-label text-taupe">
                      Email
                    </span>
                    <input
                      className="field"
                      type="email"
                      value={b.email}
                      onChange={(e) => b.set('email', e.target.value)}
                      placeholder="you@email.com"
                      autoComplete="email"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="font-sans text-[10px] uppercase tracking-label text-taupe">
                    Anything we should know?
                  </span>
                  <textarea
                    className="field mt-1 resize-none"
                    rows={5}
                    value={b.notes}
                    onChange={(e) => b.set('notes', e.target.value)}
                    placeholder="Hair history, allergies, occasion, inspiration…"
                  />
                </label>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── footer actions ──────────────────────────────────────────── */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-charcoal/10 pt-6">
        <button
          type="button"
          onClick={() => (b.step === 1 ? b.close() : b.back())}
          className="font-sans text-[11px] uppercase tracking-wide2 text-smoke transition-colors hover:text-charcoal"
        >
          {b.step === 1 ? 'Cancel' : '← Back'}
        </button>

        <div className="flex items-center gap-5">
          {service && (
            <span className="hidden font-sans text-[12px] text-smoke sm:inline">
              {service.name} · {service ? formatDuration(service.duration) : ''} ·{' '}
              {service ? formatPrice(service.price) : ''}
            </span>
          )}
          <Magnetic strength={0.16}>
            <button
              type="button"
              disabled={!canAdvance}
              onClick={() => {
                if (b.step < 5) {
                  b.next()
                  return
                }
                setTouched(true)
                if (valid) {
                  b.set('confirmed', true)
                }
              }}
              className={`btn ${b.step === 5 ? 'btn-primary' : 'btn-ghost'} disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {b.step === 5 ? 'Book appointment' : 'Continue'}
            </button>
          </Magnetic>
        </div>
      </div>

      {touched && !valid && (
        <p className="mt-3 text-right text-[12px] text-brass" role="alert">
          Please add a name and a contact number so we can confirm your booking.
        </p>
      )}
    </div>
  )
}

/** Live summary of the current selection — shared by the dialog. */
export function BookingSummary() {
  const b = useBooking()
  const service = getService(b.serviceId)
  const stylist = getExpert(b.stylistId)
  const date = upcomingDays(16, b.stylistId).find((d) => d.key === b.dateKey)?.date ?? null

  const rows: [string, string][] = [
    ['Service', service?.name ?? 'Not selected'],
    ['Artist', b.stylistId ? (stylist?.name ?? '—') : 'First available'],
    ['Date', date ? formatLongDate(date) : 'Not selected'],
    ['Time', b.time ?? 'Not selected'],
  ]

  return (
    <div className="glass-dark rounded-sm p-6 text-ivory lg:p-7">
      {service && (
        <div className="mb-6 overflow-hidden rounded-sm">
          <img
            src={service.image}
            alt=""
            aria-hidden
            className="h-32 w-full object-cover opacity-90"
            loading="lazy"
          />
        </div>
      )}
      <p className="font-sans text-[10px] uppercase tracking-label text-ivory/50">Your booking</p>
      <p className="mt-3 font-display text-3xl leading-tight text-ivory">
        {service?.name ?? 'Choose your experience'}
      </p>

      <dl className="mt-6 space-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4 border-b border-ivory/10 pb-2">
            <dt className="font-sans text-[10px] uppercase tracking-label text-ivory/50">{label}</dt>
            <dd className="text-right font-sans text-[12px] text-ivory/90">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex items-baseline justify-between">
        <span className="font-sans text-[10px] uppercase tracking-label text-ivory/50">From</span>
        <span className="font-display text-2xl text-champagne">
          {service ? formatPrice(service.price) : '—'}
        </span>
      </div>

      <p className="mt-5 text-[11px] leading-relaxed text-ivory/45">
        A consultant confirms every appointment by phone. Prices are a starting point and may vary
        with hair length and product used — you will always be told before we begin.
      </p>
    </div>
  )
}

export const CATEGORY_COUNT = CATEGORIES.length
export const ARTIST_COUNT = EXPERTS.length
export { toDateKey }
