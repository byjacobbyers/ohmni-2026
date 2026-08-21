import { describe, expect, it } from 'vitest'
import { getTargetsForDocument } from '@/lib/revalidate-targets'

describe('getTargetsForDocument', () => {
  it('maps home page to / and busts the sitemap', () => {
    expect(getTargetsForDocument({ _type: 'page', slug: { current: 'home' } })).toEqual([
      { path: '/' },
      { path: '/sitemap.xml' },
    ])
  })

  it('busts the sitemap for any published page', () => {
    expect(getTargetsForDocument({ _type: 'page', slug: { current: 'analytics' } })).toEqual([
      { path: '/analytics' },
      { path: '/sitemap.xml' },
    ])
  })

  it('maps post to detail + list + home', () => {
    expect(getTargetsForDocument({ _type: 'post', slug: { current: 'hello' } })).toEqual([
      { path: '/posts/hello' },
      { path: '/posts' },
      { path: '/' },
      { path: '/sitemap.xml' },
    ])
  })

  it('maps event to detail + lists + home', () => {
    expect(getTargetsForDocument({ _type: 'event', slug: { current: 'show' } })).toEqual([
      { path: '/events/show' },
      { path: '/events' },
      { path: '/past-events' },
      { path: '/' },
      { path: '/sitemap.xml' },
    ])
  })

  it('busts layout for site/nav', () => {
    expect(getTargetsForDocument({ _type: 'site' })).toEqual([
      { path: '/', type: 'layout' },
    ])
    expect(getTargetsForDocument({ _type: 'navigation' })).toEqual([
      { path: '/', type: 'layout' },
    ])
  })

  it('busts layout for form and formSettings', () => {
    expect(getTargetsForDocument({ _type: 'form' })).toEqual([
      { path: '/', type: 'layout' },
    ])
    expect(getTargetsForDocument({ _type: 'formSettings' })).toEqual([
      { path: '/', type: 'layout' },
    ])
  })

  it('busts layout for postCtaSettings', () => {
    expect(getTargetsForDocument({ _type: 'postCtaSettings' })).toEqual([
      { path: '/', type: 'layout' },
    ])
  })
  it('busts the whole deck path for a presentation, and never the sitemap', () => {
    expect(
      getTargetsForDocument({ _type: 'presentation', slug: { current: 'ohmni-system' } })
    ).toEqual([{ path: '/present/ohmni-system', type: 'layout' }])
  })

  it('falls back to /present when a presentation has no slug', () => {
    expect(getTargetsForDocument({ _type: 'presentation' })).toEqual([
      { path: '/present', type: 'layout' },
    ])
  })
})
