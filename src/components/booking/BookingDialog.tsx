import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useBooking } from '../../store/booking'
import { useScrollLock } from '../../hooks/useResponsive'
import { EASE_SILK } from '../../lib/motion'
import { BookingFlow, BookingSummary } from './BookingFlow'
import { SITE } from '../../data/salon'

/**
 * The booking sheet. One surface, five steps, no page changes — and it keeps the
 * primary conversion goal one tap away from anywhere on the site.
 */
export function BookingDialog() {
  const { isOpen, close, step } = useBooking()
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()

  useScrollLock(isOpen)

  useEffect(() => {
    if (!isOpen) return
    restoreRef.current = document.activeElement as HTMLElement
    const timer = window.setTimeout(() => panelRef.current?.focus(), 60)

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      // simple focus trap
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', onKey)
      restoreRef.current?.focus?.()
    }
  }, [isOpen, close])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80]" role="presentation">
          <motion.button
            type="button"
            aria-label="Close booking"
            className="absolute inset-0 h-full w-full cursor-default bg-ink/55 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_SILK }}
            onClick={close}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-full max-w-[1060px] flex-col bg-ivory text-charcoal shadow-[0_0_120px_rgba(0,0,0,0.35)] outline-none sm:inset-y-3 sm:right-3 sm:rounded-sm"
            initial={reduced ? { opacity: 0 } : { x: '4%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { x: '4%', opacity: 0 }}
            transition={{ duration: 0.65, ease: EASE_SILK }}
          >
            {/* header */}
            <div className="flex items-center justify-between gap-6 border-b border-charcoal/10 px-6 py-5 sm:px-9">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-label text-taupe">
                  {SITE.name} · Book an appointment
                </p>
                <h2 id="booking-title" className="mt-1 font-display text-2xl text-charcoal sm:text-3xl">
                  Your next look starts here.
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-charcoal/15 transition-colors duration-400 hover:border-charcoal/50"
                aria-label="Close booking dialog"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.2" fill="none" />
                </svg>
              </button>
            </div>

            {/* body */}
            <div className="grid flex-1 overflow-hidden lg:grid-cols-[330px_1fr]">
              <aside className="hidden overflow-y-auto border-r border-charcoal/10 bg-ink p-8 lg:block">
                <BookingSummary />
              </aside>

              <div className="overflow-y-auto px-6 py-7 sm:px-9 sm:py-9">
                <p className="mb-5 font-sans text-[10px] uppercase tracking-label text-taupe lg:hidden">
                  Step {String(step).padStart(2, '0')} of 05
                </p>
                <BookingFlow variant="modal" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
