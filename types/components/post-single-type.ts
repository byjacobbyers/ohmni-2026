/** Post shape used by the post detail page (article body + meta). */
export type PostAuthor = {
  title?: string
  slug?: string
  primaryJobTitle?: string
  image?: unknown
}

/** Full closing section (a ctaBlock object), not just a button. */
export type PostCtaSection = {
  active?: boolean
  backgroundColor?: string
  alignment?: string
  content?: unknown
  cta?: { active?: boolean; route?: unknown } | null
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
  cta?: PostCtaSection | null
  /** Absolute URL, resolved server-side so share targets work without JS guessing */
  shareUrl?: string
}

export type PostSingleProps = {
  post: PostSingleData | null
  /** Site Settings fallback used when the post has no CTA of its own */
  defaultCta?: PostCtaSection | null
}

export function authorDisplayName(author?: PostAuthor | string | null): string | undefined {
  if (!author) return undefined
  if (typeof author === 'string') return author.trim() || undefined
  return author.title?.trim() || undefined
}

export function authorObject(author?: PostAuthor | string | null): PostAuthor | null {
  return author && typeof author === 'object' ? author : null
}
