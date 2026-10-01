import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useBooking } from '../../store/booking'
import { EASE_SILK } from '../../lib/motion'
import { Magnetic } from '../ui/Magnetic'
import { SITE } from '../../data/salon'

/**
 * The persistent conversion affordance.
 * Desktop: a quiet pill in the corner that expands under the cursor.
 * Mobile: a full-width bar that never leaves the screen, with a call fallback.
 */
export function FloatingBook() {
  const open = useBooking((s) => s.open)
  const isOpen = useBooking((s) => s.isOpen)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let raf = 0
    const check = () => {
      raf = 0
      setVisible(window.scrollY > window.innerHeight * 0.55)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const show = visible && !isOpen

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Desktop */}
          <motion.div
            key="desktop-book"
            className="fixed bottom-8 right-8 z-[60] hidden md:block"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.7, ease: EASE_SILK }}
          >
            <Magnetic strength={0.2} max={10}>
              <button
                type="button"
                onClick={() => open()}
                data-cursor="hover"
                className="btn-gold group relative flex items-center gap-3 overflow-hidden rounded-full py-3.5 pl-6 pr-5 shadow-[0_18px_50px_-14px_rgba(205,170,110,0.45)] transition-all duration-500 ease-silk hover:gap-4 hover:pr-7"
              >
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inset-0 rounded-full bg-ink" />
                  <span className="absolute inset-0 animate-ping rounded-full bg-ink/50" />
                </span>
                <span className="font-sans text-[11px] uppercase tracking-wide2">
                  Book appointment
                </span>
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
                  <path
                    d="M5 12h13M13 6.5l5.5 5.5L13 17.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                </svg>
              </button>
            </Magnetic>
          </motion.div>

          {/* Mobile */}
          <motion.div
            key="mobile-book"
            className="fixed inset-x-0 bottom-0 z-[60] md:hidden"
            style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: EASE_SILK }}
          >
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/95 to-transparent" />
            <div className="relative mx-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => open()}
                className="btn-gold flex h-14 flex-1 items-center justify-center gap-3 rounded-full font-sans text-[11px] uppercase tracking-wide2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                Book appointment
              </button>
              <a
                href={SITE.phoneHref}
                aria-label={`Call the studio on ${SITE.phone}`}
                className="glass-dark flex h-14 w-14 items-center justify-center rounded-full text-gold-hi"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                  <path
                    d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 005 5L15.5 12l4 1.5v3a2 2 0 01-2.2 2A15.5 15.5 0 014.5 5.7 2 2 0 016.5 3.5z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                </svg>
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
