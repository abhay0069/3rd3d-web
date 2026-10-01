import { useEffect, useRef } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useStory } from '../../store/story'

export function StoryCursor() {
  const cursorMode = useStory((s) => s.cursorMode)
  const cursorText = useStory((s) => s.cursorText)

  const cursorX = useSpring(0, { stiffness: 450, damping: 32, mass: 0.2 })
  const cursorY = useSpring(0, { stiffness: 450, damping: 32, mass: 0.2 })
  const ringX = useSpring(0, { stiffness: 220, damping: 26, mass: 0.5 })
  const ringY = useSpring(0, { stiffness: 220, damping: 26, mass: 0.5 })

  const isVisible = useRef(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!hasFinePointer) return

    const handlePointerMove = (e: PointerEvent) => {
      if (!isVisible.current && cursorRef.current) {
        isVisible.current = true
        cursorRef.current.style.opacity = '1'
      }
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      ringX.set(e.clientX)
      ringY.set(e.clientY)
    }

    const handlePointerLeave = () => {
      if (cursorRef.current) {
        isVisible.current = false
        cursorRef.current.style.opacity = '0'
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('mouseleave', handlePointerLeave)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('mouseleave', handlePointerLeave)
    }
  }, [cursorX, cursorY, ringX, ringY])

  const isInteractive = cursorMode !== 'default'
  const isLabeled = Boolean(cursorText || ['explore', 'drag', 'view', 'book'].includes(cursorMode))

  const label =
    cursorText ||
    (cursorMode === 'explore'
      ? 'EXPLORE'
      : cursorMode === 'drag'
        ? 'DRAG'
        : cursorMode === 'view'
          ? 'VIEW'
          : cursorMode === 'book'
            ? 'BOOK'
            : '')

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed inset-0 z-[120] hidden opacity-0 transition-opacity duration-300 md:block"
      aria-hidden="true"
    >
      {/* Outer Ring / Aura */}
      <motion.div
        className="absolute -left-6 -top-6 flex items-center justify-center rounded-full will-change-transform"
        style={{
          x: ringX,
          y: ringY,
          width: isLabeled ? 92 : isInteractive ? 48 : 34,
          height: isLabeled ? 92 : isInteractive ? 48 : 34,
          marginLeft: isLabeled ? -46 : isInteractive ? -24 : -17,
          marginTop: isLabeled ? -46 : isInteractive ? -24 : -17,
          background: isLabeled
            ? 'rgba(205, 170, 110, 0.18)'
            : isInteractive
              ? 'rgba(243, 224, 181, 0.15)'
              : 'transparent',
          border: isLabeled
            ? '1px solid rgba(243, 224, 181, 0.65)'
            : isInteractive
              ? '1px solid rgba(243, 224, 181, 0.45)'
              : '1px solid rgba(205, 170, 110, 0.35)',
          backdropFilter: isLabeled ? 'blur(6px)' : 'none',
          boxShadow: isLabeled ? '0 0 25px rgba(205, 170, 110, 0.25)' : 'none',
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {isLabeled && (
          <span className="font-sans text-[9px] font-medium tracking-[0.22em] text-[#f7e8c3]">
            {label}
          </span>
        )}
      </motion.div>

      {/* Center pinpoint */}
      {!isLabeled && (
        <motion.div
          className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-gold will-change-transform"
          style={{ x: cursorX, y: cursorY }}
          animate={{ scale: isInteractive ? 0.6 : 1 }}
        />
      )}
    </div>
  )
}
