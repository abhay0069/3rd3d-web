# LŪMEN // ÍNDEX

An immersive, single-screen hero for a modern private-banking / DeFi brand. The experience pairs a cinematic full-bleed video with a custom React Three Fiber glass-index core, a precision grid, and responsive wallet navigation.

## Run locally

```bash
npm install
npm run dev
npm run build
```

## Experience notes

- The page intentionally contains one `100svh` hero section with no scrolling.
- The full-bleed hero video uses the CloudFront source from the design brief; it is muted, looping, and inline for autoplay compatibility.
- The main visual is a procedural Three.js model (faceted glass core, fine orbital rings, and a point constellation). It uses the repository's existing Three.js / React Three Fiber stack and is lazy-loaded for desktop-sized screens.
- The 20px / 35px page gutter, responsive navigation, staggered mobile menu, grid intersections, node labels, and chamfered report card are composed from DOM and SVG so the page remains crisp and accessible.
- The display wordmark/headline use Graphik LCG; interface copy uses Manrope.
- `prefers-reduced-motion` is respected by the CSS entrance choreography and 3D motion.

The design brief does not specify a downloadable `.glb` asset. The hero therefore uses an original in-code 3D index core rather than the salon-specific procedural room that was previously in the repository.
