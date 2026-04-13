/** Event shape used by the event detail page (sections + meta), distinct from `EventType` in documents/event-type.ts (minimal slug doc). */
export type EventSingleData = {
  title?: string
  image?: unknown
  startDate?: string
  endDate?: string
  location?: string
  sections?: unknown[]
  timeString?: string
  soldOut?: boolean
}

export type EventSingleProps = {
  event: EventSingleData | null
}
