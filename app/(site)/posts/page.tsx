import { Metadata } from "next"
import { SanityDocument } from "next-sanity"
import { sanityFetch } from "@/sanity/lib/live"
import { postsQuery } from "@/sanity/queries/documents/post-query"
import { SiteQuery } from "@/sanity/queries/documents/site-query"
import PostsBlock from "@/components/posts-block"
import type { PostCard } from "@/types/components/posts-block-type"
import { generateMetadata as generateSeoMetadata } from "@/lib/seo"
import { brand } from '@/lib/brand'

export const generateMetadata = async (): Promise<Metadata> => {
  try {
    // stega: false keeps invisible edit-markers out of <head> metadata
    const { data: global } = (await sanityFetch({ query: SiteQuery, stega: false })) as {
      data: SanityDocument | null
    }
    return generateSeoMetadata(undefined, global?.seo, 'Posts', undefined, {
      url: '/posts',
      titleSuffix: brand.titleSuffix,
    })
  } catch {
    return generateSeoMetadata(undefined, undefined, 'Posts')
  }
}

export default async function PostsIndexPage() {
  let posts: PostCard[] = []
  try {
    const { data } = await sanityFetch({ query: postsQuery })
    posts = (data || []) as PostCard[]
  } catch {
    posts = []
  }

  return (
    <main className="flex min-h-screen flex-col items-center pb-12">
      <section className="container pt-16 text-center content md:pt-24">
        <h1>Posts</h1>
      </section>
      {posts.length > 0 ? (
        // ponytail: no pagination; fine until a client passes ~50 posts, then
        // adopt the offset-based pagination pattern from the Sanity nextjs rules
        <PostsBlock posts={posts} count={posts.length} columnsPerRow={3} />
      ) : (
        <p className="container py-16 text-center text-muted-foreground">
          No posts published yet.
        </p>
      )}
    </main>
  )
}
