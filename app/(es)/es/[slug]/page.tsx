import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { notFound } from 'next/navigation'
import { pagesQuery } from '@/sanity/queries/documents/page-query'
import { EXCLUDED_PAGE_SLUGS } from '@/sanity/queries/documents/sitemap-queries'
import { pageSeoMetadata, renderCmsPage } from '@/lib/content-page'
import { generateMetadata as generateSeoMetadata } from '@/lib/seo'
import type { PagesQueryResult } from '@/sanity.types'

/** Only real translations are prerendered; fallbacks render on demand. */
export async function generateStaticParams() {
  try {
    const { data } = await sanityFetch({ query: pagesQuery, perspective: 'published', stega: false })
    return ((data ?? []) as PagesQueryResult)
      .filter((p) => p.language === 'es' && p.slug && !EXCLUDED_PAGE_SLUGS.includes(p.slug))
      .map((p) => ({ slug: p.slug as string }))
  } catch {
    return []
  }
}

type Props = { params: Promise<{ slug?: string }> }

const slugOf = async ({ params }: Props) => {
  const { slug } = await params
  return !slug || slug.startsWith('__') ? null : slug
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const slug = await slugOf(props)
  return slug ? pageSeoMetadata({ slug, lang: 'es' }) : generateSeoMetadata()
}

export default async function SinglePageEs(props: Props) {
  const slug = await slugOf(props)
  if (!slug) notFound()
  return renderCmsPage({ slug, lang: 'es', jsonLdId: 'page-jsonld' })
}
