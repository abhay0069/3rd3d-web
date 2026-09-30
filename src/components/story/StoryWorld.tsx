import { useEffect } from 'react'
import { bindPointer } from '../../lib/pointer'
import { CHAPTERS, useStory, type ChapterId } from '../../store/story'
import { BookingDialog } from '../booking/BookingDialog'
import { StoryCursor } from '../chrome/StoryCursor'
import { StoryHUD } from '../chrome/StoryHUD'
import { WorldCanvas } from '../../three/WorldCanvas'

import { Chapter01Arrive } from './Chapter01Arrive'
import { Chapter02Discover } from './Chapter02Discover'
import { Chapter03Explore } from './Chapter03Explore'
import { Chapter04Transform } from './Chapter04Transform'
import { Chapter05Archive } from './Chapter05Archive'
import { Chapter06Artisans } from './Chapter06Artisans'
import { Chapter07Sanctuary } from './Chapter07Sanctuary'
import { Chapter08Book } from './Chapter08Book'
import { SpotlightModal } from './SpotlightModal'

export function StoryWorld() {
  const setChapter = useStory((s) => s.setChapter)
  const setScrollProgress = useStory((s) => s.setScrollProgress)

  useEffect(() => {
    const unbindPointer = bindPointer()

    // Smooth scroll velocity and global progress tracker
    let lastScrollY = window.scrollY
    let lastTimestamp = performance.now()
    let raf = 0

    const updateScroll = () => {
      const now = performance.now()
      const currentScrollY = window.scrollY
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const progress = Math.min(1, Math.max(0, currentScrollY / maxScroll))

      const dt = Math.max(1, now - lastTimestamp)
      const velocity = (currentScrollY - lastScrollY) / dt
      lastScrollY = currentScrollY
      lastTimestamp = now

      setScrollProgress(progress, velocity)
      raf = requestAnimationFrame(updateScroll)
    }

    raf = requestAnimationFrame(updateScroll)

    // IntersectionObserver to accurately track the active narrative chapter
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
            const id = entry.target.id as ChapterId
            const idx = CHAPTERS.findIndex((c) => c.id === id)
            if (idx !== -1) {
              setChapter(id, idx)
            }
          }
        })
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: '-20% 0px -20% 0px' }
    )

    CHAPTERS.forEach((ch) => {
      const el = document.getElementById(ch.id)
      if (el) observer.observe(el)
    })

    return () => {
      unbindPointer()
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [setChapter, setScrollProgress])

  return (
    <div className="relative min-h-screen w-full bg-ink text-paper selection:bg-gold selection:text-ink">
      {/* Central Persistent 3D WebGL Realm Canvas */}
      <WorldCanvas />

      {/* Minimalist Narrative HUD & Progress */}
      <StoryHUD />

      {/* Intelligent Contextual Cursor */}
      <StoryCursor />

      {/* Main Continuous Story Journey */}
      <main id="story-main" className="relative z-10 w-full overflow-hidden">
        <Chapter01Arrive />
        <Chapter02Discover />
        <Chapter03Explore />
        <Chapter04Transform />
        <Chapter05Archive />
        <Chapter06Artisans />
        <Chapter07Sanctuary />
        <Chapter08Book />
      </main>

      {/* Modals & Portals */}
      <SpotlightModal />
      <BookingDialog />
    </div>
  )
}
