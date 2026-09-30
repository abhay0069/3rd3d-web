import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

/**
 * Photography with real depth: the frame is a fixed mask, the image inside
 * drifts and scales as the section passes the viewport. Cheap, GPU-only, and it
 * is what makes the editorial spreads feel filmic rather than flat.
 */
export function ParallaxMedia({
  src,
  alt,
  className = '',
  imgClassName = '',
  /** vertical travel in pixels */
  distance = 70,
  /** how much the image is over-scaled to hide the travel */
  zoom = 1.12,
  priority = false,
  children,
  fetchSizes,
  ratio,
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  distance?: number
  zoom?: number
  priority?: boolean
  children?: ReactNode
  fetchSizes?: string
  ratio?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-distance, distance])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduced ? [1, 1, 1] : [zoom, zoom * 0.98, zoom])

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-sand ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        sizes={fetchSizes}
        style={{ y, scale }}
        className={`h-full w-full object-cover will-change-transform ${imgClassName}`}
      />
      {children}
    </div>
  )
}
