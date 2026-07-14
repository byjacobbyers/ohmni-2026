import { groq } from 'next-sanity'

/**
 * Page slugs that are not standalone indexable routes: home is served by the
 * root route; quiz and resources are embedded elsewhere. Shared by sitemap.ts
 * and [slug]/page.tsx generateStaticParams so the lists cannot drift.
 */
export const EXCLUDED_PAGE_SLUGS = ['home', 'quiz', 'resources']

/** Lightweight slug + updatedAt only (sitemap / SEO). */
export const pagesSitemapQuery = groq`*[_type == "page" && defined(slug.current)] {
  "slug": slug.current,
  _updatedAt
}`

export const eventsSitemapQuery = groq`*[_type == "event" && defined(slug.current)] {
  "slug": slug.current,
  _updatedAt
}`

export const postsSitemapQuery = groq`*[_type == "post" && defined(slug.current)] {
  "slug": slug.current,
  _updatedAt
}`
