import { describe, expect, it } from 'vitest'
import { featureProperties, findExperiment, isBot, parseAssignments, parseOverride, pickVariant } from './experiments'

const exp = { key: 'home-cta', pathname: '/', variants: [
  { key: 'a', weight: 50, slug: 'home' },
  { key: 'b', weight: 50, slug: 'home-b' },
] }

describe('experiments', () => {
  it('matches the pathname with or without a trailing slash', () => {
    expect(findExperiment([exp], '/')?.key).toBe('home-cta')
    expect(findExperiment([{ ...exp, pathname: '/audit' }], '/audit/')?.key).toBe('home-cta')
    expect(findExperiment([exp], '/pricing')).toBeUndefined()
  })

  it('picks by weight deterministically', () => {
    expect(pickVariant(exp, 0.0).key).toBe('a')
    expect(pickVariant(exp, 0.49).key).toBe('a')
    expect(pickVariant(exp, 0.5).key).toBe('b')
    expect(pickVariant(exp, 0.999).key).toBe('b')
    const skewed = { ...exp, variants: [{ key: 'a', weight: 90, slug: 'x' }, { key: 'b', weight: 10, slug: 'y' }] }
    expect(pickVariant(skewed, 0.89).key).toBe('a')
    expect(pickVariant(skewed, 0.91).key).toBe('b')
  })

  it('parses overrides and rejects junk', () => {
    expect(parseOverride(new URLSearchParams('ab=b'))).toEqual({ variant: 'b' })
    expect(parseOverride(new URLSearchParams('ab=reset'))).toEqual({ reset: true })
    expect(parseOverride(new URLSearchParams('ab=<script>'))).toEqual({})
    expect(parseOverride(new URLSearchParams(''))).toEqual({})
  })

  it('parses only ab_ cookies into assignments', () => {
    expect(parseAssignments('foo=1; ab_home-cta=b; ab_audit=a; ab_bad=<x>')).toEqual({ 'home-cta': 'b', audit: 'a' })
    expect(parseAssignments(null)).toEqual({})
  })

  it('maps assignments to $feature properties', () => {
    expect(featureProperties({ 'home-cta': 'b' })).toEqual({ '$feature/home-cta': 'b' })
  })

  it('treats crawlers as bots', () => {
    expect(isBot('Mozilla/5.0 (compatible; Googlebot/2.1)')).toBe(true)
    expect(isBot('Mozilla/5.0 (Macintosh) Chrome/130')).toBe(false)
  })
})
