import { fetchMarkdownDocument, markdownResponse } from '@/lib/llms-server'
import { isLocale } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i

/** Reached through the `.md` rewrites in next.config.ts, never linked directly. */
export async function GET(request: Request, { params }: { params: Promise<{ lang: string; type: string; slug: string }> }) {
  const { lang, type, slug } = await params
  if (!isLocale(lang) || (type !== 'page' && type !== 'post' && type !== 'presentation') || !SLUG_RE.test(slug)) {
    return new Response('Not found', { status: 404 })
  }
  const body = await fetchMarkdownDocument(type as 'page' | 'post' | 'presentation', slug, lang)
  if (!body) return new Response('Not found', { status: 404 })
  return markdownResponse(body, request, { surface: 'page.md', type, slug, lang })
}
