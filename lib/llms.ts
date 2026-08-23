/**
 * llms.txt and per-page Markdown, built from the same documents the pages
 * render. Nothing here is a new field: titles, SEO descriptions, navigation
 * one-liners, excerpts and the sections' Portable Text already exist.
 *
 * Pure builders; the route handlers fetch and call these.
 */
import { localizePath, type Locale } from '@/lib/i18n'
import { buildUrl } from '@/lib/seo'
import { portableTextToMarkdown, tidy, type PtMarkDef, type PtNode } from '@/lib/portable-text-to-markdown'

type Json = Record<string, unknown>
const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : '')
const arr = (v: unknown): Json[] => (Array.isArray(v) ? (v as Json[]) : [])
const pt = (v: unknown) => (Array.isArray(v) ? (v as PtNode[]) : null)

/** Public path of a document, before the locale prefix. */
export const docPath = (type: 'page' | 'post', slug: string) =>
  type === 'post' ? `/posts/${slug}` : slug === 'home' ? '/' : `/${slug}`

/** `/pricing` → `/pricing.md`; `/` → `/index.md`; `/es` → `/es/index.md`. */
export const markdownPath = (path: string, lang: Locale = 'en') => {
  const localized = localizePath(path, lang)
  return localized === '/' || localized === '/es' ? `${localized === '/' ? '' : localized}/index.md` : `${localized}.md`
}

/**
 * Link annotations carry either an inline route (new) or a nested `route`
 * (legacy). Resolved to absolute URLs so the Markdown reads on its own.
 */
export function resolveLinkHref(def: PtMarkDef, lang: Locale): string | null {
  const r = (def.linkType ? def : (def.route as Json | undefined)) as Json | undefined
  if (!r?.linkType) return null
  const page = r.pageRoute as { slug?: string; language?: string } | undefined
  const post = r.postRoute as { slug?: string; language?: string } | undefined
  const target = (l?: string) => (l === 'es' ? 'es' : 'en') as Locale
  switch (r.linkType) {
    case 'page':
      return page?.slug ? buildUrl(localizePath(docPath('page', page.slug), target(page.language))) : null
    case 'post':
      return post?.slug ? buildUrl(localizePath(docPath('post', post.slug), target(post.language))) : null
    case 'path':
      return typeof r.route === 'string' ? buildUrl(`/${r.route.replace(/^\/+/, '')}`) : null
    case 'external':
      return str(r.link) || null
    case 'email':
      return r.email ? `mailto:${r.email}` : null
    case 'anchor':
      return null
    default:
      void lang
      return null
  }
}

/**
 * Blocks with nothing a model could read: media, spacing, and lists that
 * render from other documents (posts, events). The registry test checks every
 * insert-menu block is either handled in sectionToMarkdown or listed here.
 */
export const MARKDOWN_SKIPPED_BLOCKS = ['imageBlock', 'galleryBlock', 'embedBlock', 'dividerBlock', 'postsBlock', 'eventsBlock'] as const

