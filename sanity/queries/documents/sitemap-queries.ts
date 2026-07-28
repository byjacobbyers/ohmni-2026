import { groq } from 'next-sanity'

/**
 * Page slugs that are not standalone indexable routes under /[slug]:
 * home → /, posts → /posts, events → /events; quiz and resources are embedded elsewhere.
 * Shared by sitemap.ts and [slug]/page.tsx generateStaticParams.
 */
export const EXCLUDED_PAGE_SLUGS = [
  'home',
  'posts',
  'events',
  'past-events',
  'quiz',
  'resources',
]

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
