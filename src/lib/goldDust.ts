/**
 * Gold dust: a few dozen warm motes drifting through the dark.
 *
 * One 2D canvas, one pre-rendered glow sprite, additive blending. During the
 * intro the field is pulled outwards from the arch ("burst"), which is what
 * sells the feeling of the camera passing through the doorway.
 */
interface Mote {
  x: number
  y: number
  /** depth: 0.25 (far, dim, slow) … 1 (near, bright, fast) */
  z: number
  size: number
  speed: number
  phase: number
  twinkle: number
}

export interface DustFrame {
  /** overall visibility 0…1 */
  intensity: number
  /** 0…1 radial pull outwards from (cx, cy) */
  burst: number
  cx: number
  cy: number
  /** pointer position in CSS px, or null when there is no fine pointer */
  pointer: { x: number; y: number } | null
}

function makeSprite(size = 64) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255, 238, 200, 1)')
  grad.addColorStop(0.18, 'rgba(255, 214, 150, 0.85)')
  grad.addColorStop(0.5, 'rgba(214, 168, 100, 0.22)')
  grad.addColorStop(1, 'rgba(200, 150, 80, 0)')
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return c
}

export class GoldDust {
  private ctx: CanvasRenderingContext2D
  private sprite: HTMLCanvasElement
  private motes: Mote[] = []
  private w = 0
  private h = 0
  private dpr = 1

  constructor(
    private canvas: HTMLCanvasElement,
    private count: number,
  ) {
    this.ctx = canvas.getContext('2d', { alpha: true })!
    this.sprite = makeSprite()
  }

  resize(w: number, h: number, dpr: number) {
    this.w = w
    this.h = h
    this.dpr = dpr
    this.canvas.width = Math.max(1, Math.round(w * dpr))
    this.canvas.height = Math.max(1, Math.round(h * dpr))
    if (!this.motes.length) {
      for (let i = 0; i < this.count; i++) this.motes.push(this.spawn(true))
    }
  }

  private spawn(anywhere: boolean): Mote {
    const z = 0.25 + Math.pow(Math.random(), 1.6) * 0.75
    return {
      x: Math.random() * this.w,
      y: anywhere ? Math.random() * this.h : this.h + 20 + Math.random() * 60,
      z,
      size: (6 + Math.random() * 16) * (0.55 + z),
      speed: 6 + Math.random() * 16,
      phase: Math.random() * Math.PI * 2,
      twinkle: 0.6 + Math.random() * 1.6,
    }
  }

  clear() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  frame(dt: number, time: number, f: DustFrame) {
    const { ctx } = this
    if (f.intensity < 0.004) {
      this.clear()
      return
    }
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.clearRect(0, 0, this.w, this.h)
    ctx.globalCompositeOperation = 'lighter'

    const R = 170
    for (const m of this.motes) {
      // slow organic drift, always gently upwards
      m.x += Math.sin(time * 0.33 + m.phase) * 5 * dt * m.z
      m.y -= (m.speed + Math.cos(time * 0.27 + m.phase * 1.7) * 3) * dt * m.z

      if (f.pointer) {
        const dx = m.x - f.pointer.x
        const dy = m.y - f.pointer.y
        const d = Math.hypot(dx, dy)
        if (d < R && d > 0.001) {
          const push = (1 - d / R) * 90 * dt * m.z
          m.x += (dx / d) * push
          m.y += (dy / d) * push
        }
      }

      if (m.y < -40 || m.x < -60 || m.x > this.w + 60) {
        Object.assign(m, this.spawn(false))
      }

      // the "camera passes through the door" pull, strongest on near motes
      const pull = 1 + f.burst * m.z * 1.55
      const x = f.cx + (m.x - f.cx) * pull
      const y = f.cy + (m.y - f.cy) * pull
      const s = m.size * (1 + f.burst * m.z * 0.9)
      const tw = 0.5 + 0.5 * Math.sin(time * m.twinkle + m.phase * 3)
      const a = f.intensity * (0.2 + 0.8 * tw) * (0.3 + 0.7 * m.z)

      ctx.globalAlpha = Math.min(1, a)
      ctx.drawImage(this.sprite, x - s / 2, y - s / 2, s, s)
    }
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
  }
}
