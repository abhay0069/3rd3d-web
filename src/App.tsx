import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bindPointer } from './lib/pointer'
import { bindScroll } from './lib/scroll'
import { hasWebGL } from './lib/webgl'
import { useDeviceTier, usePrefersReducedMotion } from './hooks/useResponsive'

import { Preloader } from './components/chrome/Preloader'
import { Nav } from './components/chrome/Nav'
import { Cursor } from './components/chrome/Cursor'
import { FloatingBook } from './components/chrome/FloatingBook'
import { BookingDialog } from './components/booking/BookingDialog'
import { CanvasBoundary } from './components/ui/CanvasBoundary'

import { RoyalHero } from './components/sections/RoyalHero'
import { RoyalServiceWorlds } from './components/sections/RoyalServiceWorlds'
import { TrustStrip } from './components/sections/TrustStrip'
import { Looks } from './components/sections/Looks'
import { Transformation } from './components/sections/Transformation'
import { Experience } from './components/sections/Experience'
import { FaceSection } from './components/sections/FaceSection'
import { Products } from './components/sections/Products'
import { About, Experts } from './components/sections/Experts'
import { Testimonials } from './components/sections/Testimonials'
import { BookingSection } from './components/sections/BookingSection'
import { Footer } from './components/sections/Footer'
import RoyalJourneyCanvas from './three/RoyalJourney'

export default function App() {
  const tier = useDeviceTier()
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const [webgl, setWebgl] = useState(() => hasWebGL())

  const [sceneReady, setSceneReady] = useState(() => !webgl)
  const [intro, setIntro] = useState(false)
  const [veil, setVeil] = useState(true)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 })

  useEffect(() => {
    document.body.classList.add('royal-theme')
    const unbindPointer = bindPointer()
    const unbindScroll = bindScroll()
    return () => {
      unbindPointer()
      unbindScroll()
    }
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const root = rootRef.current
    if (!root || reduced) return

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-royal-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 84%',
              end: 'bottom 68%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })
    }, root)

    return () => context.revert()
  }, [reduced])

  const handleSceneReady = useCallback(() => setSceneReady(true), [])
  const handleReveal = useCallback(() => {
    setIntro(true)
    window.setTimeout(() => setVeil(false), 420)
  }, [])

  return (
    <div ref={rootRef} id="royal-app" className={`royal-site relative isolate overflow-clip bg-[#080605] ${webgl ? '' : 'royal-site--no-webgl'}`}>
      {webgl && (
        <CanvasBoundary
          fallback={null}
          onError={() => {
            setWebgl(false)
            setSceneReady(true)
          }}
        >
          <RoyalJourneyCanvas tier={tier} reduced={reduced} started={intro} onSceneReady={handleSceneReady} />
        </CanvasBoundary>
      )}

      {/* One thread: the 3D camera, portals and environments all travel through this world. */}
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[75] h-[2px] origin-left bg-champagne/80"
        style={{ scaleX: progress }}
      />

      <AnimatePresence>{veil && <Preloader sceneReady={sceneReady} onReveal={handleReveal} />}</AnimatePresence>

      <Cursor />
      <Nav />

      <main id="main" className="relative z-10">
        <RoyalHero revealed={intro} />
        <TrustStrip />
        <RoyalServiceWorlds />
        <Looks />
        <Transformation />
        <FaceSection tier={tier} />
        <Products tier={tier} />
        <Experts />
        <About />
        <Testimonials />
        <Experience />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
      <BookingSection />
      <FloatingBook />
      <BookingDialog />
    </div>
  )
}
