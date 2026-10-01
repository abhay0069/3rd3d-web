import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { SITE } from '../../data/salon'
import { useBooking } from '../../store/booking'
import { useIntro } from '../../store/intro'
import { pointer } from '../../lib/pointer'
import { GoldDust } from '../../lib/goldDust'
import {
  COPY_AT,
  TL,
  archClip,
  archGeometry,
  bell,
  clamp,
  easeInOutCubic,
  easeInOutQuart,
  easeOutCubic,
  easeOutExpo,
  lerp,
  seg,
  smoothstep,
  startScale,
  type ArchGeom,
} from '../../lib/intro'
import { Magnetic } from '../ui/Magnetic'
import { Stars } from '../ui/Bits'

const LETTERS = Array.from(SITE.name)
const PHOTO = '/img/face-particles.jpg'

interface Side {
  path: SVGPathElement
  glow: SVGPathElement
  spark: SVGGElement
  len: number
}

/**
 * The opening. A point of light splits and draws an arch; a portrait develops
 * inside it; a beam ignites the wordmark letter by letter; the arch opens into
 * the full frame. ~2.1s of spectacle, ~3.4s until the last line of copy lands —
 * and any click, key or scroll fast-forwards it.
 *
 * Everything is driven from one clock by `render(t)`, a pure function of time.
 */
