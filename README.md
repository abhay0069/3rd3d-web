# LUMIÈRE — a cinematic 3D website for a luxury salon & beauty studio

An immersive, editorial, production-quality marketing site for a modern luxury
salon. Built around a single conversion goal: **book an appointment**.

> **Placeholder content notice.** This is a demonstration build. All names,
> prices, reviews, statistics, addresses and contact details live in one file —
> [`src/data/salon.ts`](src/data/salon.ts) — and are fictional. Imagery is
> AI-generated placeholder art. Replace everything in that file with the
> studio's verified details before launch.

---

## The experience, in order

| # | Section | What it does |
|---|---------|--------------|
| — | **Preloader** | Wordmark, a hairline that draws itself, handover to 3D. Capped at ~2.4s. |
| 01 | **Hero** | A fully procedural 3D salon. The camera starts outside the room and glides in over 3.4s, then follows the cursor and travels deeper as you scroll. |
| 02 | **Trust strip** | Rating and scale, immediately under the hero. |
| 03 | **Services** | Hair / Beauty / Bridal, 13 services with duration, starting price, inclusions and a Book action. Hovering a row drives a sticky preview plate. |
| 04 | **Choose Your Look** | A digital consultation. Four looks, each re-tuning the section's palette, typography, portrait and recommended services. |
| 05 | **Before / After** | A draggable comparison that peels in 3D at the seam, with keyboard support and an intro tease so nobody misses it. |
| 06 | **Step Inside** | Three plates of the real studio with hotspot markers that open short descriptions. |
| 07 | **The Artistry** | A portrait assembled, live, from ~7,600 particles. It gathers as you scroll in, reacts to the cursor, and dissolves back into the photograph. |
| 08 | **The Shelf** | Four products as real 3D objects you can rotate. |
| 09 | **Experts / About** | Editorial stylist cards with hover panels, plus the studio's promises. |
| 10 | **Social proof** | Cinematic rotating testimonials and the headline numbers. |
| 11 | **Booking** | A five-step flow, inline and in a modal, reachable from everywhere. |
| — | **Chrome** | Glass navigation that condenses on scroll, scroll-progress hairline, a persistent floating booking button, and a quiet cursor ring. |

---

## Engineering notes

### The 3D salon costs nothing to download
Every surface in the hero — travertine, hand-troweled plaster, boucle, brass,
glass, the olive tree, the sheer curtains, the arched window — is generated at
runtime. Textures are drawn to a `<canvas>`, geometry is built from primitives,
and the warm reflections come from an `Environment` rendered from five emissive
light-cards rather than an HDRI. There are **no model or texture downloads** for
the 3D scene, which is why the hero paints instantly and the scene can appear a
moment later without a layout jump.

### Camera choreography
`src/three/CameraRig.tsx` layers three moves into one damped target: a 3.4s
cinematic intro, a cursor parallax (a fraction of a unit — felt, not seen), and a
scroll travel that carries the camera past the mirror wall. Landscape viewports
frame the whole station wall; portrait viewports get a **different composition**
aimed at the window end of the room, because the wide shot cannot survive a
0.5 aspect ratio. The two blend continuously by viewport ratio, so rotating a
phone re-composes the shot instead of breaking it.

### Particles, twice, with a reason
- **Dust motes** in the hero: warm, drifting, repelled by the cursor, pushed
  gently deeper as you scroll. Animated entirely in the vertex shader.
- **The portrait**: the photograph is sampled to 220px, gated on luminance,
  importance-sampled by brightness, and mapped to champagne-tinted points. Those
  same points *are* the photograph it resolves into, so the dissolve is seamless
  rather than a cross-fade. Cursor proximity parts them.

Both scale by device tier (2,400 → 320 points) and respect `prefers-reduced-motion`.

### Performance
- Route-level code splitting per heavy module, plus `manualChunks` for three /
  R3F / framer-motion.
- The hero canvas mounts after the page shell and unmounts once scrolled past;
  the product canvas mounts only when its section is on screen.
