import { Metadata } from "next"
import { QueryParams, SanityDocument } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { notFound } from "next/navigation"
import { postsQuery, postQuery } from "@/sanity/queries/documents/post-query"
import { SiteQuery } from "@/sanity/queries/documents/site-query"
import PostSingle from "@/components/post-single"
import type { PostSingleData } from "@/types/components/post-single-type"
import Script from "next/script"
import {
  generateWebPageJsonLd,
  generateFAQJsonLd,
  generateMetadata as generateSeoMetadata,
} from "@/lib/seo"

export async function generateStaticParams() {
  try {
    const { data: posts } = await sanityFetch({
      query: postsQuery,
      perspective: 'published',
      stega: false,
    })
    return ((posts || []) as SanityDocument[])
      .filter((p: SanityDocument) => p?.slug && typeof p.slug === 'string')
      .map((p: SanityDocument) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

type Props = { params: Promise<{ slug: string }> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  try {
    const resolved = await params
    // stega: false keeps invisible edit-markers out of <head> metadata
    const [{ data: post }, { data: global }] = (await Promise.all([
      sanityFetch({ query: postQuery, params: { slug: resolved.slug }, stega: false }),
      sanityFetch({ query: SiteQuery, stega: false }),
    ])) as Array<{ data: SanityDocument | null }>

    if (!post) return generateSeoMetadata()

    return generateSeoMetadata(post?.seo, global?.seo, post?.title, post?.excerpt, {
      url: `/posts/${resolved.slug}`,
      titleSuffix: ' :: Ohmni',
      ogDocument: { slug: resolved.slug, type: 'post' },
    })
  } catch {
    return generateSeoMetadata()
  }
}

export default async function PostPage({ params }: { params: Promise<QueryParams> }) {
  const resolved = await params
  const slug = resolved?.slug
  if (!slug || typeof slug !== 'string') notFound()

  let post
  try {
    ;({ data: post } = (await sanityFetch({
      query: postQuery,
      params: { slug },
    })) as { data: SanityDocument | null })
  } catch {
    notFound()
  }

  if (!post) notFound()

  // ponytail: WebPage JSON-LD for now; Article + BreadcrumbList markup is BUILD-PLAN Task 3
  const schemas = []
  const postSeo = post?.seo || {}
  schemas.push(generateWebPageJsonLd({
    title: post.title,
    description: postSeo.metaDesc || post.excerpt,
    url: `/posts/${slug}`,
    seo: postSeo,
    _updatedAt: post._updatedAt,
  }))

  const faqBlocks = post.sections?.filter((s: { _type?: string; active?: boolean }) => s._type === 'faqBlock' && s.active !== false) || []
  const allFaqs = faqBlocks.flatMap((b: { faqs?: Array<{ question: string; answer: unknown }> }) => b.faqs || [])
  const faqSchema = generateFAQJsonLd(allFaqs)
  if (faqSchema) schemas.push(faqSchema)

  return (
    <>
      {schemas.length > 0 && (
        <Script id="post-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
      )}
      <PostSingle post={post as PostSingleData} key={post._id} />
    </>
  )
}
