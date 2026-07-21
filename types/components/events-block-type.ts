export type EventCard = {
  _id: string
  title?: string
  slug?: string
  startDate?: string
  endDate?: string
  timeString?: string
  category?: string
  soldOut?: boolean
  location?: string
  image?: unknown
}

export type EventsBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: string
  title?: string
  /** How many events to show before Load more (default 6). */
  count?: number
  /** Server-fetched list (preferred for SEO). */
  initialEvents?: EventCard[]
  /** Design gallery: wireframe thumbs when events have no image */
  showImagePlaceholder?: boolean
}
