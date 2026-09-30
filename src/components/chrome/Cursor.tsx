import { useEffect, useRef } from 'react'

/**
 * A single, calm cursor accompaniment: a hairline ring that trails the pointer
 * and opens up over anything interactive. The native cursor is always kept,
 * so nothing about the site feels hijacked.
 */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const ring = ringRef.current!
    const dot = dotRef.current!
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let scale = 1
    let targetScale = 1
    let active = false
    let raf = 0

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      x = event.clientX
      y = event.clientY
      if (!active) {
        active = true
        ring.style.opacity = '1'
        dot.style.opacity = '1'
      }
      const el = event.target as HTMLElement | null
      targetScale = el?.closest('a, button, [data-cursor="hover"], input, textarea, [role="button"]')
        ? 2.1
        : 1
    }

    const onLeave = () => {
      ring.style.opacity = '0'
      dot.style.opacity = '0'
      active = false
    }

    const loop = () => {
      rx += (x - rx) * 0.14
      ry += (y - ry) * 0.14
      scale += (targetScale - scale) * 0.12
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[95] hidden md:block" aria-hidden="true">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-8 w-8 rounded-full border border-gold/70 opacity-0 transition-opacity duration-500"
        style={{ willChange: 'transform' }}
      />
      <span
        ref={dotRef}
        className="absolute left-0 top-0 h-1 w-1 rounded-full bg-gold opacity-0 transition-opacity duration-500"
        style={{ willChange: 'transform' }}
      />
    </div>
  )
}
