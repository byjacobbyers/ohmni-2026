import { Metadata } from 'next'
import { urlFor } from '@/sanity/lib/image'
import { getPublicSiteUrl } from '@/lib/site-url'
import { brand } from '@/lib/brand'

function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

const baseUrl = normalizeBaseUrl(getPublicSiteUrl())

export function buildUrl(path?: string): string {
  if (!path) return baseUrl
  if (path.startsWith('http')) return path
  const slash = path.startsWith('/') ? '' : '/'
  return `${baseUrl}${slash}${path}`
}

const defaultTitle = brand.name
const defaultDescription = brand.description
const defaultOgImage = `${baseUrl}/opengraph-image.png`

export type SeoType = {
  metaTitle?: string
  metaDesc?: string
  noIndex?: boolean
  /** Per-page canonical override; empty means the page's own URL */
  canonicalUrl?: string
  shareGraphic?: {
    asset?: { url?: string }
  }
  autoShareImage?: {
    heading?: unknown
    background?: string
  }
  /** Legacy flat keys (pre–autoShareImage); still read via GROQ coalesce */
  ogImageHeading?: unknown
  ogImageBackground?: string
}

export type OgDocumentRef = { slug: string; type: 'page' | 'event' | 'post' }

export function buildGeneratedOgImageUrl(ref: OgDocumentRef): string {
  const qs = new URLSearchParams({ slug: ref.slug, type: ref.type })
  return buildUrl(`/api/og?${qs.toString()}`)
}

function safeShareGraphicUrl(
  share: SeoType['shareGraphic'] | undefined
): string | null {
  if (
    !share ||
    typeof share !== 'object' ||
    !('asset' in share) ||
    !share.asset ||
    typeof share.asset !== 'object' ||
    share.asset === null ||
    !('url' in share.asset) ||
    typeof (share.asset as { url?: unknown }).url !== 'string'
  ) {
    return null
  }
  try {
    return urlFor(share as Parameters<typeof urlFor>[0]).width(1200).height(630).url()
  } catch {
    return null
  }
}

/**
 * Page-level custom upload wins, then generated OG for this document (so per-page
 * auto share + headings work), then site-wide upload, then static default.
 * Previously global shareGraphic sat before /api/og and blocked all inner pages.
 */
function resolveOgImageUrl(pageSeo?: SeoType, globalSeo?: SeoType, ogDocument?: OgDocumentRef): string {
  const pageGraphic = safeShareGraphicUrl(pageSeo?.shareGraphic)
  if (pageGraphic) return pageGraphic

  if (ogDocument) {
    return buildGeneratedOgImageUrl(ogDocument)
  }

  const globalGraphic = safeShareGraphicUrl(globalSeo?.shareGraphic)
  if (globalGraphic) return globalGraphic

  return defaultOgImage
}

