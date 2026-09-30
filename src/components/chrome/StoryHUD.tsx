import { AnimatePresence, motion } from 'framer-motion'
import { sound } from '../../lib/audio'
import { useBooking } from '../../store/booking'
import { CHAPTERS, useStory } from '../../store/story'

export function StoryHUD() {
  const currentChapter = useStory((s) => s.currentChapter)
  const chapterIndex = useStory((s) => s.chapterIndex)
  const soundEnabled = useStory((s) => s.soundEnabled)
  const toggleSound = useStory((s) => s.toggleSound)
  const quickNavOpen = useStory((s) => s.quickNavOpen)
  const setQuickNavOpen = useStory((s) => s.setQuickNavOpen)
  const scrollProgress = useStory((s) => s.scrollProgress)
  const openBooking = useBooking((s) => s.open)

  const activeChapterInfo = CHAPTERS[chapterIndex] || CHAPTERS[0]
  const pct = Math.round(scrollProgress * 100)

  const scrollToChapter = (id: string) => {
    sound.playClick()
    setQuickNavOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {/* Top HUD Bar */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[90] flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
        {/* Monogram Brand */}
        <div className="pointer-events-auto">
          <button
            type="button"
            onClick={() => scrollToChapter('arrive')}
            className="group flex flex-col items-start text-left focus:outline-none"
            aria-label="Return to beginning"
          >
            <div className="flex items-center gap-2">
              <span className="font-display text-[19px] font-medium tracking-[0.24em] text-[#f7f3ec] transition-colors duration-500 group-hover:text-gold sm:text-[21px]">
                LUMIÈRE
              </span>
              <span className="text-[10px] text-gold-hi opacity-80 group-hover:rotate-45 transition-transform duration-500">
                ✦
              </span>
            </div>
            <span className="font-sans text-[8.5px] uppercase tracking-[0.3em] text-gold/75">
              ATELIER BANDRA WEST · 2026
            </span>
          </button>
        </div>

        {/* Center Chapter Teleport Pill (Noomo style with real-time percentage) */}
        <div className="pointer-events-auto hidden md:block">
          <button
            type="button"
            onClick={() => setQuickNavOpen(!quickNavOpen)}
            className="group flex items-center gap-3 rounded-full border border-gold/30 bg-[#0a0a0c]/80 px-5 py-2 backdrop-blur-2xl transition-all duration-500 hover:border-gold hover:bg-[#0a0a0c]/95 shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
            aria-label="Open Chapter Index"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            <span className="font-sans text-[10px] tracking-[0.24em] text-ivory/60 group-hover:text-ivory">
              {activeChapterInfo.num} / 08
            </span>
            <span className="font-display text-[13.5px] italic tracking-wide text-gold-hi">
              {activeChapterInfo.title}
            </span>
            <span className="font-sans text-[9px] text-ivory/40">
              {pct}%
            </span>
            <svg
              viewBox="0 0 16 16"
              className={`h-3 w-3 text-gold/70 transition-transform duration-500 ${
                quickNavOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
        </div>

        {/* Right Controls: Sound & Index */}
        <div className="pointer-events-auto flex items-center gap-3 sm:gap-4">
          {/* Procedural Soundscape Toggle with animated sound wave bars */}
          <button
            type="button"
            onClick={toggleSound}
            className={`group flex items-center gap-2.5 rounded-full border px-4 py-2 font-sans text-[10px] uppercase tracking-wide2 backdrop-blur-2xl transition-all duration-500 ${
              soundEnabled
                ? 'border-gold bg-gold/15 text-gold-hi shadow-[0_0_20px_rgba(205,170,110,0.3)]'
                : 'border-ivory/20 bg-[#0a0a0c]/70 text-ivory/60 hover:border-ivory/50 hover:text-ivory'
            }`}
            aria-label={soundEnabled ? 'Mute procedural soundscape' : 'Enable procedural soundscape'}
          >
            {soundEnabled ? (
              <div className="flex items-end gap-[2px] h-3 w-3">
                <span className="w-[2px] bg-gold-hi rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-full" />
                <span className="w-[2px] bg-gold-hi rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-2/3" />
                <span className="w-[2px] bg-gold-hi rounded-full animate-[pulse_0.75s_ease-in-out_infinite] h-4/5" />
              </div>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 opacity-60">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            )}
            <span className="hidden xs:inline">
              {soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}
            </span>
          </button>

          {/* Chapter Index Trigger */}
          <button
            type="button"
            onClick={() => setQuickNavOpen(!quickNavOpen)}
            className="flex items-center gap-2 rounded-full border border-ivory/20 bg-[#0a0a0c]/70 px-4 py-2 font-sans text-[10px] uppercase tracking-wide2 text-ivory/80 backdrop-blur-2xl transition-all duration-500 hover:border-gold hover:text-gold-hi"
            aria-label="Toggle Chapter Navigation"
          >
            <span>INDEX</span>
            <div className="flex flex-col gap-1">
              <span
                className={`block h-px w-3 bg-current transition-transform duration-300 ${
                  quickNavOpen ? 'translate-y-1 rotate-45' : ''
                }`}
              />
              <span
                className={`block h-px w-3 bg-current transition-transform duration-300 ${
                  quickNavOpen ? '-translate-y-0.5 -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Floating Bottom Booking Action */}
      <div className="pointer-events-none fixed bottom-7 right-7 z-[90]">
        <button
          type="button"
          onClick={() => {
            sound.playTransition(659.25)
            openBooking()
          }}
          className="btn-gold pointer-events-auto group relative flex items-center gap-3 overflow-hidden rounded-full px-6 py-3.5 shadow-[0_16px_45px_-10px_rgba(205,170,110,0.55)] transition-all duration-500 hover:scale-105 active:scale-95"
          data-cursor="book"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-ink animate-ping opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ink" />
          </span>
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-ink">
            Book Appointment
          </span>
        </button>
      </div>

      {/* Global Story Progress Hairline */}
      <div className="pointer-events-none fixed left-0 top-0 z-[100] h-[2px] w-full bg-ivory/10">
        <div
          className="h-full bg-gradient-to-r from-gold-lo via-gold to-gold-hi transition-all duration-150 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Spatial Chapter Directory Modal */}
      <AnimatePresence>
        {quickNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[110] flex flex-col justify-between bg-[#0a0a0c]/96 px-8 py-12 backdrop-blur-3xl sm:px-16 lg:px-24"
          >
            <div className="flex items-center justify-between border-b border-gold/20 pb-6">
              <div className="flex items-center gap-2">
                <span className="text-gold text-[12px]">✦</span>
                <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-gold">
                  THE STORY COMPASS · 8 CHAPTERS
                </span>
              </div>
              <button
                type="button"
                onClick={() => setQuickNavOpen(false)}
                className="font-sans text-[11px] uppercase tracking-wide2 text-ivory/60 transition-colors hover:text-gold-hi"
              >
                CLOSE [✕]
              </button>
            </div>

            <nav className="my-auto max-w-4xl py-8" aria-label="Chapter Index">
              <ul className="space-y-3 sm:space-y-4">
                {CHAPTERS.map((ch) => {
                  const isCurrent = currentChapter === ch.id
                  return (
                    <li key={ch.id}>
                      <button
                        type="button"
                        onClick={() => scrollToChapter(ch.id)}
                        className={`group flex items-baseline gap-6 text-left transition-all duration-500 ${
                          isCurrent
                            ? 'translate-x-3 text-gold-hi'
                            : 'text-ivory/40 hover:translate-x-2 hover:text-ivory'
                        }`}
                      >
                        <span className="font-sans text-[12px] tracking-widest text-gold/60">
                          {ch.num}
                        </span>
                        <span className="font-display text-[7vw] leading-[1.05] tracking-tight sm:text-[3.2rem]">
                          {ch.title}
                        </span>
                        {isCurrent && (
                          <span className="hidden font-sans text-[10px] uppercase tracking-widest text-gold sm:inline">
                            [YOU ARE HERE]
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="flex flex-wrap items-center justify-between border-t border-gold/15 pt-6 font-sans text-[11px] text-ivory/50">
              <span>LUMIÈRE SALON · 14 TURNER ROAD, BANDRA WEST, MUMBAI</span>
              <span className="text-gold">AN INTERACTIVE DIGITAL ART EXPERIENCE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
