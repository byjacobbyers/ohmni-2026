import type { Metadata } from 'next'
import { SanityDocument } from 'next-sanity'
import { sanityFetch } from '@/sanity/lib/live'
import { pageQuery } from '@/sanity/queries/documents/page-query'
import { SiteQuery } from '@/sanity/queries/documents/site-query'
import { resolveBrand, type BrandSiteInput } from '@/lib/brand'
import {
  generateFAQJsonLd,
  generateWebPageJsonLd,
  generateMetadata as generateSeoMetadata,
  type PageJsonLdOverrides,
  type SeoType,
} from '@/lib/seo'

type SectionLike = {
  _type?: string
  active?: boolean
  faqs?: Array<{ question: string; answer: unknown }>
}

type PageLike = {
  title?: string
  seo?: SeoType
  jsonLd?: PageJsonLdOverrides | null
  sections?: SectionLike[]
  _updatedAt?: string
}

/** Collect FAQ JSON-LD from active faqBlock sections on a page/post/event. */
export function faqJsonLdFromSections(sections?: SectionLike[]) {
  const faqBlocks =
    sections?.filter((s) => s._type === 'faqBlock' && s.active !== false) || []
  const allFaqs = faqBlocks.flatMap((b) => b.faqs || [])
  return generateFAQJsonLd(allFaqs)
}

export function webPageSchemas(page: PageLike, url: string) {
  const schemas: unknown[] = []
  const pageSeo = page?.seo || {}
  schemas.push(
    generateWebPageJsonLd({
      title: page.title || 'Untitled',
      description: pageSeo.metaDesc,
      url,
      _updatedAt: page._updatedAt,
      jsonLd: page.jsonLd,
    })
  )
  const faqSchema = faqJsonLdFromSections(page.sections)
  if (faqSchema) schemas.push(faqSchema)
  return schemas
}

export function JsonLdScript({
  id,
  schemas,
}: {
  id: string
  schemas: unknown[]
}) {
  if (!schemas.length) return null
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  )
}

/** Fetch a CMS page + site settings for metadata (stega off). */
export async function fetchPageAndSite(slug: string) {
  const [{ data: page }, { data: global }] = (await Promise.all([
    sanityFetch({ query: pageQuery, params: { slug }, stega: false }),
    sanityFetch({ query: SiteQuery, stega: false }),
  ])) as Array<{ data: SanityDocument | null }>
  return { page, global }
}

export async function fetchPage(slug: string) {
  const { data: page } = (await sanityFetch({
    query: pageQuery,
    params: { slug },
  })) as { data: SanityDocument | null }
  return page
}

/** Shared metadata for CMS-driven pages (home, [slug], posts/events indexes). */
export async function pageSeoMetadata(options: {
  slug: string
  url: string
  fallbackTitle?: string
  ogType?: 'page'
}): Promise<Metadata> {
  const { slug, url, fallbackTitle, ogType = 'page' } = options
  /** Home always uses Site Settings SEO — never the home page document's seo field. */
  const useGlobalSeoOnly = slug === 'home'
  try {
    const { page, global } = await fetchPageAndSite(slug)
    if (!page && !useGlobalSeoOnly) {
      return generateSeoMetadata(undefined, undefined, fallbackTitle)
    }
    return generateSeoMetadata(
      useGlobalSeoOnly ? undefined : page?.seo,
      global?.seo,
      useGlobalSeoOnly ? undefined : page?.title || fallbackTitle,
      undefined,
      {
        url,
        titleSuffix: resolveBrand(global as BrandSiteInput | null).titleSuffix,
        ...(useGlobalSeoOnly
          ? {}
          : { ogDocument: { slug, type: ogType } }),
      }
    )
  } catch {
    return generateSeoMetadata(undefined, undefined, fallbackTitle)
  }
}
