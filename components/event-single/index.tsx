'use client'

import { format } from 'date-fns'
import Sections from "@/components/sections"

const parseSanityDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

type EventType = {
  title?: string
  image?: unknown
  startDate?: string
  endDate?: string
  location?: string
  sections?: unknown[]
  timeString?: string
  soldOut?: boolean
}

export default function EventSingle({ event }: { event: EventType | null }) {
  if (!event) {
    return (
      <article className="flex min-h-screen flex-col items-center gap-y-24 pb-12">
        <div className="container text-center">
          <p className="text-lg text-muted-foreground">Event not found</p>
        </div>
      </article>
    )
  }

  const { title, startDate, endDate, location, sections = [], timeString, soldOut } = event

  return (
    <article className="flex min-h-screen flex-col items-center gap-y-24 pb-12">
      <section className="container flex flex-col items-center text-center">
        <h1 className="lg:text-7xl mb-6">{title || 'Untitled Event'}</h1>
        {soldOut && <span className="text-destructive font-semibold mb-6">Sold Out</span>}
        <div className="flex flex-col gap-2 text-xl text-muted-foreground">
          {startDate && (
            <p>
              {format(parseSanityDate(startDate), 'EEEE, MMMM d, yyyy')}
              {endDate && ` – ${format(parseSanityDate(endDate), 'EEEE, MMMM d, yyyy')}`}
            </p>
          )}
          {timeString && <p>{timeString}</p>}
          {location && <p>{location}</p>}
        </div>
      </section>
      <Sections body={sections as Array<{ _type?: string }>} />
    </article>
  )
}
