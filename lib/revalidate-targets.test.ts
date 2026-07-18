import { describe, expect, it } from 'vitest'
import { getTargetsForDocument } from '@/lib/revalidate-targets'

describe('getTargetsForDocument', () => {
  it('maps home page to /', () => {
    expect(getTargetsForDocument({ _type: 'page', slug: { current: 'home' } })).toEqual([
      { path: '/' },
    ])
  })

  it('maps post to detail + list + home', () => {
    expect(getTargetsForDocument({ _type: 'post', slug: { current: 'hello' } })).toEqual([
      { path: '/posts/hello' },
      { path: '/posts' },
      { path: '/' },
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
})
