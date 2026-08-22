import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { resolveBrand } from '@/lib/brand'
import { SiteQuery } from '@/sanity/queries/documents/site-query'
import type { SiteType } from '@/lib/seo'
import PresentationDeck from '@/components/presentation-deck'
import { screenId, screenIndex, type ScreenBlock } from '@/lib/presentation-screens'
import {
  presentationQuery,
  presentationRoutesQuery,
} from '@/sanity/queries/documents/presentation-query'
import type { PresentationQueryResult } from '@/sanity.types'

type Params = { slug: string; screen?: string[] }

export async function generateStaticParams() {
  try {
    const { data } = await sanityFetch({
      query: presentationRoutesQuery,
      perspective: 'published',
      stega: false,
    })
    const decks = (data ?? []) as Array<{ slug?: string; sections?: ScreenBlock[] | null }>
    return decks.flatMap((deck) => {
      if (!deck?.slug) return []
      const blocks = deck.sections ?? []
      // The bare /present/{slug} entry plus one per screen.
      return [
        { slug: deck.slug, screen: [] as string[] },
        ...blocks.map((block, i) => ({ slug: deck.slug as string, screen: [screenId(block, i)] })),
      ]
    })
  } catch {
    return []
  }
}

export default async function PresentScreen({ params }: { params: Promise<Params> }) {
  const { slug, screen } = await params
  if (!slug) notFound()

  const [{ data }, siteRes] = await Promise.all([
    sanityFetch({ query: presentationQuery, params: { slug } }),
    sanityFetch({ query: SiteQuery, stega: false }),
  ])
  const brand = resolveBrand(siteRes.data as SiteType | null)
  // Repo convention: sanityFetch's generic does not flow through interpolated
  // fragments, so the generated result type is applied here (see [slug]/page).
  const deck = (data ?? null) as PresentationQueryResult
  if (!deck) notFound()

  const blocks = ((deck.sections ?? []) as unknown as Array<
    ScreenBlock & { _type?: string } & Record<string, unknown>
  >).filter((b) => b?._type)
  if (!blocks.length) notFound()

  return (
    <PresentationDeck
      slug={slug}
      brandName={brand.name}
      brandTagline={brand.tagline}
      cornerMark={deck.cornerMark ?? undefined}
      blocks={blocks}
      index={screenIndex(blocks, screen?.[0])}
    />
  )
}