/** One section of the page builder → Markdown. Unknown or visual-only blocks render nothing. */
export function sectionToMarkdown(section: Json, lang: Locale): string {
  if (section.active === false) return ''
  const md = (v: unknown) => portableTextToMarkdown(pt(v), { resolveHref: (d) => resolveLinkHref(d, lang), headingOffset: 1 })
  const h2 = (v: unknown) => (str(v) ? `## ${str(v)}` : '')
  const h3 = (v: unknown) => (str(v) ? `### ${str(v)}` : '')
  const cta = (v: unknown) => {
    const c = v as Json | undefined
    const route = c?.route as Json | undefined
    if (!c || c.active === false || !route?.linkType) return ''
    const href = resolveLinkHref(route as PtMarkDef, lang)
    const title = str(route.title)
    return href && title ? `[${title}](${href})` : ''
  }
  const parts: string[] = []
  switch (section._type) {
    case 'coverBlock':
    case 'heroBlock':
    case 'bannerBlock':
    case 'ctaBlock':
    case 'textBlock':
    case 'formBlock':
      parts.push(md(section.content), cta(section.cta))
      break
    case 'columnBlock':
      parts.push(h2(section.title), md(section.intro), md(section.content))
      for (const col of arr(section.columns)) parts.push(h3(col.title), md(col.content), cta(col.cta))
      parts.push(md(section.excerpt))
      break
    case 'comparisonBlock':
      parts.push(h2(section.heading), str(section.intro))
      for (const col of arr(section.columns)) {
        parts.push(h3([str(col.title), str(col.subtitle)].filter(Boolean).join(': ')))
        const rows = arr(col.rows).map((r) => `- ${str(r.label)}${str(r.value) ? `: ${str(r.value)}` : ''}`)
        if (str(col.total)) rows.push(`- ${str(col.totalLabel) || 'Total'}: ${str(col.total)}`)
        parts.push(rows.join('\n'), str(col.footnote))
      }
      parts.push(str(section.note))
      break
    case 'panelsBlock':
      parts.push(str(section.kicker) ? `_${str(section.kicker)}_` : '', h2(section.heading), str(section.intro))
      for (const p of arr(section.panels)) {
        parts.push(h3([str(p.eyebrow), str(p.title)].filter(Boolean).join(': ')))
        const tags = arr(p.tags).filter((t) => typeof t === 'string') as unknown as string[]
        if (tags.length) parts.push(`Tags: ${tags.join(', ')}`)
        parts.push(md(p.body))
      }
      parts.push(md(section.note))
      break
    case 'faqBlock':
      parts.push(h2(section.title))
      for (const f of arr(section.faqs)) parts.push(h3(f.question), md(f.answer))
      break
    case 'statsBlock':
      parts.push(md(section.heading))
      for (const s of arr(section.stats)) parts.push(`- **${str(s.statValue)}** ${tidy(md(s.content))}`.trim())
      parts.push(md(section.footnote))
      break
    case 'quoteBlock': {
      const quote = tidy(md(section.quote)).replace(/^/gm, '> ')
      parts.push(quote, str(section.title) ? `> ${str(section.title)}` : '')
      break
    }
    case 'splitScrollBlock':
      parts.push(md(section.title))
      for (const item of arr(section.items)) parts.push(md(item.content))
      break
    case 'teamMemberBlock': {
      const m = section.member as Json | undefined
      if (m) parts.push(h2(m.title), str(m.primaryJobTitle), md(m.content))
      break
    }
    case 'logoBarBlock': {
      const names = arr(section.logos).map((l) => str(l.name)).filter(Boolean)
      if (names.length) parts.push(str(section.eyebrow), names.join(', '))
      break
    }
    default:
      break
  }
  return tidy(parts.filter(Boolean).join('\n\n'))
}

export type MarkdownDoc = {
  title?: string | null
  slug?: string | null
  language?: string | null
  excerpt?: string | null
  seo?: { metaDesc?: string | null } | null
  sections?: unknown
  body?: unknown
  publishedAt?: string | null
  author?: { title?: string | null } | null
  _updatedAt?: string | null
}

/** A whole page or post as one Markdown document with a small front matter. */
export function documentToMarkdown(doc: MarkdownDoc, type: 'page' | 'post', lang: Locale): string {
  const slug = str(doc.slug) || 'home'
  const path = docPath(type, slug)
  const url = buildUrl(localizePath(path, lang))
  const front = [
    '---',
    `title: ${JSON.stringify(str(doc.title) || slug)}`,
    `url: ${url}`,
    `language: ${lang}`,
    doc.publishedAt ? `published: ${doc.publishedAt}` : '',
    doc._updatedAt ? `updated: ${doc._updatedAt}` : '',
    '---',
  ].filter(Boolean)
  const body =
    type === 'post'
      ? [
          `# ${str(doc.title) || slug}`,
          str(doc.excerpt) ? `> ${str(doc.excerpt)}` : '',
          doc.author?.title ? `By ${doc.author.title}` : '',
          portableTextToMarkdown(pt(doc.body), { resolveHref: (d) => resolveLinkHref(d, lang), headingOffset: 1 }),
        ]
      : [
          `# ${str(doc.title) || slug}`,
          str(doc.seo?.metaDesc) ? `> ${str(doc.seo?.metaDesc)}` : '',
          ...arr(doc.sections).map((s) => sectionToMarkdown(s, lang)),
        ]
  return tidy([...front, '', ...body.filter(Boolean)].join('\n\n').replace(/^---\n\n/, '---\n').replace(/\n\n(?=(title|url|language|published|updated):)/g, '\n').replace(/\n\n---/, '\n---'))
}

