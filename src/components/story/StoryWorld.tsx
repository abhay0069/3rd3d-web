import Lenis from 'lenis'
import { useEffect, useRef } from 'react'
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
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const unbindPointer = bindPointer()

    // Initialize ultra-smooth cinematic momentum scroll (Noomo-grade)
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    })
    lenisRef.current = lenis

    let lastScrollY = window.scrollY
    let lastTime = performance.now()
    let rafId = 0

    function onRaf(time: number) {
      lenis.raf(time)

      const currentScrollY = window.scrollY
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const progress = Math.min(1, Math.max(0, currentScrollY / maxScroll))

      const dt = Math.max(1, time - lastTime)
      const velocity = (currentScrollY - lastScrollY) / dt
      lastScrollY = currentScrollY
      lastTime = time

      setScrollProgress(progress, velocity)
      rafId = requestAnimationFrame(onRaf)
    }

    rafId = requestAnimationFrame(onRaf)

    // IntersectionObserver to accurately track the active chapter
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
            const id = entry.target.id as ChapterId
            const idx = CHAPTERS.findIndex((c) => c.id === id)
            if (idx !== -1) {
              setChapter(id, idx)
            }
          }
        })
      },
      { threshold: [0.2, 0.4, 0.6, 0.8], rootMargin: '-15% 0px -15% 0px' }
    )

    CHAPTERS.forEach((ch) => {
      const el = document.getElementById(ch.id)
      if (el) observer.observe(el)
    })

    return () => {
      unbindPointer()
      cancelAnimationFrame(rafId)
      lenis.destroy()
      observer.disconnect()
    }
  }, [setChapter, setScrollProgress])

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0c] text-paper selection:bg-gold selection:text-ink">
      {/* Central Persistent 3D WebGL Realm Canvas */}
      <WorldCanvas />

      {/* Floating Noise Texture Overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[2] opacity-[0.035] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle Atmospheric Vignette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[3]"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 40%, rgba(10, 10, 12, 0.75) 100%)',
        }}
      />

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
