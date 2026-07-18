import { Metadata } from "next"
import { QueryParams, SanityDocument } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { notFound } from "next/navigation"
import { postsQuery, postQuery } from "@/sanity/queries/documents/post-query"
import { SiteQuery } from "@/sanity/queries/documents/site-query"
import PostSingle from "@/components/post-single"
import type { PostSingleData } from "@/types/components/post-single-type"

import { resolveBrand, type BrandSiteInput } from '@/lib/brand'
import {
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateMetadata as generateSeoMetadata,
} from "@/lib/seo"
import { faqJsonLdFromSections, JsonLdScript } from "@/lib/content-page"

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
      titleSuffix: resolveBrand(global as BrandSiteInput | null).titleSuffix,
      ogDocument: { slug: resolved.slug, type: 'post' },
      article: {
        publishedTime: post?.publishedAt,
        modifiedTime: post?._updatedAt,
        author: post?.author,
      },
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

  const schemas = []
  const postSeo = post?.seo || {}
  schemas.push(generateArticleJsonLd({
    title: post.title,
    description: postSeo.metaDesc || post.excerpt,
    url: `/posts/${slug}`,
    publishedAt: post.publishedAt,
    author: post.author,
    image: post.image,
    _updatedAt: post._updatedAt,
  }))
  const breadcrumb = generateBreadcrumbJsonLd([
    { name: 'Posts', url: '/posts' },
    { name: post.title, url: `/posts/${slug}` },
  ])
  if (breadcrumb) schemas.push(breadcrumb)

  const faqSchema = faqJsonLdFromSections(post.sections)
  if (faqSchema) schemas.push(faqSchema)

  return (
    <>
      <JsonLdScript id="post-jsonld" schemas={schemas} />
      <PostSingle post={post as PostSingleData} key={post._id} />
    </>
  )
}
