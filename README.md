# LUMIÈRE — Palace of Beauty

An immersive, royal beauty-house website for a luxury salon. The experience is designed as one continuous journey: a palace portal opens into sculptural hair, beauty rituals, an interactive mirror, a particle portrait, curated products and—only after the anticipation—the real salon and appointment booking.

> **Placeholder content notice.** This is a demonstration build. Names, prices, reviews, statistics, address and contact details are fictional and live primarily in [`src/data/salon.ts`](src/data/salon.ts). Replace them with the studio's verified details before launch. The included imagery is AI-generated placeholder art.

## The journey

1. **The threshold** — a monumental double-door portal, warm light, gold inlay and a continuous camera path into the house.
2. **The service worlds** — interactive hair, colour, skin, makeup and bridal rituals, connected to the real booking flow.
3. **The royal mirror** — four interactive looks change the portrait, palette and recommended services.
4. **The transformation** — a keyboard- and touch-accessible before/after reveal, followed by a portrait that gathers from particles and resolves into its photograph.
5. **The objects and the artists** — a procedural product stage, salon experts, editorial stories and social proof.
6. **The salon reveal** — the actual studio photography and procedural salon interior arrive late in the scroll.
7. **YOUR EXPERIENCE AWAITS** — a five-step, usable appointment flow, available inline and in a booking dialog.

The royal passage is one persistent React Three Fiber world rather than a succession of disconnected canvases. Its camera follows document scroll through the portal, a stylized beauty bust, slowly turning gold hair sculpture, framed mirror, service vignettes, floating product bottles and the final salon room. A fine gold filament and warm particle field tie the scenes together. Pointer movement adds restrained parallax; scroll velocity gives the camera and sculpture a little inertia.

## Stack

React 18 · TypeScript · Vite · Three.js · React Three Fiber · Drei · GSAP / ScrollTrigger · Framer Motion · Tailwind CSS · Zustand

## Performance and accessibility

- Device tier is selected from screen size, pointer type, device memory and CPU count; it scales DPR, shadows, particles, reflections and architectural detail.
- The particle portrait and product stage are lazy-loaded when their sections approach the viewport. The continuous palace scene uses procedural geometry and textures—no remote model or HDRI downloads.
- `prefers-reduced-motion` disables ambient scene movement and cursor parallax, simplifies quality and reduces scroll-triggered motion.
- WebGL support is checked before the world canvas mounts. A CSS portal fallback, real content and working booking flow remain available without WebGL.
- Service and mirror selections work with touch and keyboard. The before/after comparison supports pointer/touch dragging and arrow keys; the booking dialog has focus trapping, Escape handling and focus restoration.
- Site copy, prices and key information remain DOM text rather than being baked into the 3D canvas.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run build      # strict type-check, then production build to dist/
npm run preview
```

Requires Node 18+.

## Project map

```text
src/
├─ App.tsx                           application composition, GSAP reveals and global bindings
├─ data/salon.ts                     salon copy, services, products, looks and placeholder details
├─ store/booking.ts                  Zustand booking state
├─ hooks/useResponsive.ts            motion preferences, device tier and viewport helpers
├─ lib/                              pointer, scroll, availability and motion utilities
├─ three/
│  ├─ RoyalJourney.tsx               shared scroll-driven palace world and camera path
│  ├─ SalonRoom.tsx                  procedural final salon reveal
│  ├─ objects.tsx / textures.ts       salon furniture and generated material textures
│  ├─ FaceParticles.tsx              photographic particle portrait
│  └─ ProductStage.tsx                procedural products, loaded on approach
└─ components/
   ├─ chrome/                         preloader, navigation, cursor and booking affordance
   ├─ booking/                        five-step flow and accessible dialog
   ├─ sections/                       royal story, service worlds and salon sections
   └─ ui/                              shared reveals, magnetic controls and canvas boundary
```

## Before launch

1. Replace all fictional salon details and placeholder figures in `src/data/salon.ts`.
2. Update `index.html` metadata, canonical URL, social cards and the `BeautySalon` JSON-LD.
3. Replace `public/img/` with approved salon and stylist photography.
4. Connect `src/lib/availability.ts` to the salon's booking system and configure confirmation/contact handling.

## Licence

Code: MIT. Imagery: AI-generated placeholder art, free to replace.
