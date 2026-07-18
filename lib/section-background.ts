import { cleanStega } from '@/lib/stega'

export type SectionBackground = 'primary' | 'secondary' | 'texture'

/** Normalize CMS / stega background tokens used by section blocks. */
export function normalizeSectionBackground(raw?: string): SectionBackground {
  const v = cleanStega(typeof raw === 'string' ? raw : '').toLowerCase()
  if (v === 'secondary' || v === 'texture') return v
  return 'primary'
}

export type SectionBackgroundClasses = {
  /** Classes on the outer `<section>` */
  sectionClass: string
  /** Lift content above texture backdrop */
  innerLiftClass: string
  showTexture: boolean
}

export function sectionBackgroundClasses(bg: SectionBackground): SectionBackgroundClasses {
  if (bg === 'secondary') {
    return {
      sectionClass: 'bg-primary text-primary-foreground',
      innerLiftClass: '',
      showTexture: false,
    }
  }
  if (bg === 'texture') {
    return {
      sectionClass: 'relative bg-black',
      innerLiftClass: 'relative z-10 text-foreground',
      showTexture: true,
    }
  }
  return { sectionClass: '', innerLiftClass: '', showTexture: false }
}

/** Binary primary/secondary sections (no texture option). */
export function secondarySectionClass(raw?: string): string {
  return normalizeSectionBackground(raw) === 'secondary'
    ? 'bg-primary text-primary-foreground'
    : ''
}
