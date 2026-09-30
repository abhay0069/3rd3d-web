import { useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { bindPointer } from './lib/pointer'
import { useDeviceTier } from './hooks/useResponsive'

import { Nav } from './components/chrome/Nav'
import { Cursor } from './components/chrome/Cursor'
import { FloatingBook } from './components/chrome/FloatingBook'
import { BookingDialog } from './components/booking/BookingDialog'

import { Hero } from './components/sections/Hero'
import { Marquee } from './components/sections/Marquee'
import { Manifesto } from './components/sections/Manifesto'
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

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 })

  useEffect(() => bindPointer(), [])

  return (
    <>
      {/* Scroll progress hairline */}
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[75] h-[2px] origin-left bg-gradient-to-r from-gold-lo via-gold to-gold-hi"
        style={{ scaleX: progress }}
      />

      <Cursor />
      <Nav />

      <main id="main">
        <Hero />
        <Marquee />
        <Manifesto />
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
