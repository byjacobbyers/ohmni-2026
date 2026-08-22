import { describe, expect, it } from 'vitest'
import { extractStrings, injectStrings, localizeDocument, localizedId } from '@/lib/translate'

const page = {
  _id: 'drafts.page-1',
  _type: 'page',
  _rev: 'abc',
  title: 'Pricing',
  slug: { current: 'pricing' },
  sections: [
    {
      _type: 'ctaBlock',
      _key: 'a',
      anchor: 'cta',
      variant: 'proof',
      content: [
        {
          _type: 'block',
          style: 'h2',
          children: [
            { _type: 'span', text: 'Start with', marks: ['strong'] },
            { _type: 'span', text: ' a look', marks: [] },
          ],
          markDefs: [{ _type: 'linkWithRoute', _key: 'l', linkType: 'path', route: 'free-site-audit' }],
        },
      ],
      cta: { route: { linkType: 'page', title: 'Book now', pageRoute: { _ref: 'page-2', _type: 'reference' } } },
    },
    { _type: 'formBlock', _key: 'b', form: { _ref: 'form-1', _type: 'reference' } },
    {
      _type: 'panelsBlock',
      _key: 'c',
      panels: [{ title: 'One', tags: ['fast', 'cheap'], body: [] }],
    },
  ],
  dataAttributes: [{ key: 'track', value: 'hero' }],
}

describe('extractStrings', () => {
  it('collects copy and skips structure', () => {
    const paths = extractStrings(page).map((s) => s.path)
    expect(paths).toEqual([
      'title',
      'sections.0.content.0.children.0.text',
      'sections.0.content.0.children.1.text',
      'sections.0.cta.route.title',
      'sections.2.panels.0.title',
      'sections.2.panels.0.tags.0',
      'sections.2.panels.0.tags.1',
    ])
  })

  it('never touches the navigation lookup title', () => {
    const nav = { _type: 'navigation', title: 'Header', items: [{ title: 'Pricing' }] }
    expect(extractStrings(nav).map((s) => s.path)).toEqual(['items.0.title'])
  })
})

describe('injectStrings', () => {
  it('writes back by path without mutating the source', () => {
    const out = injectStrings(page, {
      title: 'Precios',
      'sections.0.content.0.children.0.text': 'Empieza con',
      'sections.2.panels.0.tags.1': 'barato',
      'nope.0.x': 'ignored',
    })
    expect(out.title).toBe('Precios')
    expect(out.sections[0].content?.[0].children[0].text).toBe('Empieza con')
    expect(out.sections[2].panels?.[0].tags[1]).toBe('barato')
    expect(page.title).toBe('Pricing')
  })
})

describe('localizeDocument', () => {
  it('re-ids, repoints refs that have twins, prefixes path routes', () => {
    const out = localizeDocument(page, 'es', new Set(['form-1--es']))
    expect(out._id).toBe('page-1--es')
    expect(out.language).toBe('es')
    expect('_rev' in out).toBe(false)
    expect(out.sections[1].form?._ref).toBe('form-1--es')
    // no Spanish page-2, so the reference stays English
    expect(out.sections[0].cta?.route.pageRoute._ref).toBe('page-2')
    expect(out.sections[0].content?.[0].markDefs[0].route).toBe('es/free-site-audit')
    expect(localizedId('drafts.x', 'en')).toBe('x')
  })

  it('leaves decks and the root alone', () => {
    const doc = {
      _id: 'n',
      _type: 'navigation',
      items: [
        { linkType: 'path', route: 'present/deck' },
        { linkType: 'path', route: '' },
        { linkType: 'path', route: 'es/pricing' },
      ],
    }
    const out = localizeDocument(doc, 'es', new Set())
    expect(out.items.map((i) => i.route)).toEqual(['present/deck', 'es', 'es/pricing'])
  })
})
