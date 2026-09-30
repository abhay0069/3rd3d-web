import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { bindPointer } from './lib/pointer'
import { bindScroll } from './lib/scroll'
import { useDeviceTier, usePrefersReducedMotion } from './hooks/useResponsive'

import { Preloader } from './components/chrome/Preloader'
import { Nav } from './components/chrome/Nav'
import { Cursor } from './components/chrome/Cursor'
import { FloatingBook } from './components/chrome/FloatingBook'
import { BookingDialog } from './components/booking/BookingDialog'

import { Hero } from './components/sections/Hero'
import { TrustStrip } from './components/sections/TrustStrip'
import { Services } from './components/sections/Services'
import { Looks } from './components/sections/Looks'
import { Transformation } from './components/sections/Transformation'
import { Experience } from './components/sections/Experience'
import { FaceSection } from './components/sections/FaceSection'
import { Products } from './components/sections/Products'
import { About, Experts } from './components/sections/Experts'
import { Testimonials } from './components/sections/Testimonials'
import { BookingSection } from './components/sections/BookingSection'
import { Footer } from './components/sections/Footer'

export default function App() {
  const tier = useDeviceTier()
  const reduced = usePrefersReducedMotion()

  const [sceneReady, setSceneReady] = useState(false)
  const [intro, setIntro] = useState(false)
  const [veil, setVeil] = useState(true)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 })

  useEffect(() => {
    const unbindPointer = bindPointer()
    const unbindScroll = bindScroll()
    return () => {
      unbindPointer()
      unbindScroll()
    }
  }, [])

  const handleReveal = useCallback(() => {
    setIntro(true)
    window.setTimeout(() => setVeil(false), 420)
  }, [])

  return (
    <>
      {/* Scroll progress hairline */}
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[75] h-[2px] origin-left bg-champagne/80"
        style={{ scaleX: progress }}
      />

      <AnimatePresence>{veil && <Preloader sceneReady={sceneReady} onReveal={handleReveal} />}</AnimatePresence>

      <Cursor />
      <Nav />

      <main id="main">
        <Hero
          tier={tier}
          reduced={reduced}
          started={intro}
          onSceneReady={() => setSceneReady(true)}
        />
        <TrustStrip />
        <Services />
        <Looks />
        <Transformation />
        <Experience />
        <FaceSection tier={tier} />
        <Products tier={tier} />
        <Experts />
        <About />
        <Testimonials />
        <BookingSection />
      </main>

      <Footer />
      <FloatingBook />
      <BookingDialog />
    </>
  )
}
