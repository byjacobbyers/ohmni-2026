import { Metadata } from "next"
import { QueryParams, SanityDocument } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { notFound } from "next/navigation"
import { pagesQuery, pageQuery } from "@/sanity/queries/documents/page-query"
import { EXCLUDED_PAGE_SLUGS } from "@/sanity/queries/documents/sitemap-queries"
import { SiteQuery } from "@/sanity/queries/documents/site-query"
import Page from "@/components/page-single"
import Script from "next/script"
import {
  generateWebPageJsonLd,
  generateFAQJsonLd,
  generateMetadata as generateSeoMetadata,
} from "@/lib/seo"

export async function generateStaticParams() {
  try {
    const { data: posts } = await sanityFetch({ query: pagesQuery })
    return ((posts || []) as SanityDocument[])
      .filter((p: SanityDocument) => {
        const slug = p?.slug
        return slug && typeof slug === 'string' && !EXCLUDED_PAGE_SLUGS.includes(slug)
      })
      .map((p: SanityDocument) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

type Props = { params: Promise<QueryParams> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  try {
    const resolved = await params
    if (resolved?.slug?.toString().startsWith('__') || !resolved?.slug) return generateSeoMetadata()

    const [{ data: page }, { data: global }] = (await Promise.all([
      sanityFetch({ query: pageQuery, params: { slug: resolved.slug } }),
      sanityFetch({ query: SiteQuery }),
    ])) as Array<{ data: SanityDocument | null }>

    if (!page) return generateSeoMetadata()

    return generateSeoMetadata(page?.seo, global?.seo, page?.title, undefined, {
      url: `/${resolved.slug}`,
      titleSuffix: ' :: Ohmni',
      ogDocument: { slug: String(resolved.slug), type: 'page' },
    })
  } catch {
    return generateSeoMetadata()
  }
}

export default async function SinglePage({ params }: { params: Promise<QueryParams> }) {
  const resolved = await params
  if (resolved?.slug?.toString().startsWith('__') || !resolved?.slug) notFound()

  let page
  try {
    ;({ data: page } = (await sanityFetch({
      query: pageQuery,
      params: { slug: resolved.slug },
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
    url: `/${resolved.slug}`,
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
        <Script id="page-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
      )}
      <Page page={page} key={page._id} />
    </>
  )
}
