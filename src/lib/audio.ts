/**
 * LUMIÈRE — Procedural Web Audio Soundscape
 * 
 * 100% synthesized in real time via the Web Audio API.
 * Zero external audio assets to fetch. Zero latency.
 * Provides ethereal ambient drone, glinting harmonics, and tactile acoustic clicks.
 */

class SoundEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private droneGain: GainNode | null = null
  private filterNode: BiquadFilterNode | null = null
  private oscillators: OscillatorNode[] = []
  private isMuted: boolean = true
  private isInitialized: boolean = false

  public init() {
    if (this.isInitialized || typeof window === 'undefined') return
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return

    try {
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)

      // Ambient warm filter
      this.filterNode = this.ctx.createBiquadFilter()
      this.filterNode.type = 'lowpass'
      this.filterNode.frequency.setValueAtTime(420, this.ctx.currentTime)
      this.filterNode.Q.setValueAtTime(2.5, this.ctx.currentTime)
      this.filterNode.connect(this.masterGain)

      this.droneGain = this.ctx.createGain()
      this.droneGain.gain.setValueAtTime(0.08, this.ctx.currentTime)
      this.droneGain.connect(this.filterNode)

      // Root chord frequencies (F# minor 9th: F#2, C#3, A3, G#4)
      const freqs = [92.5, 138.59, 220.0, 415.3]
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.droneGain) return
        const osc = this.ctx.createOscillator()
        osc.type = idx === 0 ? 'sine' : 'triangle'
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime)

        // Subtle detuning for analog warmth
        const detuneOsc = this.ctx.createOscillator()
        const detuneGain = this.ctx.createGain()
        detuneOsc.frequency.setValueAtTime(0.15 + idx * 0.08, this.ctx.currentTime)
        detuneGain.gain.setValueAtTime(1.8, this.ctx.currentTime)
        detuneOsc.connect(detuneGain)
        detuneGain.connect(osc.frequency)
        detuneOsc.start()

        osc.connect(this.droneGain)
        osc.start()
        this.oscillators.push(osc)
      })

      this.isInitialized = true
    } catch {
      // AudioContext blocked or unsupported
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted
    if (!this.isInitialized) {
      this.init()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    if (this.masterGain && this.ctx) {
      const target = muted ? 0 : 0.45
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.25)
    }
  }

  public getMuted() {
    return this.isMuted
  }

  /** Modulate the ambient filter cutoff with scroll velocity (creates breathing room) */
  public updateVelocity(velocity: number) {
    if (!this.ctx || !this.filterNode || this.isMuted) return
    const freq = Math.min(2200, 380 + Math.abs(velocity) * 850)
    this.filterNode.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1)
  }

  /** Shimmer chime for hovering interactive concepts */
  public playChime(freq = 880) {
    if (this.isMuted || !this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.35)

      gain.gain.setValueAtTime(0.04, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5)

      osc.connect(gain)
      gain.connect(this.masterGain)
      osc.start(now)
      osc.stop(now + 0.5)
    } catch {
      // Audio glitch safeguard
    }
  }

  /** Resonant crystal bell for chapter transitions and transformations */
  public playTransition(harmonic = 554.37) {
    if (this.isMuted || !this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime
      const notes = [harmonic, harmonic * 1.25, harmonic * 1.5]
      notes.forEach((f, idx) => {
        if (!this.ctx || !this.masterGain) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(f, now + idx * 0.04)

        gain.gain.setValueAtTime(0.03, now + idx * 0.04)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8 + idx * 0.2)

        osc.connect(gain)
        gain.connect(this.masterGain)
        osc.start(now + idx * 0.04)
        osc.stop(now + 1.2)
      })
    } catch {
      // Audio glitch safeguard
    }
  }

  /** Tactile click for buttons */
  public playClick() {
    if (this.isMuted || !this.ctx || !this.masterGain) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(320, now)
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.06)

      gain.gain.setValueAtTime(0.05, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06)

      osc.connect(gain)
      gain.connect(this.masterGain)
      osc.start(now)
      osc.stop(now + 0.07)
    } catch {
      // Audio glitch safeguard
    }
  }
}

export const sound = new SoundEngine()
