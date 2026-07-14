import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import {
  EXCLUDED_PAGE_SLUGS,
  eventsSitemapQuery,
  pagesSitemapQuery,
  postsSitemapQuery,
} from '@/sanity/queries/documents/sitemap-queries'

function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

/** See robots.ts — set NEXT_PUBLIC_SITE_URL in production. */
const baseUrl = normalizeBaseUrl(
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ohmni.com'
)

async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  const [pageRows, eventRows, postRows] = await Promise.all([
    client.fetch<
      Array<{ slug: string; _updatedAt?: string }>
    >(pagesSitemapQuery),
    client.fetch<
      Array<{ slug: string; _updatedAt?: string }>
    >(eventsSitemapQuery),
    client.fetch<
      Array<{ slug: string; _updatedAt?: string }>
    >(postsSitemapQuery),
  ])

  const sitemap: MetadataRoute.Sitemap = []

  sitemap.push({
    url: `${baseUrl}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  })

  for (const page of pageRows || []) {
    if (!page?.slug || EXCLUDED_PAGE_SLUGS.includes(page.slug)) continue
    sitemap.push({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page._updatedAt ? new Date(page._updatedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  }

  for (const event of eventRows || []) {
    if (!event?.slug) continue
    sitemap.push({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: event._updatedAt ? new Date(event._updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  for (const post of postRows || []) {
    if (!post?.slug) continue
    sitemap.push({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: post._updatedAt ? new Date(post._updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  return sitemap
}

export default generateSitemap
