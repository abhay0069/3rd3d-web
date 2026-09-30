import { EXPERTS, TIME_SLOTS } from '../data/salon'

/**
 * Deterministic placeholder availability.
 *
 * A real deployment would fetch this from the salon's booking system; until then
 * we generate a stable, believable calendar so the interface behaves honestly:
 * closed on Mondays, some slots already taken, stylists with different diaries.
 */

const DAY_MS = 86_400_000

/** Stable hash so the same date + stylist always produces the same diary. */
function seeded(key: string) {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  // xorshift-ish finaliser
  h ^= h >>> 13
  h = Math.imul(h, 0x5bd1e995)
  h ^= h >>> 15
  return (h >>> 0) / 4294967295
}

export const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export const isClosed = (date: Date) => date.getDay() === 1 // Monday

export function isSlotAvailable(date: Date, time: string, stylistId: string | null) {
  if (isClosed(date)) return false
  const key = `${toDateKey(date)}|${time}|${stylistId ?? 'any'}`
  const r = seeded(key)
  // Sundays are busier; lunch hour is often gone
  const pressure = date.getDay() === 0 ? 0.42 : 0.3
  const lunch = time === '13:30' ? 0.18 : 0
  return r > pressure + lunch
}

export interface DayOption {
  date: Date
  key: string
  closed: boolean
  hasAvailability: boolean
}

/** The next `count` bookable days, starting today. */
export function upcomingDays(count = 14, stylistId: string | null = null): DayOption[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Array.from({ length: count }).map((_, offset) => {
    const date = new Date(today.getTime() + offset * DAY_MS)
    const closed = isClosed(date)
    return {
      date,
      key: toDateKey(date),
      closed,
      hasAvailability:
        !closed && TIME_SLOTS.some((slot) => isSlotAvailable(date, slot, stylistId)),
    }
  })
}

export function availableSlots(date: Date, stylistId: string | null) {
  return TIME_SLOTS.map((time) => ({ time, available: isSlotAvailable(date, time, stylistId) }))
}

/** Which stylists can actually deliver a given service. */
export function stylistsForCategory(category?: string | null) {
  if (!category) return EXPERTS
  const matches = EXPERTS.filter((e) => e.services.includes(category as never))
  return matches.length ? matches : EXPERTS
}

export const formatDay = (date: Date) =>
  new Intl.DateTimeFormat('en-IN', { weekday: 'short' }).format(date)

export const formatDayNumber = (date: Date) =>
  new Intl.DateTimeFormat('en-IN', { day: '2-digit' }).format(date)

export const formatMonth = (date: Date) =>
  new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(date)

export const formatLongDate = (date: Date) =>
  new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)