export type IndexInput = {
  site: { name: string; summary: string }
  /** Header navigation per language: groups of links with one-liners. */
  nav: Array<{ lang: Locale; groups: Array<{ title: string; items: Array<{ slug: string; description?: string }> }> }>
  pages: Array<{ slug: string; language: string; title: string; description?: string }>
  posts: Array<{ slug: string; language: string; title: string; excerpt?: string; publishedAt?: string }>
}

const LABELS: Record<Locale, { pages: string; articles: string; heading: string }> = {
  en: { pages: 'Pages', articles: 'Articles', heading: '' },
  es: { pages: 'Páginas', articles: 'Artículos', heading: 'Español' },
}

/**
 * llms.txt: the site in one screen. Groups follow the header navigation so
 * the file reorganizes itself when the nav does; the one-liners are the nav
 * descriptions, then the SEO description, then nothing.
 */
export function buildLlmsIndex(input: IndexInput): string {
  const out: string[] = [`# ${input.site.name}`, '', `> ${input.site.summary}`, '']
  out.push(
    'Every page on this site is also available as Markdown: append `.md` to its URL (the home page is `/index.md`). Links below point at the Markdown versions.',
    ''
  )
  const line = (path: string, lang: Locale, title: string, desc?: string) =>
    `- [${title}](${buildUrl(markdownPath(path, lang))})${desc ? `: ${desc}` : ''}`

  for (const lang of ['en', 'es'] as Locale[]) {
    const pages = input.pages.filter((p) => p.language === lang)
    const posts = input.posts.filter((p) => p.language === lang)
    if (!pages.length && !posts.length) continue
    const byPage = new Map(pages.map((p) => [p.slug, p]))
    const navGroups = input.nav.find((n) => n.lang === lang)?.groups ?? []
    const seen = new Set<string>()
    if (LABELS[lang].heading) out.push(`## ${LABELS[lang].heading}`, '')

    const home = byPage.get('home')
    if (home) {
      out.push(`${lang === 'en' ? '## ' : '### '}${LABELS[lang].pages}`, '')
      out.push(line('/', lang, home.title, home.description))
      seen.add('home')
    }
    for (const group of navGroups) {
      const items = group.items.filter((i) => byPage.has(i.slug) && !seen.has(i.slug))
      if (!items.length) continue
      if (group.title) out.push('', `${lang === 'en' ? '## ' : '### '}${group.title}`, '')
      for (const item of items) {
        const page = byPage.get(item.slug)!
        out.push(line(docPath('page', item.slug), lang, page.title, item.description || page.description))
        seen.add(item.slug)
      }
    }
    const rest = pages.filter((p) => !seen.has(p.slug) && p.slug !== 'posts')
    if (rest.length) {
      out.push('', `${lang === 'en' ? '## ' : '### '}${lang === 'en' ? 'More' : 'Más'}`, '')
      for (const page of rest) out.push(line(docPath('page', page.slug), lang, page.title, page.description))
    }
    if (posts.length) {
      out.push('', `${lang === 'en' ? '## ' : '### '}${LABELS[lang].articles}`, '')
      for (const post of posts) out.push(line(docPath('post', post.slug), lang, post.title, post.excerpt))
    }
    out.push('')
  }
  out.push('## Optional', '', `- [Everything as one file](${buildUrl('/llms-full.txt')})`, `- [Sitemap](${buildUrl('/sitemap.xml')})`)
  return tidy(out.join('\n')) + '\n'
}
