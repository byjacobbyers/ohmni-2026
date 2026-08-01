import { Metadata } from 'next'
import { QueryParams } from 'next-sanity'
import { sanityFetch } from '@/sanity/lib/live'
import { notFound } from 'next/navigation'
import { postsQuery, postQuery } from '@/sanity/queries/documents/post-query'
import { SiteQuery } from '@/sanity/queries/documents/site-query'
import PostSingle from '@/components/post-single'
import type { PostSingleData } from '@/types/components/post-single-type'

import { resolveBrand, type BrandSiteInput } from '@/lib/brand'
import {
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateMetadata as generateSeoMetadata,
} from '@/lib/seo'
import { JsonLdScript } from '@/lib/content-page'
import { authorDisplayName } from '@/types/components/post-single-type'
import type {
  PostQueryResult,
  PostsQueryResult,
  SiteQueryResult,
} from '@/sanity.types'

export async function generateStaticParams() {
  try {
    const { data: posts } = await sanityFetch({
      query: postsQuery,
      perspective: 'published',
      stega: false,
    })
    const list = (posts ?? []) as PostsQueryResult
    return list
      .filter((p) => p?.slug && typeof p.slug === 'string')
      .map((p) => ({ slug: p.slug as string }))
  } catch {
    return []
  }
}

type Props = { params: Promise<{ slug: string }> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  try {
    const resolved = await params
    const [{ data: postData }, { data: globalData }] = await Promise.all([
      sanityFetch({ query: postQuery, params: { slug: resolved.slug }, stega: false }),
      sanityFetch({ query: SiteQuery, stega: false }),
    ])
    const post = postData as PostQueryResult | null
    const global = globalData as SiteQueryResult | null

    if (!post) return generateSeoMetadata()

    return generateSeoMetadata(
      (post.seo ?? undefined) as import('@/lib/seo').SeoType | undefined,
      (global?.seo ?? undefined) as import('@/lib/seo').SeoType | undefined,
      post.title ?? undefined,
      post.excerpt ?? undefined,
      {
        url: `/posts/${resolved.slug}`,
        titleSuffix: resolveBrand(global as BrandSiteInput | null).titleSuffix,
        ogDocument: { slug: resolved.slug, type: 'post' },
        article: {
          publishedTime: post.publishedAt ?? undefined,
          modifiedTime: post._updatedAt,
          author: authorDisplayName(
            post.author
              ? { title: post.author.title ?? undefined, slug: post.author.slug ?? undefined }
              : null
          ),
        },
      }
    )
  } catch {
    return generateSeoMetadata()
  }
}

export default async function PostPage({ params }: { params: Promise<QueryParams> }) {
  const resolved = await params
  const slug = resolved?.slug
  if (!slug || typeof slug !== 'string') notFound()

  let post: PostQueryResult | null = null
  try {
    const { data } = await sanityFetch({
      query: postQuery,
      params: { slug },
    })
    post = data as PostQueryResult | null
  } catch {
    notFound()
  }

  if (!post) notFound()

  const schemas = []
  const title = post.title ?? 'Untitled'
  schemas.push(
    generateArticleJsonLd({
      title,
      description: post.seo?.metaDesc ?? post.excerpt ?? undefined,
      url: `/posts/${slug}`,
      publishedAt: post.publishedAt ?? undefined,
      author: post.author
        ? {
            title: post.author.title ?? undefined,
            slug: post.author.slug ?? undefined,
            primaryJobTitle: post.author.primaryJobTitle ?? undefined,
          }
        : null,
      category: post.category ?? undefined,
      image: (post.image ?? undefined) as { asset?: { url?: string } } | undefined,
      _updatedAt: post._updatedAt,
      jsonLd: post.jsonLd,
    })
  )
  const breadcrumb = generateBreadcrumbJsonLd([
    { name: 'Posts', url: '/posts' },
    { name: title, url: `/posts/${slug}` },
  ])
  if (breadcrumb) schemas.push(breadcrumb)


  return (
    <>
      <JsonLdScript id="post-jsonld" schemas={schemas} />
      <PostSingle post={post as PostSingleData} key={post._id} />
    </>
  )
}