- DPR, shadows, particle counts, reflector resolution and JPEG quality all drop
  by device tier, and `PerformanceMonitor` walks DPR back if frames slip.
- Fonts are self-hosted, Latin-only subsets. No third-party requests at all.
- All scroll/pointer listeners are passive and rAF-coalesced; the 3D layer reads
  shared mutable state, never React state, inside the render loop.

### Accessibility
Semantic landmarks and a real heading hierarchy (one `h1`, ten `h2`, `h3` per
service/stylist), the slider as an actual ARIA slider with arrow-key support, a
focus-trapped booking dialog with Escape and focus restore, a skip link, visible
focus rings, `aria-pressed`/`aria-expanded` on toggles, decorative images marked
`aria-hidden`, and default-native cursors throughout.

### SEO
Full metadata, Open Graph and Twitter cards, canonical URL, and `BeautySalon`
structured data with `hasOfferCatalog` covering all thirteen services. Every word
— services, prices, bios, testimonials, hours — is real DOM text, not canvas.

### Graceful degradation
WebGL capability is probed **synchronously** before any canvas mounts, and every
canvas sits inside an error boundary. No WebGL, a lost context, or a driver
quirk means the visitor gets the photographic hero instead of a blank rectangle.

---

## Stack

React 18 · TypeScript (strict) · Vite 5 · Three.js · React Three Fiber · drei ·
Framer Motion · Tailwind CSS · Zustand

GSAP was deliberately left out: Framer Motion's layout animations, `useScroll`
and `useSpring` cover every UI and scroll transition here, so a second animation
library would have been dead weight in the bundle.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, then production build to dist/
npm run preview    # serve the production build
npm run typecheck
```

Requires Node 18+.

## Project structure

```
src/
├─ App.tsx                     section order + global bindings
├─ data/salon.ts               ← ALL CONTENT LIVES HERE
├─ store/booking.ts            zustand booking state
├─ lib/
│  ├─ pointer.ts               allocation-free global pointer store
│  ├─ scroll.ts                global scroll state (read in rAF, never re-renders)
│  ├─ availability.ts          deterministic placeholder diary
│  ├─ motion.ts                shared easings/variants
│  └─ webgl.ts                 synchronous capability probe
├─ hooks/useResponsive.ts      media queries, device tier, in-view, scroll lock
├─ three/
│  ├─ textures.ts              procedural travertine / plaster / dust sprite
│  ├─ objects.tsx              chair, station, curtain, window, olive tree, pendant
│  ├─ SalonRoom.tsx            the set, light-cards and scene lighting
│  ├─ CameraRig.tsx            camera choreography + hero dust particles
│  ├─ HeroScene.tsx            hero canvas
│  ├─ FaceParticles.tsx        particle portrait (sampling + shader)
│  └─ ProductStage.tsx         four procedural product models
└─ components/
   ├─ chrome/                  Preloader, Nav, FloatingBook, Cursor
   ├─ booking/                 BookingFlow, BookingDialog
   ├─ sections/                Hero → Footer
   └─ ui/                      Reveal, Magnetic, ParallaxMedia, CanvasBoundary, Bits
```

## Replacing the placeholder content

1. `src/data/salon.ts` — `SITE` (name, address, phone, hours, statistics),
   `SERVICES`, `EXPERTS`, `LOOKS`, `PRODUCTS`, `TESTIMONIALS`, `TRANSFORMATION`,
   `HOTSPOTS`.
2. `index.html` — title, meta description, canonical URL, Open Graph tags and the
   `BeautySalon` JSON-LD block (address, geo, hours, telephone, sameAs).
3. `public/img/` — swap in the studio's own photography. The portrait used by the
   particle section needs a dark, high-contrast frame so the luminance gate
   isolates the subject cleanly (see `CROP` in `src/three/FaceParticles.tsx`).
4. `src/lib/availability.ts` — replace the deterministic placeholder diary with a
   call to the salon's real booking system.

## Licence

Code: MIT. Imagery: AI-generated placeholder art, free to replace.
