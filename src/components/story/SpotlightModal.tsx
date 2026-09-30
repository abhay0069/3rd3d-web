import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { sound } from '../../lib/audio'
import { useBooking } from '../../store/booking'
import { useStory } from '../../store/story'

export function SpotlightModal() {
  const activeImage = useStory((s) => s.activeModalImage)
  const closeModal = useStory((s) => s.openModalImage)
  const openBooking = useBooking((s) => s.open)

  useEffect(() => {
    if (!activeImage) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeImage, closeModal])

  return (
    <AnimatePresence>
      {activeImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[130] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-2xl sm:p-10"
          onClick={() => closeModal(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-gold/40 bg-ink shadow-[0_0_120px_rgba(205,170,110,0.3)] lg:flex-row"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick()
                closeModal(null)
              }}
              className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 bg-ink/80 text-ivory/80 backdrop-blur-md transition-colors hover:border-gold hover:text-gold-hi"
              aria-label="Close Spotlight"
            >
              ✕
            </button>

            {/* Image Stage */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-black lg:w-3/5 lg:aspect-auto">
              <img
                src={activeImage.src}
                alt={activeImage.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60" />
            </div>

            {/* Detail Panel */}
            <div className="flex flex-1 flex-col justify-between p-8 sm:p-12">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-gold">
                  CINEMATIC SPOTLIGHT
                </span>
                <h3 className="mt-3 font-display text-[clamp(2rem,4vw,3.2rem)] font-light leading-tight text-ivory">
                  {activeImage.title}
                </h3>
                {activeImage.subtitle && (
                  <p className="mt-2 font-sans text-[11px] uppercase tracking-wide2 text-gold-hi">
                    {activeImage.subtitle}
                  </p>
                )}
                <div className="mt-6 border-t border-ivory/10 pt-6">
                  <p className="text-[14px] leading-relaxed text-ivory/70">
                    Created in daylight lamps at our Bandra West studio. All formulations are
                    ammonia-free and tailored to natural bone structure and texture.
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-ivory/10 pt-8">
                <button
                  type="button"
                  onClick={() => {
                    closeModal(null)
                    sound.playClick()
                    openBooking()
                  }}
                  className="btn-gold w-full !py-4"
                >
                  Book Look Consultation
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
