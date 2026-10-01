import { create } from 'zustand'
import { sound } from '../lib/audio'

export type ChapterId =
  | 'arrive'
  | 'discover'
  | 'explore'
  | 'transform'
  | 'archive'
  | 'artisans'
  | 'sanctuary'
  | 'book'

export type Mood =
  | 'noir'
  | 'hair'
  | 'color'
  | 'skin'
  | 'makeup'
  | 'bridal'
  | 'gold'
  | 'calm'

export interface ModalImage {
  src: string
  title: string
  subtitle?: string
  aspect?: string
}

interface StoryState {
  currentChapter: ChapterId
  chapterIndex: number
  scrollProgress: number
  scrollVelocity: number
  activeMood: Mood
  hoveredService: string | null
  transformationProgress: number
  cursorMode: 'default' | 'explore' | 'drag' | 'view' | 'book' | 'pointer'
  cursorText: string
  soundEnabled: boolean
  quickNavOpen: boolean
  activeModalImage: ModalImage | null

  // Actions
  setChapter: (chapter: ChapterId, index: number) => void
  setScrollProgress: (progress: number, velocity?: number) => void
  setMood: (mood: Mood) => void
  setHoveredService: (service: string | null) => void
  setTransformationProgress: (progress: number) => void
  setCursor: (mode: 'default' | 'explore' | 'drag' | 'view' | 'book' | 'pointer', text?: string) => void
  toggleSound: () => void
  setQuickNavOpen: (open: boolean) => void
  openModalImage: (image: ModalImage | null) => void
}

export const CHAPTERS: { id: ChapterId; num: string; title: string }[] = [
  { id: 'arrive', num: '01', title: 'The Entrance' },
  { id: 'discover', num: '02', title: 'The Awakening' },
  { id: 'explore', num: '03', title: 'The Spectrum' },
  { id: 'transform', num: '04', title: 'The Shift' },
  { id: 'archive', num: '05', title: 'The Archive' },
  { id: 'artisans', num: '06', title: 'The Artisans' },
  { id: 'sanctuary', num: '07', title: 'The Sanctuary' },
  { id: 'book', num: '08', title: 'The Arrival' },
]

export const useStory = create<StoryState>((set, get) => ({
  currentChapter: 'arrive',
  chapterIndex: 0,
  scrollProgress: 0,
  scrollVelocity: 0,
  activeMood: 'noir',
  hoveredService: null,
  transformationProgress: 0.5,
  cursorMode: 'default',
  cursorText: '',
  soundEnabled: false,
  quickNavOpen: false,
  activeModalImage: null,

  setChapter: (chapter, index) => {
    if (get().currentChapter !== chapter) {
      sound.playTransition(440 + index * 40)
    }
    set({ currentChapter: chapter, chapterIndex: index })
  },

  setScrollProgress: (progress, velocity = 0) => {
    sound.updateVelocity(velocity)
    set({ scrollProgress: progress, scrollVelocity: velocity })
  },

  setMood: (mood) => {
    if (get().activeMood !== mood) {
      sound.playChime(650)
    }
    set({ activeMood: mood })
  },

  setHoveredService: (service) => set({ hoveredService: service }),

  setTransformationProgress: (progress) => set({ transformationProgress: progress }),

  setCursor: (mode, text = '') => set({ cursorMode: mode, cursorText: text }),

  toggleSound: () => {
    const next = !get().soundEnabled
    sound.setMuted(!next)
    if (next) {
      sound.playTransition(523.25)
    }
    set({ soundEnabled: next })
  },

  setQuickNavOpen: (open) => {
    sound.playClick()
    set({ quickNavOpen: open })
  },

  openModalImage: (image) => {
    if (image) sound.playTransition(659.25)
    else sound.playClick()
    set({ activeModalImage: image })
  },
}))
