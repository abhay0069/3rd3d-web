import * as THREE from 'three'

/**
 * Procedural, runtime-generated textures.
 *
 * The salon environment ships with ZERO downloaded assets: every surface is
 * generated on the GPU/CPU in a few milliseconds, which keeps the first paint fast
 * while still giving travertine, plaster and sheer fabric believable micro-detail.
 */

const cache = new Map<string, THREE.CanvasTexture>()

function canvas(size: number) {
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  return { c, ctx: c.getContext('2d')! }
}

function finish(c: HTMLCanvasElement, repeat = 1, key?: string) {
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(repeat, repeat)
  tex.anisotropy = 4
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  if (key) cache.set(key, tex)
  return tex
}

/** Warm travertine stone: banded veining plus fine grain. */
export function travertineTexture(repeat = 4) {
  const key = `travertine-${repeat}`
  if (cache.has(key)) return cache.get(key)!
  const size = 512
  const { c, ctx } = canvas(size)

  ctx.fillStyle = '#E6DCCB'
  ctx.fillRect(0, 0, size, size)

  // Soft horizontal strata
  for (let i = 0; i < 240; i++) {
    const y = Math.random() * size
    const h = 1 + Math.random() * 7
    const light = Math.random() > 0.5
    ctx.fillStyle = light
      ? `rgba(255, 250, 240, ${0.03 + Math.random() * 0.07})`
      : `rgba(150, 132, 108, ${0.02 + Math.random() * 0.06})`
    ctx.beginPath()
    ctx.ellipse(Math.random() * size, y, 30 + Math.random() * 180, h, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // Fine speckle
  const img = ctx.getImageData(0, 0, size, size)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 16
    d[i] += n
    d[i + 1] += n
    d[i + 2] += n * 0.9
  }
  ctx.putImageData(img, 0, 0)

  return finish(c, repeat, key)
}

/** Hand-troweled plaster with a very slight vertical fall-off. */
export function plasterTexture(repeat = 2) {
  const key = `plaster-${repeat}`
  if (cache.has(key)) return cache.get(key)!
  const size = 256
  const { c, ctx } = canvas(size)
  ctx.fillStyle = '#EDE4D6'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 900; i++) {
    const r = 6 + Math.random() * 44
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,252,246,0.05)` : `rgba(180,163,140,0.045)`
    ctx.beginPath()
    ctx.arc(Math.random() * size, Math.random() * size, r, 0, Math.PI * 2)
    ctx.fill()
  }
  return finish(c, repeat, key)
}

/** A soft round dot — used for dust motes and particle sprites. */
export function softDotTexture() {
  const key = 'soft-dot'
  if (cache.has(key)) return cache.get(key)!
  const size = 64
  const { c, ctx } = canvas(size)
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,248,236,1)')
  g.addColorStop(0.35, 'rgba(255,240,214,0.55)')
  g.addColorStop(1, 'rgba(255,235,205,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  if (key) cache.set(key, tex)
  return tex
}

export const PALETTE = {
  ivory: '#F7F3EC',
  porcelain: '#FCFAF6',
  sand: '#E9E1D4',
  beige: '#D9CCB8',
  brass: '#C8A87C',
  deepBrass: '#9A7B45',
  charcoal: '#1A1917',
  graphite: '#2A2724',
  taupe: '#8C8378',
  warmLight: '#FFE9C8',
} as const
