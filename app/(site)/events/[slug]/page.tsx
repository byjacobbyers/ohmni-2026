import { Metadata } from 'next'
import { QueryParams } from 'next-sanity'
import { sanityFetch } from '@/sanity/lib/live'
import { notFound } from 'next/navigation'
import { eventsQuery, eventQuery } from '@/sanity/queries/documents/event-query'
import { SiteQuery } from '@/sanity/queries/documents/site-query'
import EventSingle from '@/components/event-single'
import type { EventSingleData } from '@/types/components/event-single-type'

import { resolveBrand, type BrandSiteInput } from '@/lib/brand'
import {
  generateEventJsonLd,
  generateMetadata as generateSeoMetadata,
} from '@/lib/seo'
import { faqJsonLdFromSections, JsonLdScript } from '@/lib/content-page'
import { parseSanityDate } from '@/lib/format-date'
import type {
  EventQueryResult,
  EventsQueryResult,
  SiteQueryResult,
} from '@/sanity.types'

export async function generateStaticParams() {
  try {
    const { data: events } = await sanityFetch({
      query: eventsQuery,
      perspective: 'published',
      stega: false,
    })
    const list = (events ?? []) as EventsQueryResult
    return list
      .filter((e) => e?.slug && typeof e.slug === 'string')
      .map((e) => ({ slug: e.slug as string }))
  } catch {
    return []
  }
}

type Props = { params: Promise<{ slug: string }> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  try {
    const resolved = await params
    const [{ data: eventData }, { data: globalData }] = await Promise.all([
      sanityFetch({ query: eventQuery, params: { slug: resolved.slug }, stega: false }),
      sanityFetch({ query: SiteQuery, stega: false }),
    ])
    const event = eventData as EventQueryResult | null
    const global = globalData as SiteQueryResult | null

    if (!event) {
      const resolvedBrand = resolveBrand(global as BrandSiteInput | null)
      return generateSeoMetadata(
        undefined,
        undefined,
        undefined,
        `Event at ${resolvedBrand.name}.`
      )
    }

    const resolvedBrand = resolveBrand(global as BrandSiteInput | null)
    return generateSeoMetadata(
      (event.seo ?? undefined) as import('@/lib/seo').SeoType | undefined,
      (global?.seo ?? undefined) as import('@/lib/seo').SeoType | undefined,
      event.title ?? undefined,
      'Join us for this event.',
      {
        url: `/events/${resolved.slug}`,
        titleSuffix: resolvedBrand.titleSuffix,
        ogDocument: { slug: resolved.slug, type: 'event' },
      }
    )
  } catch {
    const resolvedBrand = resolveBrand()
    return generateSeoMetadata(
      undefined,
      undefined,
      undefined,
      `Event at ${resolvedBrand.name}.`
    )
  }
}

export default async function EventPage({ params }: { params: Promise<QueryParams> }) {
  const resolved = await params
  const slug = resolved?.slug
  if (!slug || typeof slug !== 'string') notFound()

  let event: EventQueryResult | null = null
  try {
    const { data } = await sanityFetch({
      query: eventQuery,
      params: { slug },
    })
    event = data as EventQueryResult | null
  } catch {
    notFound()
  }

  if (!event) notFound()

  const schemas = []
  const eventSlug = typeof event.slug === 'string' ? event.slug : event.slug?.current
  const eventUrl = `/events/${eventSlug || slug}`
  const title = event.title ?? 'Untitled'

  if (event.startDate) {
    const startDate = parseSanityDate(event.startDate).toISOString()
    const endDate = event.endDate ? parseSanityDate(event.endDate).toISOString() : undefined
    schemas.push(
      generateEventJsonLd({
        title,
        description: event.seo?.metaDesc ?? undefined,
        url: eventUrl,
        startDate,
        endDate,
        location: event.location ?? undefined,
        image: (event.image ?? undefined) as { asset?: { url?: string } } | undefined,
        _updatedAt: event._updatedAt,
        jsonLd: event.jsonLd,
      })
    )
  }

  const faqSchema = faqJsonLdFromSections(event.sections)
  if (faqSchema) schemas.push(faqSchema)

  return (
    <>
      <JsonLdScript id="event-jsonld" schemas={schemas} />
      <EventSingle event={event as EventSingleData} key={event._id} />
    </>
  )
}
