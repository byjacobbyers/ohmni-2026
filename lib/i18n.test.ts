import { describe, expect, it } from 'vitest'
import { localizePath, preferredLocale, stripLocale, t } from '@/lib/i18n'

describe('i18n paths', () => {
  it('localizes and strips symmetrically', () => {
    expect(localizePath('/', 'es')).toBe('/es')
    expect(localizePath('/pricing', 'es')).toBe('/es/pricing')
    expect(localizePath('/pricing', 'en')).toBe('/pricing')
    expect(stripLocale('/es')).toEqual({ lang: 'es', path: '/' })
    expect(stripLocale('/es/pricing')).toEqual({ lang: 'es', path: '/pricing' })
    expect(stripLocale('/pricing')).toEqual({ lang: 'en', path: '/pricing' })
    // "/estimate" is not Spanish
    expect(stripLocale('/estimate')).toEqual({ lang: 'en', path: '/estimate' })
    // an unknown locale prefix is just a path
    expect(stripLocale('/fr/pricing')).toEqual({ lang: 'en', path: '/fr/pricing' })
  })
})

describe('preferredLocale', () => {
  it('uses only the top preference', () => {
    expect(preferredLocale('es-MX,es;q=0.9,en;q=0.8')).toBe('es')
    expect(preferredLocale('en-US,en;q=0.9,es;q=0.8')).toBe('en')
    expect(preferredLocale('fr-FR,es;q=0.5')).toBe('en')
    expect(preferredLocale('en;q=0.5,es;q=0.9')).toBe('es')
    expect(preferredLocale(null)).toBe('en')
    expect(preferredLocale('')).toBe('en')
  })
})

describe('t', () => {
  it('falls back to English', () => {
    expect(t('es', 'readMore')).toBe('Leer más')
    expect(t('en', 'readMore')).toBe('Read more')
  })
})
