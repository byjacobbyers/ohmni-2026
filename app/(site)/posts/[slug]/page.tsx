import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { notFound } from 'next/navigation'
import { postsQuery } from '@/sanity/queries/documents/post-query'
import { postMetadata, renderPost } from '@/lib/post-page'
import type { PostsQueryResult } from '@/sanity.types'

export async function generateStaticParams() {
  try {
    const { data } = await sanityFetch({
      query: postsQuery,
      params: { lang: 'en' },
      perspective: 'published',
      stega: false,
    })
    return ((data ?? []) as PostsQueryResult)
      .filter((p) => typeof p.slug === 'string')
      .map((p) => ({ slug: p.slug as string }))
  } catch {
    return []
  }
}

type Props = { params: Promise<{ slug: string }> }

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
  postMetadata((await params).slug)

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  if (!slug) notFound()
  return renderPost(slug)
}
