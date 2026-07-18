import { Metadata } from "next"
import { SanityDocument } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { notFound } from "next/navigation"
import { pageQuery } from "@/sanity/queries/documents/page-query"
import { SiteQuery } from "@/sanity/queries/documents/site-query"
import Page from "@/components/page-single"
import { resolveBrand, type BrandSiteInput } from '@/lib/brand'
import {
  generateWebPageJsonLd,
  generateFAQJsonLd,
  generateMetadata as generateSeoMetadata,
} from "@/lib/seo"

export const generateMetadata = async (): Promise<Metadata> => {
  try {
    const [{ data: page }, { data: global }] = (await Promise.all([
      sanityFetch({ query: pageQuery, params: { slug: 'events' }, stega: false }),
      sanityFetch({ query: SiteQuery, stega: false }),
    ])) as Array<{ data: SanityDocument | null }>

    if (!page) return generateSeoMetadata(undefined, undefined, 'Events')

    return generateSeoMetadata(page?.seo, global?.seo, page?.title || 'Events', undefined, {
      url: '/events',
      titleSuffix: resolveBrand(global as BrandSiteInput | null).titleSuffix,
      ogDocument: { slug: 'events', type: 'page' },
    })
  } catch {
    return generateSeoMetadata(undefined, undefined, 'Events')
  }
}

export default async function EventsIndexPage() {
  let page
  try {
    ;({ data: page } = (await sanityFetch({
      query: pageQuery,
      params: { slug: 'events' },
    })) as { data: SanityDocument | null })
  } catch {
    notFound()
  }

  if (!page) notFound()

  const schemas = []
  const pageSeo = page?.seo || {}
  schemas.push(generateWebPageJsonLd({
    title: page.title,
    description: pageSeo.metaDesc,
    url: '/events',
    seo: pageSeo,
    _updatedAt: page._updatedAt,
  }))

  const faqBlocks = page.sections?.filter((s: { _type?: string; active?: boolean }) => s._type === 'faqBlock' && s.active !== false) || []
  const allFaqs = faqBlocks.flatMap((b: { faqs?: Array<{ question: string; answer: unknown }> }) => b.faqs || [])
  const faqSchema = generateFAQJsonLd(allFaqs)
  if (faqSchema) schemas.push(faqSchema)

  return (
    <>
      {schemas.length > 0 && (
        <script id="events-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
      )}
      <Page page={page} key={page._id} />
    </>
  )
}
