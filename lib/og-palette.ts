/**
 * OG image surfaces. Shared values come from `lib/brand-palette.ts` so there is
 * one place to change a brand hex; the two dark-surface literals below have no
 * light-palette equivalent and are named against their token instead.
 */
import { brandPalette } from './brand-palette'

/** tokens/color.json → color.dark.background */
const DARK_BACKGROUND = '#121117'
/** tokens/color.json → color.light.secondary-foreground */
const SECONDARY_FOREGROUND = '#171717'

export type OgSurface = 'primary' | 'secondary' | 'black' | 'site'

export function normalizeOgSurface(raw: string | undefined | null): OgSurface {
  if (raw === 'secondary') return 'secondary'
  if (raw === 'black') return 'black'
  if (raw === 'site') return 'site'
  return 'primary'
}

export function ogSurfaceColors(surface: OgSurface): { background: string; color: string } {
  if (surface === 'secondary') {
    return { background: brandPalette.muted, color: SECONDARY_FOREGROUND }
  }
  if (surface === 'black') {
    return { background: DARK_BACKGROUND, color: brandPalette.primaryForeground }
  }
  if (surface === 'site') {
    return { background: brandPalette.background, color: brandPalette.foreground }
  }
  return { background: brandPalette.primary, color: brandPalette.primaryForeground }
}

/** Header border accent (--primary) */
export const OG_BRAND_PRIMARY = brandPalette.primary
