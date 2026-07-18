import { Metadata } from 'next'
import { QueryParams, SanityDocument } from 'next-sanity'
import { sanityFetch } from '@/sanity/lib/live'
import { notFound } from 'next/navigation'
import { pagesQuery } from '@/sanity/queries/documents/page-query'
import { EXCLUDED_PAGE_SLUGS } from '@/sanity/queries/documents/sitemap-queries'
import Page from '@/components/page-single'
import {
  fetchPage,
  JsonLdScript,
  pageSeoMetadata,
  webPageSchemas,
} from '@/lib/content-page'
import { generateMetadata as generateSeoMetadata } from '@/lib/seo'

export async function generateStaticParams() {
  try {
    const { data: posts } = await sanityFetch({
      query: pagesQuery,
      perspective: 'published',
      stega: false,
    })
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
  const resolved = await params
  if (resolved?.slug?.toString().startsWith('__') || !resolved?.slug) {
    return generateSeoMetadata()
  }
  const slug = String(resolved.slug)
  return pageSeoMetadata({
    slug,
    url: slug === 'home' ? '/' : `/${slug}`,
  })
}

export default async function SinglePage({ params }: { params: Promise<QueryParams> }) {
  const resolved = await params
  if (resolved?.slug?.toString().startsWith('__') || !resolved?.slug) notFound()

  const slug = String(resolved.slug)
  let page
  try {
    page = await fetchPage(slug)
  } catch {
    notFound()
  }

  if (!page) notFound()

  const url = slug === 'home' ? '/' : `/${slug}`

  return (
    <>
      <JsonLdScript id="page-jsonld" schemas={webPageSchemas(page, url)} />
      <Page page={page} key={page._id} />
    </>
  )
}
