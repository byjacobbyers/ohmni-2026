/**
 * Surfaces aligned with app/(site)/globals.css :root / .dark tokens where noted.
 */
export type OgSurface = 'primary' | 'secondary' | 'black' | 'site'

export function normalizeOgSurface(raw: string | undefined | null): OgSurface {
  if (raw === 'secondary') return 'secondary'
  if (raw === 'black') return 'black'
  if (raw === 'site') return 'site'
  return 'primary'
}

export function ogSurfaceColors(surface: OgSurface): { background: string; color: string } {
  if (surface === 'secondary') {
    return { background: '#e5e7eb', color: '#171717' }
  }
  if (surface === 'black') {
    return { background: '#121117', color: '#fafbfa' }
  }
  if (surface === 'site') {
    return { background: '#ffffff', color: '#0a0a0a' }
  }
  return { background: '#3265fd', color: '#fafbfa' }
}

/** Header border accent (--primary) */
export const OG_BRAND_PRIMARY = '#3265fd'
