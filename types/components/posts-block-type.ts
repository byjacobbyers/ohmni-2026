export type PostCard = {
  _id: string
  title?: string
  slug?: string
  publishedAt?: string
  author?: { title?: string } | string | null
  category?: string
  excerpt?: string
  image?: unknown
}

export type PostsBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: string
  title?: string
  /** How many posts to show before Load more (default 6). */
  count?: number
  /** Server-fetched list (preferred for SEO). */
  initialPosts?: PostCard[]
  /** @deprecated Prefer initialPosts from the server wrapper */
  posts?: PostCard[]
}