export function Hero() {
  const reduced = useReducedMotion()
  const openBooking = useBooking((s) => s.open)

  const rootRef = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const rimRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const scaleRef = useRef<HTMLDivElement>(null)
  const parRef = useRef<HTMLDivElement>(null)
  const kbRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const lanternRef = useRef<HTMLDivElement>(null)
  const developRef = useRef<HTMLDivElement>(null)
  const beamRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const outlineRef = useRef<SVGGElement>(null)
  const pathLRef = useRef<SVGPathElement>(null)
  const pathRRef = useRef<SVGPathElement>(null)
  const glowLRef = useRef<SVGPathElement>(null)
  const glowRRef = useRef<SVGPathElement>(null)
  const sparkLRef = useRef<SVGGElement>(null)
  const sparkRRef = useRef<SVGGElement>(null)
  const flareRef = useRef<SVGGElement>(null)
  const dustRef = useRef<HTMLCanvasElement>(null)
  const wmRef = useRef<HTMLDivElement>(null)
  const lettersRef = useRef<HTMLSpanElement[]>([])
  const flashRef = useRef<HTMLDivElement>(null)

  // Scroll-linked exit: the portrait sinks and swells, the copy lifts away.
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.42], [1, 0])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const wmY = useTransform(scrollYProgress, [0, 1], [0, -56])
  const wmOpacity = useTransform(scrollYProgress, [0.55, 0.96], [1, 0])

  useEffect(() => {
    const root = rootRef.current
    const dustCanvas = dustRef.current
    if (!root || !dustCanvas) return

    const dev = import.meta.env.DEV
    const devPaused = dev && Boolean((window as unknown as { __introPaused?: boolean }).__introPaused)
    const { setNavIn, setDone } = useIntro.getState()

    const letters = lettersRef.current
    const introEls = Array.from(root.querySelectorAll<HTMLElement>('[data-intro]'))
    const dust = new GoldDust(dustCanvas, window.matchMedia('(max-width: 767px)').matches ? 34 : 72)
    const sides: { L?: Side; R?: Side } = {}

    let W = 0
    let H = 0
    let geom: ArchGeom = archGeometry(1440, 900, 700)
    let s0 = 0.8
    let shift = 0
    let shiftY = 0
    let letterCx: number[] = []
    let beamW = 0
    let t = 0
    let last = performance.now()
    let raf = 0
    let inView = true
    let cancelled = false
    let started = false
    let finished = false
    let skipping: { from: number; start: number } | null = null
    let lx = 0
    let ly = 0
    let ppx = 0
    let ppy = 0

    /* ── geometry ─────────────────────────────────────────────────────── */
    const measure = () => {
      const rect = root.getBoundingClientRect()
      W = rect.width
      H = rect.height
      const fs = parseFloat(getComputedStyle(letters[0]).fontSize) || 200
      const wmRect = wmRef.current!.getBoundingClientRect()
      const wmTop = wmRect.top - rect.top + fs * 0.115 // top of the capitals
      geom = archGeometry(W, H, wmTop)
      s0 = startScale(geom, W, H)
      // on wide screens the portrait settles slightly right of centre, leaving the copy room
      shift = W >= 1024 ? W * 0.05 : 0
      // tall, narrow screens: lift the portrait so the face clears the copy below it
      shiftY = W / H < 0.85 ? -H * 0.085 : 0
      letterCx = letters.map((l) => {
        const r = l.getBoundingClientRect()
        return r.left - rect.left + r.width / 2
      })
      beamW = W * 0.3

      // outline legs: two paths running down from the apex, offset outside the photo
      const pad = 11
      const R = geom.r + pad
      const xl = geom.x0 - pad
      const xr = geom.x1 + pad
      const yt = geom.y0 - pad
      const dL = `M ${geom.cx} ${yt} A ${R} ${R} 0 0 0 ${xl} ${yt + R} L ${xl} ${geom.y1}`
      const dR = `M ${geom.cx} ${yt} A ${R} ${R} 0 0 1 ${xr} ${yt + R} L ${xr} ${geom.y1}`
      const defs: [SVGPathElement | null, SVGPathElement | null, SVGGElement | null, string, 'L' | 'R'][] = [
        [pathLRef.current, glowLRef.current, sparkLRef.current, dL, 'L'],
        [pathRRef.current, glowRRef.current, sparkRRef.current, dR, 'R'],
      ]
      for (const [path, glow, spark, d, key] of defs) {
        if (!path || !glow || !spark) continue
        path.setAttribute('d', d)
        glow.setAttribute('d', d)
        const len = path.getTotalLength()
        for (const p of [path, glow]) p.style.strokeDasharray = `${len}`
        sides[key] = { path, glow, spark, len }
      }

      // warm bloom behind the arch
      const glow = glowRef.current
      if (glow) {
        const gw = geom.w * 2.6
        const gh = geom.h * 1.55
        glow.style.width = `${gw}px`
        glow.style.height = `${gh}px`
        glow.style.left = `${geom.cx - gw / 2}px`
        glow.style.top = `${geom.cy - gh / 2}px`
      }
      if (beamRef.current) beamRef.current.style.width = `${beamW}px`

      // soft blobs don't need device-pixel resolution
      dust.resize(W, H, 1)
    }

    /* Intro-only layers are at zero by ~2.4s; taking them out of rendering entirely frees
       several compositor layers for the life of the page (and leaves nothing to ghost). */
    const introLayers = [svgRef, beamRef, flashRef, rimRef, glowRef, developRef]
    let layersOn = true
    const setIntroLayers = (on: boolean) => {
      if (on === layersOn) return
      layersOn = on
      for (const ref of introLayers) if (ref.current) ref.current.style.display = on ? '' : 'none'
    }

    /* ── the timeline: a pure function of t ─────────────────────────────── */
    const render = (time: number) => {
      setIntroLayers(time < 2.5)
      const outlineDraw = easeInOutCubic(seg(time, TL.arch[0], TL.arch[1]))
      const sparkIn = easeOutCubic(seg(time, TL.spark[0], TL.spark[1]))
      const sparkOut = 1 - smoothstep(TL.arch[1] - 0.04, TL.arch[1] + 0.2, time)
      const open = easeInOutQuart(seg(time, TL.expand[0], TL.expand[1]))

      // outline + travelling sparks
      const outlineOpacity = 1 - smoothstep(TL.expand[0], TL.expand[0] + 0.26, time)
      if (outlineRef.current) outlineRef.current.style.opacity = outlineOpacity.toFixed(3)
      for (const side of [sides.L, sides.R]) {
        if (!side) continue
        const off = `${side.len * (1 - outlineDraw)}`
        side.path.style.strokeDashoffset = off
        side.glow.style.strokeDashoffset = off
        const pt = side.path.getPointAtLength(side.len * outlineDraw)
        const s = sparkIn * sparkOut
        side.spark.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) scale(${s.toFixed(3)})`)
      }
      if (flareRef.current) {
        const f = bell(seg(time, 0.0, 0.62)) * 1.25 + 0.0001
        flareRef.current.setAttribute(
          'transform',
          `translate(${geom.cx.toFixed(1)} ${(geom.y0 - 11).toFixed(1)}) scale(${f.toFixed(3)})`,
        )
      }

      // warm bloom
      if (glowRef.current) {
        const g = easeOutCubic(seg(time, TL.glow[0], TL.glow[1])) * (1 - smoothstep(TL.expand[0] + 0.22, TL.expand[1], time))
        glowRef.current.style.opacity = g.toFixed(3)
      }

      // portrait: develops inside the arch, then the frame opens
      if (photoRef.current) photoRef.current.style.clipPath = open >= 1 ? 'none' : archClip(geom, W, H, open)
      if (rimRef.current) {
        rimRef.current.style.clipPath = archClip(geom, W, H, open, 2.4, -4)
        rimRef.current.style.opacity = (seg(time, TL.develop[0], TL.develop[0] + 0.3) * (1 - smoothstep(0.5, 0.86, open))).toFixed(3)
      }
      if (developRef.current) {
        developRef.current.style.opacity = (1 - easeOutCubic(seg(time, TL.develop[0], TL.develop[1]))).toFixed(3)
      }
      if (scaleRef.current) {
        const k = easeOutCubic(seg(time, TL.expand[0] - 0.12, TL.expand[1] + 0.3))
        scaleRef.current.style.transform = `translate3d(${(shift * k).toFixed(1)}px,${(shiftY * k).toFixed(1)}px,0) scale(${lerp(s0, 1, k).toFixed(4)})`
      }

      // the beam, and the letters it ignites
      const bp = seg(time, TL.beam[0], TL.beam[1])
      const beamX = lerp(-0.2 * W, 1.12 * W, easeInOutCubic(bp))
      const beamAmp = smoothstep(0, 0.14, bp) * (1 - smoothstep(0.86, 1, bp))
      if (beamRef.current) {
        beamRef.current.style.opacity = (beamAmp * 0.9).toFixed(3)
        beamRef.current.style.transform = `translate3d(${(beamX - beamW / 2).toFixed(1)}px,0,0) skewX(-16deg)`
      }
      for (let i = 0; i < letters.length; i++) {
        const el = letters[i]
        const a0 = TL.letters.start + i * TL.letters.stagger
        const p = seg(time, a0, a0 + TL.letters.dur)
        el.style.opacity = easeOutCubic(p).toFixed(3)
        el.style.transform = `translate3d(0, ${((1 - easeOutExpo(p)) * 0.26).toFixed(3)}em, 0)`
        const d = beamX - (letterCx[i] ?? 0)
        const heat = Math.exp(-Math.pow(d / (W * 0.09), 2)) * beamAmp
        el.style.setProperty('--lit', smoothstep(-36, 80, d).toFixed(3))
        el.style.setProperty('--heat', heat.toFixed(3))
        el.classList.toggle('is-hot', heat > 0.012)
      }

      // a soft exposure swell as the frame opens
      if (flashRef.current) flashRef.current.style.opacity = (bell(seg(time, TL.flash[0], TL.flash[1])) * 0.5).toFixed(3)

      // copy
      for (const el of introEls) {
        const at = Number(el.dataset.at ?? 0)
        const dur = Number(el.dataset.dur ?? 0.9)
        const p = seg(time, at, at + dur)
        const kind = el.dataset.intro
        if (el.dataset.interactive) el.style.pointerEvents = p > 0.45 ? 'auto' : 'none'
        if (kind === 'line') {
          el.style.opacity = '1'
          el.style.transform = `translate3d(0, ${((1 - easeOutExpo(p)) * 112).toFixed(2)}%, 0)`
        } else if (kind === 'lift') {
          el.style.opacity = easeOutCubic(p).toFixed(3)
          el.style.transform = `translate3d(0, ${((1 - easeOutExpo(p)) * 26).toFixed(2)}px, 0)`
        } else {
          el.style.opacity = easeOutCubic(p).toFixed(3)
        }
      }

      if (time >= TL.navIn) setNavIn()
    }

    const finish = () => {
      if (finished) return
      finished = true
      kbRef.current?.classList.add('animate-kenburns')
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('wheel', skip)
      window.removeEventListener('touchstart', skip)
      setDone()
    }

    function skip() {
      if (finished || skipping || !started) return
      skipping = { from: t, start: performance.now() }
    }

    /* ── ambient life: lantern light + gold dust (runs for the life of the hero) ── */
    const ambient = (dt: number, now: number) => {
      const time = now / 1000
      const fine = pointer.active && pointer.fine
      const tx = fine ? ((pointer.x + 1) / 2) * W : W * (0.5 + 0.22 * Math.sin(time * 0.33))
      const ty = fine ? (1 - (pointer.y + 1) / 2) * H : H * (0.42 + 0.1 * Math.sin(time * 0.47 + 1))
      lx += (tx - lx) * 0.07
      ly += (ty - ly) * 0.07

      if (lanternRef.current) {
        lanternRef.current.style.opacity = (smoothstep(2.0, 3.0, t) * 0.9).toFixed(3)
        lanternRef.current.style.transform = `translate3d(${lx.toFixed(1)}px, ${ly.toFixed(1)}px, 0)`
      }
      if (parRef.current) {
        // gentle depth: the portrait leans a hair towards the light
        ppx += ((lx / W - 0.5) * -14 - ppx) * 0.05
        ppy += ((ly / H - 0.5) * -9 - ppy) * 0.05
        parRef.current.style.transform = `translate3d(${ppx.toFixed(2)}px, ${ppy.toFixed(2)}px, 0)`
      }

      dust.frame(dt, time, {
        intensity: smoothstep(0.85, 1.7, t) * 0.9,
        burst: bell(seg(t, TL.expand[0] - 0.12, TL.expand[1] + 0.34)),
        cx: geom.cx,
        cy: geom.cy,
        pointer: fine ? { x: ((pointer.x + 1) / 2) * W, y: (1 - (pointer.y + 1) / 2) * H } : null,
      })
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const elapsed = (now - last) / 1000
      const dt = Math.min(0.1, elapsed)
      last = now
      if (!inView) return

      if (started && !devPaused && t < TL.end) {
        if (skipping) {
          const k = clamp((now - skipping.start) / 460)
          t = k >= 1 ? TL.end : lerp(skipping.from, TL.end, easeOutCubic(k))
        } else {
          // real time, so a slow device drops frames rather than stretching the intro
          t = Math.min(TL.end, t + Math.min(0.34, elapsed))
        }
        render(t)
        if (t >= TL.end) finish()
      }
      if (started && !reduced && !devPaused && !document.hidden) ambient(dt, now)
    }

    /* ── boot: wait (briefly) for the typeface and the portrait, then play ── */
    const begin = () => {
      if (cancelled) return
      measure()
      started = true
      last = performance.now()
      lx = W * 0.5
      ly = H * 0.42
      if (reduced || (window.location.hash && window.location.hash !== '#home') || window.scrollY > H * 0.4) {
        t = TL.end
        render(t)
        finish()
      } else {
        render(0)
        window.addEventListener('pointerdown', skip)
        window.addEventListener('keydown', skip)
        window.addEventListener('wheel', skip, { passive: true })
        window.addEventListener('touchstart', skip, { passive: true })
      }
    }

    // Start from black, with the letters measured, before anything is painted.
    letters.forEach((el) => {
      el.style.opacity = '0'
    })
    const img = imgRef.current
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    const ready = Promise.race([
      Promise.all([
        fonts?.load ? fonts.load('500 120px "Bodoni Moda Variable"', SITE.name).catch(() => null) : Promise.resolve(null),
        fonts?.load ? fonts.load('italic 400 40px "Bodoni Moda Variable"', 'an experience.').catch(() => null) : Promise.resolve(null),
        img?.decode ? img.decode().catch(() => null) : Promise.resolve(null),
      ]),
      new Promise((resolve) => window.setTimeout(resolve, 1700)),
    ])
    ready.then(begin)

    const ro = new ResizeObserver(() => {
      if (!started) return
      measure()
      render(t)
    })
    ro.observe(root)

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (!inView) dust.clear()
    })
    io.observe(root)

    raf = requestAnimationFrame(tick)

    if (dev) {
      ;(window as unknown as { __intro?: unknown }).__intro = {
        end: TL.end,
        get ready() {
          return started
        },
        seek: (time: number) => {
          skipping = null
          t = time
          render(time)
          const now = performance.now()
          for (let i = 0; i < 6; i++) ambient(0.05, now + i * 50)
        },
      }
    }

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('wheel', skip)
      window.removeEventListener('touchstart', skip)
    }
  }, [reduced])

  return (
    <section
      id="home"
      ref={rootRef}
      aria-label="LUMIÈRE — where beauty becomes an experience"
      className="relative isolate h-[100svh] min-h-[600px] w-full overflow-hidden bg-ink text-ivory"
    >
      {/* warm bloom behind the arch (a soft gradient, so it needs no blur filter) */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute opacity-0"
        style={{
          background:
            'radial-gradient(closest-side, rgba(255,186,108,0.40), rgba(214,150,80,0.16) 52%, transparent 80%)',
        }}
      />

      {/* thin gold rim that hugs the opening frame */}
      <div
        ref={rimRef}
        aria-hidden
        className="absolute inset-0 opacity-0"
        style={{ background: 'linear-gradient(180deg,#f7e6bd 0%,#cdaa6e 45%,#8c6c3b 100%)' }}
      />

      {/* the portrait: clipped to the arch, then opened to the full frame */}
      <div
        ref={photoRef}
        aria-hidden
        className="absolute inset-0 will-change-transform"
        style={{ clipPath: 'inset(50% 50% 50% 50%)' }}
      >
        <motion.div className="absolute inset-0" style={{ y: photoY, scale: photoScale }}>
          <div ref={scaleRef} className="absolute inset-0 origin-[50%_40%] will-change-transform">
            <div ref={parRef} className="absolute inset-0 will-change-transform">
              <div ref={kbRef} className="absolute inset-0 origin-[50%_40%]">
                <img
                  ref={imgRef}
                  src={PHOTO}
                  alt=""
                  width={1408}
                  height={768}
                  decoding="async"
                  className="h-full w-full scale-[1.02] object-cover object-[50%_34%] sm:object-[50%_38%]"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* grade: deep edges, quiet top and a heavy floor for the type */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(120% 92% at 50% 40%, transparent 36%, rgba(6,5,4,0.74) 100%)' }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-ink via-ink/72 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[24%] bg-gradient-to-b from-ink/80 to-transparent" />
        <div
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{
            background:
              'linear-gradient(90deg, rgba(10,9,8,0.9) 0%, rgba(10,9,8,0.66) 20%, rgba(10,9,8,0.22) 36%, transparent 46%)',
          }}
        />

        {/* the lantern: a pool of warm light that follows the cursor */}
        <div
          ref={lanternRef}
          className="pointer-events-none absolute opacity-0"
          style={{
            left: -560,
            top: -560,
            width: 1120,
            height: 1120,
            background:
              'radial-gradient(closest-side, rgba(255,200,128,0.22), rgba(255,200,128,0.07) 46%, transparent 72%)',
            willChange: 'transform, opacity',
          }}
        />

        {/* develops from black */}
        <div ref={developRef} className="absolute inset-0 bg-ink" />
      </div>

      {/* the beam of light that crosses the frame and ignites the name */}
      <div
        ref={beamRef}
        aria-hidden
        className="pointer-events-none absolute -top-[10%] bottom-[-10%] left-0 opacity-0 mix-blend-screen"
        style={{
          background:
            'linear-gradient(90deg, transparent 46.4%, rgba(255,246,222,0.95) 50%, transparent 53.6%), linear-gradient(90deg, transparent 0%, rgba(255,196,118,0.05) 26%, rgba(255,214,146,0.46) 50%, rgba(255,196,118,0.05) 74%, transparent 100%)',
          willChange: 'transform, opacity',
        }}
      />

      {/* arch outline, travelling sparks, apex flare */}
      <svg ref={svgRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="hero-stroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff1cf" />
            <stop offset="55%" stopColor="#d9b97c" />
            <stop offset="100%" stopColor="#8c6c3b" />
          </linearGradient>
          <radialGradient id="hero-spark">
            <stop offset="0%" stopColor="#fffaf0" stopOpacity="1" />
            <stop offset="22%" stopColor="#ffe2a6" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#e0a85c" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#e0a85c" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hero-flare-h" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffe6b0" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff6dc" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffe6b0" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-flare-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe6b0" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff6dc" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffe6b0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g ref={outlineRef} opacity="1">
          {(
            [
              [glowLRef, pathLRef],
              [glowRRef, pathRRef],
            ] as const
          ).map(([g, p], i) => (
            <g key={i}>
              {/* layered translucent strokes read as a glow without a filter */}
              <path ref={g} fill="none" stroke="#e7c27a" strokeOpacity="0.16" strokeWidth="9" strokeLinecap="round" />
              <path ref={p} fill="none" stroke="url(#hero-stroke)" strokeWidth="1.4" strokeLinecap="round" />
            </g>
          ))}
        </g>
        {([sparkLRef, sparkRRef] as const).map((r, i) => (
          <g key={i} ref={r} transform="translate(-99 -99) scale(0)">
            <circle r="22" fill="url(#hero-spark)" />
            <circle r="2.4" fill="#fffaf0" />
          </g>
        ))}
        <g ref={flareRef} transform="translate(-99 -99) scale(0)">
          <rect x="-70" y="-0.7" width="140" height="1.4" fill="url(#hero-flare-h)" />
          <rect x="-0.7" y="-46" width="1.4" height="92" fill="url(#hero-flare-v)" />
          <circle r="16" fill="url(#hero-spark)" />
        </g>
      </svg>

      <canvas ref={dustRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* the name: unlit brass until the beam ignites it */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-[2.4vh] z-10 flex justify-center"
        style={{ y: wmY, opacity: wmOpacity }}
      >
        <div ref={wmRef}>
          <p className="wm" aria-hidden>
            {LETTERS.map((ch, i) => (
              <span
                key={i}
                ref={(el) => {
                  if (el) lettersRef.current[i] = el
                }}
                className="wm-l"
                data-ch={ch}
              >
                {ch}
              </span>
            ))}
          </p>
        </div>
      </motion.div>

      {/* copy */}
      <motion.div className="pointer-events-none absolute inset-0 z-20" style={{ opacity: copyOpacity, y: copyY }}>
        <div
          className="container-editorial relative flex h-full flex-col justify-end"
          style={{ paddingBottom: 'calc(var(--wm-fs) * 0.9 + 2.4vh + clamp(26px, 4.5vh, 52px))' }}
        >
          <div className="flex flex-col items-center gap-7 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
            <div className="max-w-[30rem]">
              <p
                data-intro="lift"
                data-at={COPY_AT.kicker}
                className="eyebrow hidden items-center justify-center gap-3 text-gold sm:flex lg:justify-start"
              >
                <span className="h-px w-8 bg-gold/80" />
                {SITE.tagline}
              </p>

              <h1 className="font-display text-[clamp(2.3rem,4vw,4rem)] leading-[1.04] tracking-[-0.022em] text-ivory [text-shadow:0_2px_30px_rgba(0,0,0,0.7)] sm:mt-5">
                <span className="block overflow-hidden pb-[0.05em]">
                  <span data-intro="line" data-at={COPY_AT.line1} data-dur="1.1" className="block">
                    Where beauty
                  </span>
                </span>
                <span className="block overflow-hidden pb-[0.05em]">
                  <span data-intro="line" data-at={(COPY_AT.line1 + COPY_AT.line2) / 2} data-dur="1.1" className="block">
                    becomes an
                  </span>
                </span>
                <span className="block overflow-hidden pb-[0.14em]">
                  <span data-intro="line" data-at={COPY_AT.line2} data-dur="1.1" className="block italic text-gold-hi">
                    experience.
                  </span>
                </span>
              </h1>

              <div
                data-intro="lift"
                data-interactive="true"
                data-at={COPY_AT.cta}
                className="mt-6 flex items-center justify-center gap-2.5 sm:mt-8 sm:gap-3 lg:justify-start"
              >
                <Magnetic strength={0.18}>
                  <button
                    type="button"
                    onClick={() => openBooking()}
                    data-cursor="hover"
                    className="btn btn-gold max-sm:!px-5 max-sm:!py-3 max-sm:!text-[10.5px]"
                  >
                    Book your experience
                  </button>
                </Magnetic>
                <Magnetic strength={0.14}>
                  <a
                    href="#services"
                    className="btn btn-line max-sm:!px-5 max-sm:!py-3 max-sm:!text-[10.5px]"
                    data-cursor="hover"
                  >
                    <span className="sm:hidden">Services</span>
                    <span className="hidden sm:inline">Explore services</span>
                  </a>
                </Magnetic>
              </div>
            </div>

            <div data-intro="fade" data-at={COPY_AT.meta} className="hidden items-center justify-center gap-3 sm:flex lg:pb-3">
              <Stars value={SITE.stats.rating} className="text-gold" />
              <span className="font-sans text-[12px] text-ivory/85">
                {SITE.stats.rating.toFixed(1)}
                <span className="text-ivory/55"> · {SITE.stats.reviews} Google reviews</span>
              </span>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div
          aria-hidden
          data-intro="fade"
          data-at={COPY_AT.cue}
          className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 xl:flex"
        >
          <span className="writing-vertical rotate-180 font-sans text-[9px] uppercase tracking-label text-ivory/45">
            Scroll
          </span>
          <span className="relative block h-16 w-px overflow-hidden bg-ivory/15">
            <span className="absolute inset-x-0 top-0 block h-7 animate-scrollcue bg-gradient-to-b from-transparent via-gold to-transparent" />
          </span>
        </div>
      </motion.div>

      {/* a soft exposure swell as the frame opens */}
      <div
        ref={flashRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 opacity-0"
        style={{
          background:
            'radial-gradient(62% 62% at 50% 42%, rgba(255,226,170,0.78), rgba(255,200,120,0.26) 48%, transparent 76%)',
        }}
      />

      <div aria-hidden className="grain-layer z-40" />
    </section>
  )
}
