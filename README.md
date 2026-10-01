# LUMIÈRE — a cinematic website for a luxury salon & beauty studio

An immersive, editorial, production-quality marketing site for a modern luxury
salon. Built around a single conversion goal: **book an appointment**.

The look is **noir & gold** — a black stage, gold-foil Didone type and arches of
light. *Lumière* means light, so the whole site is about light arriving: the
opening draws an arch of it, and the same arch frames the photography all the way
down the page.

> **Placeholder content notice.** This is a demonstration build. All names,
> prices, reviews, statistics, addresses and contact details live in one file —
> [`src/data/salon.ts`](src/data/salon.ts) — and are fictional. Imagery is
> AI-generated placeholder art. Replace everything in that file with the
> studio's verified details before launch.

---

## The experience, in order

| # | Section | What it does |
|---|---------|--------------|
| — | **The opening** | A point of light splits and draws an arch; a portrait develops inside it; a beam crosses and ignites the **LUMIÈRE** wordmark letter by letter; the arch opens into the full frame. ~2s of spectacle, ~3.4s until the last line of copy lands. Any click, key press or scroll fast-forwards it. |
| — | **Hero** | A full-bleed portrait with gold dust, a pool of "lantern" light that follows the cursor, and the giant gold-foil name. The portrait sinks and the copy lifts away as you scroll. |
| — | **Marquee & numbers** | A slow band of what the studio does, then the credentials as figures that count up on arrival. |
| — | **Manifesto** | The studio's belief, lit up word by word as you read it, with two arch windows floating at the margins. |
| 01 | **Services** | Hair / Beauty / Bridal, 13 services with duration, starting price, inclusions and a Book action. Hovering a row drives a sticky arch preview. |
| 02 | **Choose Your Look** | A digital consultation. Four looks, each re-tuning the section's palette, typography, portrait and recommended services. |
| 03 | **Before / After** | A draggable comparison that peels in 3D at the seam, with keyboard support and an intro tease so nobody misses it. |
| 04 | **Step Inside** | Three plates of the real studio with hotspot markers that open short descriptions. |
| 05 | **The Artistry** | A portrait assembled, live, from ~7,600 particles. It gathers as you scroll in, reacts to the cursor, and dissolves back into the photograph. |
| 06 | **The Shelf** | Four products as real 3D objects you can rotate. |
| 07 | **Experts** | Three stylists in arch portraits, staggered like doorways. |
| 08 | **About** | The studio's promises. |
| 09 | **Social proof** | Cinematic rotating testimonials and the headline numbers. |
| 10 | **Booking** | A five-step flow, inline and in a modal, reachable from everywhere. |
| — | **Chrome** | Navigation that arrives after the arch opens, scroll-progress hairline, a persistent floating booking button, and a quiet cursor ring. |

---

## Engineering notes

### The opening is a pure function of time
[`Hero.tsx`](src/components/sections/Hero.tsx) owns one master clock, and
`render(t)` sets every element's state from `t` alone — the arch being drawn, the
portrait developing, each letter's ignition, the frame opening, the copy reveals.
The timeline lives in [`src/lib/intro.ts`](src/lib/intro.ts).

Because nothing is stateful, the sequence is always in sync, *skipping* is just
fast-forwarding the clock, and any frame can be reproduced exactly. In
development, set `window.__introPaused = true` before load and call
`window.__intro.seek(seconds)` to scrub to a frame (this hook is compiled out of
production builds).

It is skipped entirely for `prefers-reduced-motion`, for deep links such as
`/#services`, and when the page loads already scrolled. Nothing in the hero is
clickable until it has actually appeared, so a stray click can only skip.

### Light, not weight
The hero needs **no WebGL and no 3D library**. The beam, the lantern, the
exposure swell and the bloom behind the arch are plain gradients (moved with
`transform`, so they never repaint); the gold dust is one small 2D canvas
(72 motes, 34 on phones) drawn at 1×; the film grain is an SVG tile. The
intro-only layers are removed from rendering once they can no longer be visible.

### Type
Headings and the wordmark use **Bodoni Moda** (variable, with an optical-size
axis). The axis is deliberately *pinned* — `opsz` 40 for headings, 26 for the
wordmark. At the automatic maximum the hairlines are razor-thin: on black they
shimmer away and "LUMIÈRE" reads as "LU MIERE". The gold foil is a vertical
gradient clipped to the glyphs; each letter's box is padded upwards so
`background-clip: text` doesn't cut the accent off the **È**.

### Reveal system
[`Reveal.tsx`](src/components/ui/Reveal.tsx) holds one motion language for the
whole page, all on an expo-out curve:
- **`RevealLines`** — each line rises from behind a mask while it straightens.
  The *static mask* is what triggers the reveal; a line that starts fully clipped
  has zero visible area and would never intersect the viewport.
- **`RevealImage`** — a frame that *opens* the way the hero does: an arch swells
  from a small doorway to full size while the picture inside settles.
- **`ScrollWords`** — a statement that lights up word by word with scroll.
- **`Counter`** — figures such as `4.9`, `12` and `9,400+` count up on arrival.

### Particles, twice, with a reason
- **Gold dust** in the hero: warm, drifting, repelled by the cursor, and pulled
  outwards while the arch opens, which sells the feeling of passing through a door.
