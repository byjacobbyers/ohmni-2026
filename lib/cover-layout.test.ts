import { describe, expect, it } from 'vitest'
import { coverHeightClass } from '@/lib/cover-layout'

describe('coverHeightClass', () => {
  it('uses min-h-screen for full', () => {
    expect(coverHeightClass('full')).toBe('min-h-screen')
  })

  it('supports three-quarter and half', () => {
    expect(coverHeightClass('threeQuarter')).toBe('min-h-[75dvh]')
    expect(coverHeightClass('half')).toBe('min-h-[50dvh]')
  })

  it('handles auto and color fallback', () => {
    expect(coverHeightClass('auto')).toBe('')
    expect(coverHeightClass('auto', { isAutoColorFallback: true })).toBe(
      'min-h-[50dvh]'
    )
  })
})
