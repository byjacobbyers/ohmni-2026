'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import SanityImage from '@/components/sanity-image'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'
import { formatShortDate, parseSanityDate } from '@/lib/format-date'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import type { EventCard, EventsBlockProps } from '@/types/components/events-block-type'
import type { SanityImageSource } from '@/types/components/sanity-image-type'

function formatEventDates(startDate?: string, endDate?: string): string | null {
  if (!startDate) return null
  const start = formatShortDate(parseSanityDate(startDate))
  if (!endDate || endDate === startDate) return start
  return `${start} – ${formatShortDate(parseSanityDate(endDate))}`
}

const DEFAULT_PAGE_SIZE = 6

export default function EventsBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  title,
  count = DEFAULT_PAGE_SIZE,
  initialEvents,
  showImagePlaceholder = false,
}: EventsBlockProps) {
  if (active === false) return null

  const allEvents: EventCard[] = (initialEvents ?? []).filter((e) => e?.slug)
  const pageSize = Math.max(1, count || DEFAULT_PAGE_SIZE)

  const [visibleCount, setVisibleCount] = useState(pageSize)

  if (allEvents.length === 0) {
    return (
      <section
        id={anchor || `events-block-${componentIndex}`}
        className="events-block w-full px-5 py-16 md:py-24 flex justify-center"
      >
        <p className="container text-center text-muted-foreground">No events published yet.</p>
      </section>
    )
  }

  const displayedEvents = allEvents.slice(0, visibleCount)
  const hasMore = visibleCount < allEvents.length

  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)
  const buttonVariant = bg === 'secondary' ? 'secondary' : 'default'

  return (
    <section
      id={anchor || `events-block-${componentIndex}`}
      className={`events-block w-full overflow-x-hidden px-5 py-16 md:py-24 flex justify-center ${sectionClass}`}
    >
      {showTexture ? <TextureSectionBackdrop /> : null}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className={`relative z-10 container flex w-full max-w-3xl flex-col items-stretch ${innerLiftClass}`}
      >
        {title ? (
          <h2 className="mb-8 w-full text-center md:mb-12">{title}</h2>
        ) : null}

        <ul className="flex w-full list-none flex-col gap-6 p-0">
          {displayedEvents.map((event) => {
            const meta = [
              event.category,
              formatEventDates(event.startDate, event.endDate),
              event.timeString,
              event.location,
            ]
              .filter(Boolean)
              .join(' · ')

            return (
              <li key={event._id} className="list-none">
                <Link href={`/events/${event.slug}`} className="group block no-underline">
                  <Card className="flex w-full flex-col overflow-hidden rounded-md border border-border bg-card text-card-foreground transition-colors group-hover:border-primary sm:flex-row">
                    {event.image || showImagePlaceholder ? (
                      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-foreground sm:aspect-square sm:w-40 md:w-48">
                        {event.image ? (
                          <SanityImage
                            image={event.image as SanityImageSource}
                            fill
                            sizes="(max-width: 640px) 100vw, 192px"
                            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <ImagePlaceholder
                            aspect="auto"
                            marks={false}
                            label="IMG"
                            className="absolute inset-0 h-full rounded-none border-0"
                          />
                        )}
                      </div>
                    ) : null}
                    <CardContent className="flex w-full flex-col justify-center gap-2 px-4 py-5 sm:px-6">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        {meta ? (
                          <p className="text-sm tracking-wide text-muted-foreground uppercase no-underline">
                            {meta}
                          </p>
                        ) : null}
                        {event.soldOut ? (
                          <span className="text-sm font-semibold tracking-wide text-destructive uppercase no-underline">
                            Sold out
                          </span>
                        ) : null}
                      </div>
                      <h3 className="text-h4 no-underline">{event.title}</h3>
                      <span className="mt-1 text-sm font-medium tracking-wider text-primary uppercase no-underline">
                        Learn more
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            )
          })}
        </ul>

        {hasMore ? (
          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              variant={buttonVariant}
              onClick={() => setVisibleCount((n) => Math.min(n + pageSize, allEvents.length))}
            >
              Load more
            </Button>
          </div>
        ) : null}
      </motion.div>
    </section>
  )
}