export function generateMetadata(
  pageSeo?: SeoType,
  globalSeo?: SeoType,
  fallbackTitle?: string,
  fallbackDescription?: string,
  options?: {
    url?: string
    titleSuffix?: string
    ogDocument?: OgDocumentRef
    /** Set for posts: emits og:type article with publish metadata */
    article?: { publishedTime?: string; modifiedTime?: string; author?: string }
  }
): Metadata {
  const title = pageSeo?.metaTitle || globalSeo?.metaTitle || fallbackTitle || defaultTitle
  const description = pageSeo?.metaDesc || globalSeo?.metaDesc || fallbackDescription || defaultDescription
  const noIndex = pageSeo?.noIndex ?? false
  const ogImage = resolveOgImageUrl(pageSeo, globalSeo, options?.ogDocument)
  const pageUrl = options?.url ? buildUrl(options.url) : baseUrl
  const finalTitle = options?.titleSuffix ? `${title}${options.titleSuffix}` : title
  // Per-page override wins; otherwise the page canonicalizes to its own URL
  const canonical = pageSeo?.canonicalUrl ? buildUrl(pageSeo.canonicalUrl) : pageUrl

  return {
    metadataBase: new URL(baseUrl),
    title: finalTitle,
    description,
    alternates: { canonical },
    robots: { index: !noIndex, follow: true },
    openGraph: {
      title: finalTitle,
      description,
      url: pageUrl,
      images: [{ url: ogImage, width: 1200, height: 630, alt: finalTitle }],
      ...(options?.article && {
        type: 'article',
        publishedTime: options.article.publishedTime,
        modifiedTime: options.article.modifiedTime,
        ...(options.article.author && { authors: [options.article.author] }),
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description,
      images: [ogImage],
    },
  }
}

export type PageJsonLdType =
  | 'WebPage'
  | 'AboutPage'
  | 'ContactPage'
  | 'CollectionPage'
  | 'FAQPage'
  | 'Service'

export type PageJsonLdOverrides = {
  pageType?: PageJsonLdType | string
  name?: string
  description?: string
}

export type ArticleJsonLdOverrides = {
  headline?: string
  description?: string
  authorName?: string
  articleSection?: string
}

export type EventJsonLdOverrides = {
  description?: string
  eventStatus?: string
  eventAttendanceMode?: string
  organizerName?: string
  organizerUrl?: string
  offersUrl?: string
  offersPrice?: string
  offersPriceCurrency?: string
  offersAvailability?: string
}

const PAGE_JSON_LD_TYPES = new Set<string>([
  'WebPage',
  'AboutPage',
  'ContactPage',
  'CollectionPage',
  'FAQPage',
  'Service',
])

/** Normalize Schema.org enum values to full URLs when editors pick short codes. */
function schemaOrgEnum(value: string | undefined) {
  if (!value) return undefined
  if (value.startsWith('http')) return value
  return `https://schema.org/${value}`
}

export function generateWebPageJsonLd(data: {
  title: string
  description?: string
  url: string
  seo?: { shareGraphic?: { asset?: { url: string } } }
  _updatedAt?: string
  jsonLd?: PageJsonLdOverrides | null
}) {
  const pageUrl = data.url.startsWith('http') ? data.url : buildUrl(data.url)
  const overrides = data.jsonLd
  const rawType = overrides?.pageType || 'WebPage'
  const pageType = PAGE_JSON_LD_TYPES.has(rawType) ? rawType : 'WebPage'
  const name = overrides?.name || data.title
  const description = overrides?.description || data.description

  return {
    '@context': 'https://schema.org',
    '@type': pageType,
    name,
    ...(description && { description }),
    url: pageUrl,
    ...(data._updatedAt && { dateModified: new Date(data._updatedAt).toISOString() }),
  }
}

export function generateArticleJsonLd(data: {
  title: string
  description?: string
  url: string
  publishedAt?: string
  author?: string
  category?: string
  image?: { asset?: { url?: string } }
  _updatedAt?: string
  jsonLd?: ArticleJsonLdOverrides | null
}) {
  const articleUrl = data.url.startsWith('http') ? data.url : buildUrl(data.url)
  const overrides = data.jsonLd
  const headline = overrides?.headline || data.title
  const description = overrides?.description || data.description
  const authorName = overrides?.authorName || data.author
  const articleSection = overrides?.articleSection || data.category

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    ...(description && { description }),
    url: articleUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    ...(data.publishedAt && { datePublished: data.publishedAt }),
    ...(authorName && { author: { '@type': 'Person', name: authorName } }),
    ...(articleSection && { articleSection }),
    ...(data.image?.asset?.url && {
      image: urlFor(data.image.asset as Parameters<typeof urlFor>[0]).width(1200).height(630).url(),
    }),
    ...(data._updatedAt && { dateModified: new Date(data._updatedAt).toISOString() }),
  }
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  if (!items.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : buildUrl(item.url),
    })),
  }
}

