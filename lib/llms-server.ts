import { after } from 'next/server'
import { client } from '@/sanity/lib/client'
import { pageQuery } from '@/sanity/queries/documents/page-query'
import { postQuery } from '@/sanity/queries/documents/post-query'
import { llmsDocumentsQuery, llmsIndexQuery } from '@/sanity/queries/documents/llms-query'
import { resolveBrand } from '@/lib/brand'
import { captureServerEvent } from '@/lib/posthog-server'
import { buildLlmsIndex, documentToMarkdown, type IndexInput, type MarkdownDoc } from '@/lib/llms'
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n'

/**
 * Fetching for the Markdown surfaces. Plain client, CDN on, no Live tags:
 * these handlers are dynamic on purpose so every crawler read is counted.
 */
export async function fetchMarkdownDocument(type: 'page' | 'post', slug: string, lang: Locale): Promise<string | null> {
  const query = type === 'post' ? postQuery : pageQuery
  let doc = (await client.fetch(query, { slug, lang })) as MarkdownDoc | null
  // Same fallback as the HTML routes: English when no translation exists.
  if (!doc && lang !== DEFAULT_LOCALE) doc = (await client.fetch(query, { slug, lang: DEFAULT_LOCALE })) as MarkdownDoc | null
  return doc ? documentToMarkdown(doc, type, lang) : null
}

export async function fetchLlmsIndex(): Promise<string> {
  const data = (await client.fetch(llmsIndexQuery)) as {
    site: { altTitle?: string; title?: string; summary?: string; homeDescription?: string } | null
    nav: Array<{ lang: string; groups: Array<{ title?: string; items?: Array<{ description?: string; slug?: string }> } | null> }>
    pages: IndexInput['pages']
    posts: IndexInput['posts']
  }
  const brand = resolveBrand({ altTitle: data.site?.altTitle })
  return buildLlmsIndex({
    site: { name: brand.name, summary: data.site?.summary?.trim() || brand.description },
    nav: data.nav.map((n) => ({
      lang: (n.lang === 'es' ? 'es' : 'en') as Locale,
      groups: n.groups
        .filter((g): g is NonNullable<typeof g> => Boolean(g))
        .map((g) => ({
          title: g.title ?? '',
          items: (g.items ?? []).filter((i) => i.slug).map((i) => ({ slug: i.slug as string, description: i.description ?? undefined })),
        })),
    })),
    // The home document has no SEO of its own; Site Settings carries it.
    pages: data.pages.map((p) =>
      p.slug === 'home' && !p.description ? { ...p, description: data.site?.homeDescription ?? undefined } : p
    ),
    posts: data.posts,
  })
}

export async function fetchLlmsFull(): Promise<string> {
  const { pages, posts } = (await client.fetch(llmsDocumentsQuery)) as {
    pages: Array<{ slug: string; language: string }>
    posts: Array<{ slug: string; language: string }>
  }
  const docs = [
    ...pages.map((p) => ({ type: 'page' as const, ...p })),
    ...posts.map((p) => ({ type: 'post' as const, ...p })),
  ]
  const rendered = await Promise.all(
    docs.map((d) => fetchMarkdownDocument(d.type, d.slug, d.language === 'es' ? 'es' : 'en'))
  )
  return rendered.filter(Boolean).join('\n\n\n') + '\n'
}

/** A Markdown response, plus a server-side event so crawler reads are countable. */
export function markdownResponse(body: string, request: Request, properties: Record<string, unknown>) {
  const ua = request.headers.get('user-agent') ?? ''
  after(() => captureServerEvent('llms_fetch', 'llms-reader', { ...properties, user_agent: ua }))
  return new Response(body, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=300',
      'x-robots-tag': 'noindex',
    },
  })
}
