import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { pageQuery } from '@/sanity/queries/documents/page-query'
import { SiteQuery } from '@/sanity/queries/documents/site-query'
import { resolveBrand, type BrandSiteInput } from '@/lib/brand'
import { DEFAULT_LOCALE, localizePath, toLocale, type Locale } from '@/lib/i18n'
import { markdownPath } from '@/lib/llms'
import {
  generateFAQJsonLd,
  generateWebPageJsonLd,
  generateMetadata as generateSeoMetadata,
  type PageJsonLdOverrides,
  type SeoType,
} from '@/lib/seo'
import Page from '@/components/page-single'
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

export function webPageSchemas(page: PageLike, url: string, lang: Locale = DEFAULT_LOCALE) {
  const schemas: unknown[] = []
  const pageSeo = (page?.seo || {}) as SeoType
  schemas.push(
    generateWebPageJsonLd({
      title: page.title || 'Untitled',
      description: pageSeo.metaDesc ?? undefined,
      url,
      _updatedAt: page._updatedAt ?? undefined,
      jsonLd: page.jsonLd,
      inLanguage: lang,
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

/**
 * hreflang map for a slug that exists in both languages. One language only
 * means no map at all: a lone hreflang is noise, and a fallback render must
 * not advertise itself as a translation.
 */
export function hreflangFor(
  path: string,
  alternates?: Array<string | null> | null
): Record<string, string> | undefined {
  const langs = new Set((alternates ?? []).map(toLocale))
  if (!langs.has('en') || !langs.has('es')) return undefined
  return { en: path, es: localizePath(path, 'es'), 'x-default': path }
}

export const ogLocale = (lang: Locale) => (lang === 'es' ? 'es_ES' : undefined)

/** A page in one language. No fallback; `null` when it does not exist. */
export async function fetchPage(
  slug: string,
  lang: Locale = DEFAULT_LOCALE,
  options?: { stega?: boolean }
): Promise<PageQueryResult | null> {
  const { data: page } = await sanityFetch({
    query: pageQuery,
    params: { slug, lang },
    ...(options?.stega === false && { stega: false }),
  })
  return page as PageQueryResult | null
}

/**
 * The page in the requested language, or the English one when no
 * translation exists yet. `served` tells the caller which it got, so the
 * canonical can point at the English URL for a fallback render.
 */
export async function fetchPageWithFallback(
  slug: string,
  lang: Locale,
  options?: { stega?: boolean }
): Promise<{ page: PageQueryResult | null; served: Locale }> {
  const page = await fetchPage(slug, lang, options)
  if (page || lang === DEFAULT_LOCALE) return { page, served: lang }
  return { page: await fetchPage(slug, DEFAULT_LOCALE, options), served: DEFAULT_LOCALE }
}

/** Fetch a CMS page + site settings for metadata (stega off). */
export async function fetchPageAndSite(
  slug: string,
  lang: Locale = DEFAULT_LOCALE
): Promise<{
  page: PageQueryResult | null
  served: Locale
  global: SiteQueryResult | null
}> {
  const [{ page, served }, { data: global }] = await Promise.all([
    fetchPageWithFallback(slug, lang, { stega: false }),
    sanityFetch({ query: SiteQuery, stega: false }),
  ])
  return { page, served, global: global as SiteQueryResult | null }
}

/** The public path for a page slug, before any locale prefix. */
export const pagePath = (slug: string) => (slug === 'home' ? '/' : `/${slug}`)

/** Shared metadata for CMS-driven pages (home, [slug], posts/events indexes). */
export async function pageSeoMetadata(options: {
  slug: string
  lang?: Locale
  fallbackTitle?: string
  ogType?: 'page'
  /** Override the path when the slug is not the route (events index etc.) */
  path?: string
}): Promise<Metadata> {
  const { slug, lang = DEFAULT_LOCALE, fallbackTitle, ogType = 'page' } = options
  const path = options.path ?? pagePath(slug)
  const url = localizePath(path, lang)
  /** English home always uses Site Settings SEO, never the home document's seo field. */
  const useGlobalSeoOnly = slug === 'home' && lang === DEFAULT_LOCALE
  try {
    const { page, served, global } = await fetchPageAndSite(slug, lang)
    if (!page && !useGlobalSeoOnly) {
      return generateSeoMetadata(undefined, undefined, fallbackTitle)
    }
    const fallback = served !== lang
    const pageSeo = useGlobalSeoOnly ? undefined : ((page?.seo ?? undefined) as SeoType | undefined)
    const alternates = (page as { alternates?: Array<string | null> } | null)?.alternates
    return generateSeoMetadata(
      // A fallback render is a duplicate of the English page: say so.
      fallback ? { ...pageSeo, canonicalUrl: pageSeo?.canonicalUrl || path } : pageSeo,
      (global?.seo ?? undefined) as SeoType | undefined,
      useGlobalSeoOnly ? undefined : page?.title || fallbackTitle,
      undefined,
      {
        url,
        titleSuffix: resolveBrand(global as BrandSiteInput | null).titleSuffix,
        languages: fallback ? undefined : hreflangFor(path, alternates),
        locale: ogLocale(lang),
        markdown: markdownPath(path, lang),
        // Home: Site Settings shareGraphic first; otherwise generated OG (site auto-share).
        ...(useGlobalSeoOnly
          ? {
              preferGlobalShareGraphic: true,
              ogDocument: { slug: 'home', type: ogType },
            }
          : { ogDocument: { slug, type: ogType, lang: served } }),
      }
    )
  } catch {
    return generateSeoMetadata(undefined, undefined, fallbackTitle)
  }
}

/**
 * The whole body of a CMS page route. Route files stay one line per locale so
 * English and Spanish cannot drift.
 */
export async function renderCmsPage(options: {
  slug: string
  lang?: Locale
  path?: string
  jsonLdId?: string
}) {
  const { slug, lang = DEFAULT_LOCALE } = options
  const path = options.path ?? pagePath(slug)
  let page: PageQueryResult | null = null
  try {
    ;({ page } = await fetchPageWithFallback(slug, lang))
  } catch {
    notFound()
  }
  if (!page) notFound()

  const url = localizePath(path, lang)
  return (
    <>
      <JsonLdScript
        id={options.jsonLdId ?? `${slug}-jsonld`}
        schemas={webPageSchemas(slug === 'home' ? { ...page, seo: undefined } : page, url, lang)}
      />
      <Page page={page} lang={lang} key={page._id} />
    </>
  )
}
