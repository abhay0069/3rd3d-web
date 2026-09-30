import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV_LINKS, SITE } from '../../data/salon'
import { useBooking } from '../../store/booking'
import { useScrollLock } from '../../hooks/useResponsive'
import { EASE_SILK } from '../../lib/motion'
import { Magnetic } from '../ui/Magnetic'

function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    let raf = 0
    const check = () => {
      raf = 0
      setScrolled(window.scrollY > threshold)
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
  }, [threshold])
  return scrolled
}

function useActiveSection() {
  const [active, setActive] = useState('#home')
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1))
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(`#${visible.target.id}`)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.6, 1] },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])
  return active
}

export function Nav() {
  const scrolled = useScrolled(60)
  const active = useActiveSection()
  const [menuOpen, setMenuOpen] = useState(false)
  const openBooking = useBooking((s) => s.open)
  useScrollLock(menuOpen)

  const go = useCallback(
    (href: string) => {
      setMenuOpen(false)
      const el = document.querySelector(href)
      if (!el) return
      if (typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: (el as HTMLElement).offsetTop, behavior: 'smooth' })
      }
    },
    [],
  )

  return (
    <>
      <a
        href="#services"
        className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-charcoal px-4 py-2 text-[11px] uppercase tracking-wide2 text-ivory"
      >
        Skip to content
      </a>

      <motion.header
        className="fixed inset-x-0 top-0 z-[70]"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE_SILK, delay: 0.35 }}
      >
        <div
          className={`transition-all duration-700 ease-silk ${
            scrolled
              ? 'border-b border-charcoal/8 bg-ivory/75 backdrop-blur-xl backdrop-saturate-150'
              : 'border-b border-transparent bg-transparent'
          }`}
        >
          <nav
            className="container-editorial flex items-center justify-between gap-6"
            style={{ height: scrolled ? 64 : 78, transition: 'height 0.6s cubic-bezier(0.22,1,0.36,1)' }}
            aria-label="Primary"
          >
            {/* Wordmark */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                go('#home')
              }}
              className="group flex flex-col leading-none"
              aria-label={`${SITE.name} home`}
            >
              <span className="font-display text-[22px] tracking-[0.22em] text-charcoal transition-opacity duration-500 group-hover:opacity-70 sm:text-[24px]">
                {SITE.name}
              </span>
              <span className="mt-1 hidden font-sans text-[8px] uppercase tracking-label text-taupe sm:block">
                {SITE.tagline}
              </span>
            </a>

            {/* Desktop links */}
            <ul className="hidden items-center gap-7 lg:flex">
              {NAV_LINKS.map((link) => {
                const isActive = active === link.href
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault()
                        go(link.href)
                      }}
                      className="link-underline font-sans text-[11px] uppercase tracking-wide2 text-charcoal/80 transition-colors duration-400 hover:text-charcoal"
                      aria-current={isActive ? 'true' : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                )
              })}
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <a
                href={SITE.phoneHref}
                className="hidden font-sans text-[11px] tracking-wide2 text-smoke transition-colors hover:text-charcoal xl:block"
              >
                {SITE.phone}
              </a>

              <Magnetic strength={0.14} max={6} className="hidden sm:inline-flex">
                <button
                  type="button"
                  onClick={() => openBooking()}
                  data-cursor="hover"
                  className="btn btn-primary !px-6 !py-3"
                >
                  Book now
                </button>
              </Magnetic>

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center lg:hidden"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span className="relative block h-3 w-6">
                  <span
                    className={`absolute left-0 block h-px w-6 bg-charcoal transition-all duration-500 ease-silk ${
                      menuOpen ? 'top-1.5 rotate-45' : 'top-0'
                    }`}
                  />
                  <span
                    className={`absolute left-0 block h-px w-6 bg-charcoal transition-all duration-500 ease-silk ${
                      menuOpen ? 'top-1.5 -rotate-45' : 'top-3'
                    }`}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile / tablet menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[65] flex flex-col justify-center bg-ink px-7 text-ivory lg:hidden"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE_SILK }}
          >
            <nav aria-label="Mobile">
              <ul className="space-y-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.06, duration: 0.7, ease: EASE_SILK }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault()
                        go(link.href)
                      }}
                      className="block py-1 font-display text-[12vw] leading-[1.12] tracking-tight text-ivory/90 transition-colors duration-400 hover:text-champagne sm:text-[9vw]"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="mt-12 space-y-4 border-t border-ivory/15 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  openBooking()
                }}
                className="btn btn-light w-full"
              >
                Book appointment
              </button>
              <div className="flex flex-wrap items-center justify-between gap-4 font-sans text-[11px] tracking-wide2 text-ivory/60">
                <a href={SITE.phoneHref} className="link-underline">
                  {SITE.phone}
                </a>
                <span>
                  {SITE.address.line1}, {SITE.address.line2}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
