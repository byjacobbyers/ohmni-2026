/** Post shape used by the post detail page (sections + meta). */
export type PostAuthor = {
  title?: string
  slug?: string
  primaryJobTitle?: string
}

export type PostSingleData = {
  title?: string
  image?: unknown
  publishedAt?: string
  author?: PostAuthor | string | null
  category?: string
  excerpt?: string
  sections?: unknown[]
}

export type PostSingleProps = {
  post: PostSingleData | null
}

export function authorDisplayName(author?: PostAuthor | string | null): string | undefined {
  if (!author) return undefined
  if (typeof author === 'string') return author.trim() || undefined
  return author.title?.trim() || undefined
}