- **The portrait** ([`FaceParticles.tsx`](src/three/FaceParticles.tsx)): the
  photograph is sampled to 220px, gated on luminance, importance-sampled by
  brightness, and mapped to champagne-tinted points. Those same points *are* the
  photograph it resolves into, so the dissolve is seamless rather than a cross-fade.

### Performance
- **First load is ~120 KB of gzipped JavaScript** (app + React + Framer Motion),
  plus ~12 KB of CSS. Three.js, React Three Fiber and drei (~820 KB) are lazy
  chunks that load only when the particle portrait or the product stage nears the
  viewport. Don't pin them into named `manualChunks` in `vite.config.ts`: doing so
  makes the entry chunk import them statically, and every visitor pays for 3D the
  hero never uses.
- The product canvas mounts only when its section is on screen; DPR, particle
  counts and shadows drop by device tier.
- Fonts are self-hosted, and the browser fetches only the Latin subset it needs.
  No third-party requests at all.
- The intro waits (at most 1.7s) for the typeface and the portrait, then plays
  from black, so the wordmark never flashes in a fallback face.
- The intro clock follows real time, so a slow device drops frames rather than
  stretching the opening.

### Accessibility
Semantic landmarks and a real heading hierarchy (one `h1`), the slider as an
actual ARIA slider with arrow-key support, a focus-trapped booking dialog with
Escape and focus restore, a skip link, visible focus rings, `aria-pressed` /
`aria-expanded` on toggles, and decorative imagery and intro layers marked
`aria-hidden`. The stylist bios sit *over* the portrait only on devices that can
hover; on touch screens they sit below it, so they never cover a face.
`prefers-reduced-motion` turns off the opening, the marquee, the grain and the
reveals' travel.

### SEO
Full metadata, Open Graph and Twitter cards, canonical URL, and `BeautySalon`
structured data with `hasOfferCatalog` covering all thirteen services. Every word
— services, prices, bios, testimonials, hours — is real DOM text, not canvas.

### Graceful degradation
WebGL capability is probed **synchronously** before any canvas mounts, and every
canvas sits inside an error boundary. No WebGL, a lost context, or a driver quirk
means the visitor gets the photographic version of those two sections — the hero
itself never depends on WebGL.

---

## Stack

React 18 · TypeScript (strict) · Vite 5 · Framer Motion · Tailwind CSS · Zustand ·
Three.js / React Three Fiber / drei (only for the particle portrait and the 3D
products) · Bodoni Moda + Jost

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, then production build to dist/
npm run preview    # serve the production build
npm run typecheck
```

Requires Node 18+.

## Deployment

Deployed on Vercel through its Git integration: every push builds a Preview, and
`main` deploys to production. No configuration is needed: Vercel runs
`npm run build` and serves `dist/` from the domain root.

## Project structure

```
src/
├─ App.tsx                     section order + global bindings
├─ data/salon.ts               ← ALL CONTENT LIVES HERE
├─ store/
│  ├─ booking.ts               zustand booking state
│  └─ intro.ts                 signal from the intro clock (the nav waits for it)
├─ lib/
│  ├─ intro.ts                 the opening: timeline, easings, arch geometry
│  ├─ goldDust.ts              the canvas gold-dust field
│  ├─ pointer.ts               allocation-free global pointer store
│  ├─ availability.ts          deterministic placeholder diary
│  ├─ motion.ts                shared easings/variants
│  └─ webgl.ts                 synchronous capability probe
├─ hooks/useResponsive.ts      media queries, device tier, in-view, scroll lock
├─ three/
│  ├─ FaceParticles.tsx        particle portrait (sampling + shader)
│  └─ ProductStage.tsx         four procedural product models
└─ components/
   ├─ chrome/                  Nav, FloatingBook, Cursor
   ├─ booking/                 BookingFlow, BookingDialog
   ├─ sections/                Hero → Marquee → Manifesto → Services → … → Footer
   └─ ui/                      Reveal (lines, images, words, counters), Magnetic,
                               ParallaxMedia, CanvasBoundary, Bits
```

## Replacing the placeholder content

1. `src/data/salon.ts` — `SITE` (name, address, phone, hours, statistics),
   `SERVICES`, `EXPERTS`, `LOOKS`, `PRODUCTS`, `TESTIMONIALS`, `TRANSFORMATION`,
   `HOTSPOTS`.
2. `index.html` — title, meta description, canonical URL, Open Graph tags and the
   `BeautySalon` JSON-LD block (address, geo, hours, telephone, sameAs).
3. `public/img/` — swap in the studio's own photography.
   - The **hero portrait** is `face-particles.jpg`, and the same file feeds the
     particle section. It needs a dark, high-contrast frame (the luminance gate
     isolates the subject; see `CROP` in `FaceParticles.tsx`).
   - The opening's arch is framed around that portrait: `startScale()` in
     `src/lib/intro.ts` assumes a 1408×768 image with the face near the centre.
     If you change the framing, adjust its constants.
4. `src/lib/availability.ts` — replace the deterministic placeholder diary with a
   call to the salon's real booking system.

## Licence

Code: MIT. Imagery: AI-generated placeholder art, free to replace.
