'use client'

import Sections from "@/components/sections"
import { formatFullDate, parseSanityDate } from "@/lib/format-date"
import type { EventSingleProps } from "@/types/components/event-single-type"

export default function EventSingle({ event }: EventSingleProps) {
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
      <section className="container flex flex-col items-center text-center content">
        <h1 className="mb-6">{title || 'Untitled Event'}</h1>
        {soldOut && <span className="text-destructive font-semibold mb-6">Sold Out</span>}
        <div className="flex flex-col gap-2 text-xl text-muted-foreground content">
          {startDate && (
            <p>
              {formatFullDate(parseSanityDate(startDate))}
              {endDate && ` – ${formatFullDate(parseSanityDate(endDate))}`}
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
