import { MetadataRoute } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { brand } from '@/lib/brand'
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

type SitemapRow = { slug?: string | null; _updatedAt?: string | null }

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

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  for (const page of pageRows) {
    const slug = normalizeSlug(page.slug)
    if (!slug || EXCLUDED_PAGE_SLUGS.includes(slug)) continue
    sitemap.push({
      url: `${baseUrl}/${slug}`,
      lastModified: safeDate(page._updatedAt ?? undefined),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
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
    sitemap.push({
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  for (const post of postRows) {
    const slug = normalizeSlug(post.slug)
    if (!slug) continue
    sitemap.push({
      url: `${baseUrl}/posts/${slug}`,
      lastModified: safeDate(post._updatedAt ?? undefined),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  return sitemap
}

export default generateSitemap