export function generateEventJsonLd(data: {
  title: string
  description?: string
  url: string
  startDate: string
  endDate?: string
  location?: string
  image?: { asset?: { url?: string } }
  _updatedAt?: string
  jsonLd?: EventJsonLdOverrides | null
}) {
  const eventUrl = data.url.startsWith('http') ? data.url : buildUrl(data.url)
  const overrides = data.jsonLd
  const description = overrides?.description || data.description
  const eventStatus = schemaOrgEnum(overrides?.eventStatus)
  const eventAttendanceMode = schemaOrgEnum(overrides?.eventAttendanceMode)
  const offersAvailability = schemaOrgEnum(overrides?.offersAvailability)

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: data.title,
    ...(description && { description }),
    url: eventUrl,
    startDate: data.startDate,
    ...(data.endDate && { endDate: data.endDate }),
    ...(data.location && { location: { '@type': 'Place', name: data.location } }),
    ...(eventStatus && { eventStatus }),
    ...(eventAttendanceMode && { eventAttendanceMode }),
    ...(data.image?.asset?.url && {
      image: urlFor(data.image.asset as Parameters<typeof urlFor>[0]).width(1200).height(630).url(),
    }),
    ...(data._updatedAt && { dateModified: new Date(data._updatedAt).toISOString() }),
  }

  if (overrides?.organizerName || overrides?.organizerUrl) {
    schema.organizer = {
      '@type': 'Organization',
      ...(overrides.organizerName && { name: overrides.organizerName }),
      ...(overrides.organizerUrl && { url: overrides.organizerUrl }),
    }
  }

  if (overrides?.offersUrl || overrides?.offersPrice || offersAvailability) {
    schema.offers = {
      '@type': 'Offer',
      ...(overrides?.offersUrl && { url: overrides.offersUrl }),
      ...(overrides?.offersPrice && { price: overrides.offersPrice }),
      ...(overrides?.offersPriceCurrency && {
        priceCurrency: overrides.offersPriceCurrency,
      }),
      ...(offersAvailability && { availability: offersAvailability }),
    }
  }

  return schema
}

function extractTextFromPortableText(content: unknown): string {
  if (typeof content === 'string') return content
  if (!content || !Array.isArray(content)) return ''
  return (content as Array<{ _type?: string; children?: Array<{ text?: string }> }>)
    .map((block) => {
      if (block._type === 'block' && block.children) {
        return block.children.map((c) => c.text || '').join(' ')
      }
      return ''
    })
    .join(' ')
    .trim()
}

export type SiteType = {
  title?: string
  altTitle?: string
  tagline?: string
  email?: string
  address?: string
  addressLocality?: string
  addressRegion?: string
  postalCode?: string
  addressCountry?: string
  sameAs?: string[]
  seo?: {
    metaTitle?: string
    metaDesc?: string
    autoShareImage?: { heading?: unknown; background?: string }
    ogImageHeading?: unknown
    ogImageBackground?: string
  }
  organizationJsonLd?: {
    name?: string
    legalName?: string
    description?: string
    logo?: { asset?: { url?: string } }
    url?: string
    email?: string
    telephone?: string
    priceRange?: string
  }
}

export function generateOrganizationJsonLd(site: SiteType | null) {
  if (!site) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: brand.name,
      url: baseUrl,
    }
  }
  const org = site.organizationJsonLd
  const logoUrl = org?.logo?.asset?.url
    ? (urlFor(org.logo.asset as Parameters<typeof urlFor>[0]).width(600).height(60).url())
    : undefined
  const name = org?.name || site.title || site.altTitle || brand.name
  const siteUrl = org?.url || baseUrl
  const email = site.email || org?.email

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    ...(org?.legalName && { legalName: org.legalName }),
    ...(org?.description && { description: org.description }),
    ...(logoUrl && {
      logo: { '@type': 'ImageObject', url: logoUrl },
      image: logoUrl,
    }),
    url: siteUrl,
    ...(email && { email }),
    ...(org?.telephone && { telephone: org.telephone }),
    ...(org?.priceRange && { priceRange: org.priceRange }),
  }

  if (
    site.address ||
    site.addressLocality ||
    site.addressRegion ||
    site.postalCode ||
    site.addressCountry
  ) {
    ;(schema as Record<string, unknown>).address = {
      '@type': 'PostalAddress',
      ...(site.address && { streetAddress: site.address }),
      ...(site.addressLocality && { addressLocality: site.addressLocality }),
      ...(site.addressRegion && { addressRegion: site.addressRegion }),
      ...(site.postalCode && { postalCode: site.postalCode }),
      ...(site.addressCountry && { addressCountry: site.addressCountry }),
    }
  }

  if (Array.isArray(site.sameAs) && site.sameAs.length > 0) {
    ;(schema as Record<string, unknown>).sameAs = site.sameAs.filter(Boolean)
  }

  return schema
}

export function generateWebSiteJsonLd(site: SiteType | null) {
  const name =
    site?.organizationJsonLd?.name || site?.title || site?.altTitle || brand.name
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: baseUrl,
    publisher: { '@type': 'Organization', name },
  }
}

export function generateFAQJsonLd(faqs: Array<{ question: string; answer: unknown }>) {
  if (!faqs?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs
      .map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: extractTextFromPortableText(faq.answer),
        },
      }))
      .filter((item) => item.acceptedAnswer.text),
  }
}
