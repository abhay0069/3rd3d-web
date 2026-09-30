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
            manualChunks: {
              three: ['three'],
              r3f: ['@react-three/fiber', '@react-three/drei'],
              motion: ['framer-motion'],
            },
          },
    },
  },
}))
