/**
 * Synchronous, cached WebGL capability probe.
 *
 * This has to run *before* the first render decides to mount a canvas: React
 * Three Fiber throws if it cannot get a context, and a visitor on a locked-down
 * browser should simply get the photographic version of the site instead.
 */
let cached: boolean | null = null

export function hasWebGL(): boolean {
  if (cached !== null) return cached
  if (typeof document === 'undefined') return (cached = false)

  try {
    const canvas = document.createElement('canvas')
    const context = (canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    cached = Boolean(context)
    // Release the probe context immediately — browsers cap live WebGL contexts.
    context?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    cached = false
  }
  return cached
}
