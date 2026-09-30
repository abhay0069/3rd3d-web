import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    // The Arena preview proxies through an *.e2b.app host — allow it.
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: isSsrBuild
        ? undefined
        : {
            // Only framer-motion is pinned (every page load needs it). three / R3F are
            // deliberately NOT listed: pinning them into named chunks made the entry chunk
            // import them statically, so every visitor downloaded ~1 MB of 3D code the
            // hero never uses. Left to Rollup they split on the lazy() boundaries
            // (particle portrait, product stage) and load only when those scroll into view.
            manualChunks: {
              motion: ['framer-motion'],
            },
          },
    },
  },
}))
