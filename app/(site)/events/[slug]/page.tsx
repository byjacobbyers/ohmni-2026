import { Metadata } from "next"
import { QueryParams, SanityDocument } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { notFound } from "next/navigation"
import { eventsQuery, eventQuery } from "@/sanity/queries/documents/event-query"
import { SiteQuery } from "@/sanity/queries/documents/site-query"
import EventSingle from "@/components/event-single"
import type { EventSingleData } from "@/types/components/event-single-type"

import { resolveBrand, type BrandSiteInput } from '@/lib/brand'
import {
  generateEventJsonLd,
  generateMetadata as generateSeoMetadata,
} from "@/lib/seo"
import { faqJsonLdFromSections, JsonLdScript } from "@/lib/content-page"
import { parseSanityDate } from "@/lib/format-date"

export async function generateStaticParams() {
  try {
    const { data: events } = await sanityFetch({
      query: eventsQuery,
      perspective: 'published',
      stega: false,
    })
    return ((events || []) as Array<{ slug?: string }>)
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
    // stega: false keeps invisible edit-markers out of <head> metadata
    const [{ data: event }, { data: global }] = (await Promise.all([
      sanityFetch({ query: eventQuery, params: { slug: resolved.slug }, stega: false }),
      sanityFetch({ query: SiteQuery, stega: false }),
    ])) as Array<{ data: SanityDocument | null }>

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
      event?.seo,
      global?.seo,
      event?.title,
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

  let event
  try {
    ;({ data: event } = (await sanityFetch({
      query: eventQuery,
      params: { slug },
    })) as { data: SanityDocument | null })
  } catch {
    notFound()
  }

  if (!event) notFound()

  const schemas = []
  const eventSlug = typeof event.slug === 'string' ? event.slug : event.slug?.current
  const eventUrl = `/events/${eventSlug || slug}`

  if (event.startDate) {
    const startDate = parseSanityDate(event.startDate).toISOString()
    const endDate = event.endDate ? parseSanityDate(event.endDate).toISOString() : undefined
    schemas.push(generateEventJsonLd({
      title: event.title,
      description: event.seo?.metaDesc,
      url: eventUrl,
      startDate,
      endDate,
      location: event.location,
      image: event.image,
      _updatedAt: event._updatedAt,
      jsonLd: event.jsonLd,
    }))
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
