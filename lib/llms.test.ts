import { describe, expect, it } from 'vitest'
import { buildLlmsIndex, documentToMarkdown, markdownPath, sectionToMarkdown } from '@/lib/llms'
import { buildUrl } from '@/lib/seo'

const B = buildUrl('')

const span = (text: string, marks: string[] = []) => ({ _type: 'span', text, marks })
const block = (text: string, style = 'normal') => ({ _type: 'block', style, children: [span(text)] })

describe('markdownPath', () => {
  it('maps pages, home and Spanish', () => {
    expect(markdownPath('/pricing')).toBe('/pricing.md')
    expect(markdownPath('/')).toBe('/index.md')
    expect(markdownPath('/', 'es')).toBe('/es/index.md')
    expect(markdownPath('/posts/x', 'es')).toBe('/es/posts/x.md')
  })
})

describe('sectionToMarkdown', () => {
  it('renders panels, comparison and faq; skips inactive and visual blocks', () => {
    expect(sectionToMarkdown({ _type: 'textBlock', active: false, content: [block('hidden')] }, 'en')).toBe('')
    expect(sectionToMarkdown({ _type: 'galleryBlock', images: [] }, 'en')).toBe('')
    const panels = sectionToMarkdown(
      {
        _type: 'panelsBlock',
        heading: 'One person, six areas',
        panels: [{ eyebrow: 'Platform', title: 'Own the repo', tags: ['Next.js'], body: [block('CI/CD and review.')] }],
        note: [block('Which two come first?')],
      },
      'en'
    )
    expect(panels).toBe(
      '## One person, six areas\n\n### Platform: Own the repo\n\nTags: Next.js\n\nCI/CD and review.\n\nWhich two come first?'
    )
    const cmp = sectionToMarkdown(
      { _type: 'comparisonBlock', heading: 'Cost', columns: [{ title: 'Agency', rows: [{ label: 'Retainer', value: '$8k' }], total: '$96k', totalLabel: 'Year' }] },
      'en'
    )
    expect(cmp).toBe('## Cost\n\n### Agency\n\n- Retainer: $8k\n- Year: $96k')
    const faq = sectionToMarkdown({ _type: 'faqBlock', faqs: [{ question: 'Why?', answer: [block('Because.')] }] }, 'en')
    expect(faq).toBe('### Why?\n\nBecause.')
  })

  it('resolves links to the target language', () => {
    const md = sectionToMarkdown(
      {
        _type: 'ctaBlock',
        content: [block('Start', 'h2')],
        cta: { active: true, route: { linkType: 'page', title: 'Audit', pageRoute: { slug: 'free-site-audit', language: 'es' } } },
      },
      'es'
    )
    expect(md).toContain('### Start')
    expect(md).toContain('[Audit](https://')
    expect(md).toContain('/es/free-site-audit)')
  })
})

describe('documentToMarkdown', () => {
  it('adds front matter and an H1', () => {
    const md = documentToMarkdown(
      { title: 'Pricing', slug: 'pricing', seo: { metaDesc: 'Simple pricing.' }, sections: [{ _type: 'textBlock', content: [block('Body')] }], _updatedAt: '2026-08-22' },
      'page',
      'en'
    )
    expect(md.startsWith('---\ntitle: "Pricing"\nurl: https://')).toBe(true)
    expect(md).toContain('updated: 2026-08-22\n---')
    expect(md).toContain('# Pricing\n\n> Simple pricing.\n\nBody')
  })
})

describe('buildLlmsIndex', () => {
  it('groups by navigation, falls back to SEO descriptions, and lists Spanish', () => {
    const md = buildLlmsIndex({
      site: { name: 'Ohmni', summary: 'The technical side of marketing.' },
      nav: [
        { lang: 'en', groups: [{ title: 'Product', items: [{ slug: 'pricing', description: 'Priced by deliverable.' }] }] },
        { lang: 'es', groups: [{ title: 'Producto', items: [{ slug: 'pricing', description: 'Precio por entregable.' }] }] },
      ],
      pages: [
        { slug: 'home', language: 'en', title: 'Home', description: 'Marketing moves fast.' },
        { slug: 'pricing', language: 'en', title: 'Pricing', description: 'seo desc' },
        { slug: 'about', language: 'en', title: 'About', description: 'Who we are.' },
        { slug: 'pricing', language: 'es', title: 'Precios' },
      ],
      posts: [{ slug: 'design-creep', language: 'en', title: 'Design creep', excerpt: 'Why it happens.' }],
    })
    expect(md).toContain('# Ohmni\n\n> The technical side of marketing.')
    expect(md).toContain(`## Pages\n\n- [Home](${B}/index.md): Marketing moves fast.`)
    expect(md).toContain(`## Product\n\n- [Pricing](${B}/pricing.md): Priced by deliverable.`)
    expect(md).toContain(`## More\n\n- [About](${B}/about.md): Who we are.`)
    expect(md).toContain(`## Articles\n\n- [Design creep](${B}/posts/design-creep.md): Why it happens.`)
    expect(md).toContain(`## Español\n\n### Producto\n\n- [Precios](${B}/es/pricing.md): Precio por entregable.`)
    expect(md).toContain(`## Optional\n\n- [Everything as one file](${B}/llms-full.txt)`)
    expect(md).not.toMatch(/[–—]/)
  })
})
