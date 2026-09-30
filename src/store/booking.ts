import { create } from 'zustand'
import type { Service } from '../data/salon'

export type BookingStep = 1 | 2 | 3 | 4 | 5

interface BookingState {
  isOpen: boolean
  step: BookingStep
  serviceId: string | null
  stylistId: string | null
  dateKey: string | null
  time: string | null
  name: string
  phone: string
  email: string
  notes: string
  confirmed: boolean

  open: (opts?: { service?: Service | string | null; step?: BookingStep }) => void
  close: () => void
  goTo: (step: BookingStep) => void
  next: () => void
  back: () => void
  set: <K extends keyof BookingState>(key: K, value: BookingState[K]) => void
  reset: () => void
}

const initial = {
  isOpen: false,
  step: 1 as BookingStep,
  serviceId: null,
  stylistId: null,
  dateKey: null,
  time: null,
  name: '',
  phone: '',
  email: '',
  notes: '',
  confirmed: false,
}

export const useBooking = create<BookingState>((set, get) => ({
  ...initial,

  open: (opts) => {
    const id =
      typeof opts?.service === 'string' ? opts.service : (opts?.service?.id ?? get().serviceId)
    set({
      isOpen: true,
      confirmed: false,
      serviceId: id ?? null,
      step: opts?.step ?? (id ? 2 : 1),
    })
  },

  close: () => set({ isOpen: false }),

  goTo: (step) => set({ step }),

  next: () => set({ step: Math.min(5, get().step + 1) as BookingStep }),

  back: () => set({ step: Math.max(1, get().step - 1) as BookingStep }),

  set: (key, value) => set({ [key]: value } as never),

  reset: () => set({ ...initial }),
}))
