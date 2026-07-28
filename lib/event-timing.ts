import { parseSanityDate } from '@/lib/format-date'

export type EventTimingStatus = 'happening' | 'upcoming' | 'past'

export type EventTimingInput = {
  startDate?: string | null
  endDate?: string | null
}

/** Local calendar YYYY-MM-DD for comparisons (no UTC shift). */
export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayDateKey(now = new Date()): string {
  return toDateKey(now)
}

/** Inclusive end of the event range (endDate, else startDate). */
export function effectiveEndDate(event: EventTimingInput): string | null {
  const end = event.endDate?.trim() || event.startDate?.trim()
  return end || null
}

/** Calendar-day difference: laterKey - earlierKey (can be negative). */
export function calendarDaysBetween(earlierKey: string, laterKey: string): number {
  const a = parseSanityDate(earlierKey)
  const b = parseSanityDate(laterKey)
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

/**
 * - happening: today is within [start, end], or the event ended yesterday (1-day grace)
 * - upcoming: starts after today
 * - past: ended 2+ calendar days before today
 */
export function classifyEventTiming(
  event: EventTimingInput,
  todayKey = todayDateKey()
): EventTimingStatus | null {
  const start = event.startDate?.trim()
  const end = effectiveEndDate(event)
  if (!start || !end) return null

  const daysSinceEnd = calendarDaysBetween(end, todayKey)
  if (daysSinceEnd >= 2) return 'past'
  if (daysSinceEnd === 1) return 'happening'
  // end >= today
  if (start <= todayKey && end >= todayKey) return 'happening'
  if (start > todayKey) return 'upcoming'
  // start in the past but end still today/future → happening (covered above)
  return 'happening'
}

export function isListableUpcoming(event: EventTimingInput, todayKey = todayDateKey()): boolean {
  const status = classifyEventTiming(event, todayKey)
  return status === 'happening' || status === 'upcoming'
}

export function isPastEvent(event: EventTimingInput, todayKey = todayDateKey()): boolean {
  return classifyEventTiming(event, todayKey) === 'past'
}

/** Happening first, then upcoming by start date ascending (closest to today first). */
export function sortUpcomingEvents<T extends EventTimingInput>(
  events: T[],
  todayKey = todayDateKey()
): T[] {
  return [...events].sort((a, b) => {
    const statusA = classifyEventTiming(a, todayKey)
    const statusB = classifyEventTiming(b, todayKey)
    const rank = (s: EventTimingStatus | null) => (s === 'happening' ? 0 : 1)
    const rankDiff = rank(statusA) - rank(statusB)
    if (rankDiff !== 0) return rankDiff
    const startA = a.startDate || ''
    const startB = b.startDate || ''
    if (startA !== startB) return startA < startB ? -1 : 1
    const endA = effectiveEndDate(a) || ''
    const endB = effectiveEndDate(b) || ''
    return endA < endB ? -1 : endA > endB ? 1 : 0
  })
}

/** Most recently past first (effective end descending). */
export function sortPastEvents<T extends EventTimingInput>(events: T[]): T[] {
  return [...events].sort((a, b) => {
    const endA = effectiveEndDate(a) || ''
    const endB = effectiveEndDate(b) || ''
    if (endA !== endB) return endA > endB ? -1 : 1
    const startA = a.startDate || ''
    const startB = b.startDate || ''
    return startA > startB ? -1 : startA < startB ? 1 : 0
  })
}

export function filterAndSortUpcomingEvents<T extends EventTimingInput>(
  events: T[],
  todayKey = todayDateKey()
): T[] {
  return sortUpcomingEvents(
    events.filter((e) => isListableUpcoming(e, todayKey)),
    todayKey
  )
}

export function filterAndSortPastEvents<T extends EventTimingInput>(
  events: T[],
  todayKey = todayDateKey()
): T[] {
  return sortPastEvents(events.filter((e) => isPastEvent(e, todayKey)))
}
