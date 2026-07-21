import type { Metadata } from 'next'
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
import type { PageQueryResult, SiteQueryResult } from '@/sanity.types'

type SectionLike = {
  _type?: string | null
  active?: boolean | null
  faqs?: Array<{ question?: string | null; answer?: unknown }> | null
}

type PageLike = {
  title?: string | null
  /** Generated SEO shapes are wider than hand-written SeoType; bridge at call sites. */
  seo?: unknown
  jsonLd?: PageJsonLdOverrides | null
  sections?: SectionLike[] | null
  _updatedAt?: string | null
}

/** Collect FAQ JSON-LD from active faqBlock sections on a page/post/event. */
export function faqJsonLdFromSections(sections?: SectionLike[] | null) {
  const faqBlocks =
    sections?.filter((s) => s._type === 'faqBlock' && s.active !== false) || []
  const allFaqs = faqBlocks.flatMap((b) =>
    (b.faqs || [])
      .filter((f): f is { question: string; answer: unknown } => Boolean(f?.question))
      .map((f) => ({ question: f.question as string, answer: f.answer }))
  )
  return generateFAQJsonLd(allFaqs)
}

export function webPageSchemas(page: PageLike, url: string) {
  const schemas: unknown[] = []
  const pageSeo = (page?.seo || {}) as SeoType
  schemas.push(
    generateWebPageJsonLd({
      title: page.title || 'Untitled',
      description: pageSeo.metaDesc ?? undefined,
      url,
      _updatedAt: page._updatedAt ?? undefined,
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
export async function fetchPageAndSite(slug: string): Promise<{
  page: PageQueryResult | null
  global: SiteQueryResult | null
}> {
  const [{ data: page }, { data: global }] = await Promise.all([
    sanityFetch({ query: pageQuery, params: { slug }, stega: false }),
    sanityFetch({ query: SiteQuery, stega: false }),
  ])
  return {
    page: page as PageQueryResult | null,
    global: global as SiteQueryResult | null,
  }
}

export async function fetchPage(slug: string): Promise<PageQueryResult | null> {
  const { data: page } = await sanityFetch({
    query: pageQuery,
    params: { slug },
  })
  return page as PageQueryResult | null
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
      useGlobalSeoOnly ? undefined : ((page?.seo ?? undefined) as SeoType | undefined),
      (global?.seo ?? undefined) as SeoType | undefined,
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
