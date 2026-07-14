/** Post shape used by the post detail page (sections + meta). */
export type PostSingleData = {
  title?: string
  image?: unknown
  publishedAt?: string
  author?: string
  category?: string
  excerpt?: string
  sections?: unknown[]
}

export type PostSingleProps = {
  post: PostSingleData | null
}
