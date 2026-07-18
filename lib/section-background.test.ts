import { describe, expect, it } from 'vitest'
import {
  normalizeSectionBackground,
  secondarySectionClass,
  sectionBackgroundClasses,
} from '@/lib/section-background'

describe('section-background', () => {
  it('normalizes tokens', () => {
    expect(normalizeSectionBackground('secondary')).toBe('secondary')
    expect(normalizeSectionBackground('texture')).toBe('texture')
    expect(normalizeSectionBackground('primary')).toBe('primary')
    expect(normalizeSectionBackground(undefined)).toBe('primary')
  })

  it('builds section classes', () => {
    expect(sectionBackgroundClasses('secondary').sectionClass).toContain('bg-primary')
    expect(sectionBackgroundClasses('texture').showTexture).toBe(true)
    expect(sectionBackgroundClasses('primary').sectionClass).toBe('')
  })

  it('secondarySectionClass only for secondary', () => {
    expect(secondarySectionClass('secondary')).toContain('bg-primary')
    expect(secondarySectionClass('texture')).toBe('')
  })
})
