/** Post shape used by the post detail page (article body + meta). */
export type PostAuthor = {
  title?: string
  slug?: string
  primaryJobTitle?: string
  image?: unknown
}

export type PostCta = {
  active?: boolean
  route?: unknown
}

export type PostSingleData = {
  title?: string
  image?: unknown
  publishedAt?: string
  author?: PostAuthor | string | null
  category?: string
  excerpt?: string
  /** Long-form portable text. Posts are articles, not page-builder sections. */
  body?: unknown[]
  cta?: PostCta | null
  /** Absolute URL, resolved server-side so share targets work without JS guessing */
  shareUrl?: string
}

export type PostSingleProps = {
  post: PostSingleData | null
  /** Site Settings fallback used when the post has no CTA of its own */
  defaultCta?: PostCta | null
}

export function authorDisplayName(author?: PostAuthor | string | null): string | undefined {
  if (!author) return undefined
  if (typeof author === 'string') return author.trim() || undefined
  return author.title?.trim() || undefined
}

export function authorObject(author?: PostAuthor | string | null): PostAuthor | null {
  return author && typeof author === 'object' ? author : null
}
