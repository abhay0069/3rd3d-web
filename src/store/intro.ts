import { create } from 'zustand'

/**
 * Tiny cross-component signal from the hero's intro clock.
 * The navigation waits for `navIn` so it arrives *after* the arch has opened.
 */
interface IntroState {
  navIn: boolean
  done: boolean
  setNavIn: () => void
  setDone: () => void
}

export const useIntro = create<IntroState>((set) => ({
  navIn: false,
  done: false,
  setNavIn: () => set({ navIn: true }),
  setDone: () => set({ navIn: true, done: true }),
}))
