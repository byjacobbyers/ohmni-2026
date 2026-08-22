import { MetadataRoute } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { brand } from '@/lib/brand'
import { localizePath, toLocale, type Locale } from '@/lib/i18n'
import {
  EXCLUDED_PAGE_SLUGS,
  eventsSitemapQuery,
  pagesSitemapQuery,
  postsSitemapQuery,
} from '@/sanity/queries/documents/sitemap-queries'

/**
 * The sitemap sits outside the (site) route group, so it does not inherit that
 * segment's revalidate. Without this it is fully static and only refreshes on
 * deploy, which means a page published in the CMS never reaches the sitemap.
 */
export const revalidate = 3600

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '')
}

/** See robots.ts — set NEXT_PUBLIC_SITE_URL in production. */
const baseUrl = normalizeBaseUrl(
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_SITE_URL || brand.fallbackSiteUrl
)

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i

function safeDate(value?: string): Date {
  if (!value) return new Date()
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date() : date
}

function normalizeSlug(slug: unknown): string | null {
  if (typeof slug !== 'string') return null
  const trimmed = slug.replace(/^\/+|\/+$/g, '')
  return SLUG_RE.test(trimmed) ? trimmed : null
}

type SitemapRow = { slug?: string | null; _updatedAt?: string | null; language?: string | null }

async function fetchRows(query: string): Promise<SitemapRow[]> {
  try {
    const { data } = await sanityFetch({
      query,
      stega: false,
      perspective: 'published',
    })
    return Array.isArray(data) ? (data as SitemapRow[]) : []
  } catch {
    // A thrown fetch used to 500 the whole /sitemap.xml — Google then stops reading it.
    return []
  }
}

async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  const [pageRows, eventRows, postRows] = await Promise.all([
    fetchRows(pagesSitemapQuery),
    fetchRows(eventsSitemapQuery),
    fetchRows(postsSitemapQuery),
  ])

  const sitemap: MetadataRoute.Sitemap = []

  /**
   * One entry per language a path exists in. When both exist, each entry
   * carries the hreflang pair, which is how Google wants alternates declared
   * in a sitemap.
   */
  const pushLocalized = (
    path: string,
    rows: SitemapRow[],
    base: Omit<MetadataRoute.Sitemap[number], 'url' | 'alternates' | 'lastModified'>
  ) => {
    const langs = new Map<Locale, SitemapRow>()
    for (const row of rows) langs.set(toLocale(row.language), row)
    if (!langs.has('en')) return
    const both = langs.has('es')
    const alternates = both
      ? { languages: { en: `${baseUrl}${localizePath(path, 'en')}`, es: `${baseUrl}${localizePath(path, 'es')}` } }
      : undefined
    for (const [lang, row] of langs) {
      sitemap.push({
        url: `${baseUrl}${localizePath(path, lang)}`,
        lastModified: safeDate(row._updatedAt ?? undefined),
        ...base,
        ...(alternates && { alternates }),
      })
    }
  }

  const bySlug = (rows: SitemapRow[]) => {
    const groups = new Map<string, SitemapRow[]>()
    for (const row of rows) {
      const slug = normalizeSlug(row.slug)
      if (!slug) continue
      groups.set(slug, [...(groups.get(slug) ?? []), row])
    }
    return groups
  }

  const pages = bySlug(pageRows)
  pushLocalized('/', pages.get('home') ?? [{ slug: 'home', language: 'en' }], {
    changeFrequency: 'weekly',
    priority: 1,
  })

  for (const [slug, rows] of pages) {
    if (EXCLUDED_PAGE_SLUGS.includes(slug)) continue
    pushLocalized(`/${slug}`, rows, { changeFrequency: 'monthly', priority: 0.8 })
  }

  if (eventRows.length > 0) {
    sitemap.push({
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
    sitemap.push({
      url: `${baseUrl}/past-events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    })
  }

  for (const event of eventRows) {
    const slug = normalizeSlug(event.slug)
    if (!slug) continue
    sitemap.push({
      url: `${baseUrl}/events/${slug}`,
      lastModified: safeDate(event._updatedAt ?? undefined),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  if (postRows.length > 0) {
    pushLocalized('/posts', pages.get('posts') ?? [{ slug: 'posts', language: 'en' }], {
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  for (const [slug, rows] of bySlug(postRows)) {
    pushLocalized(`/posts/${slug}`, rows, { changeFrequency: 'weekly', priority: 0.7 })
  }

  return sitemap
}

export default generateSitemap
