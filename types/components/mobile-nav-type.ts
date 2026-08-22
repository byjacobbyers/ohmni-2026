import type { NavItemType } from '@/types/components/nav-type'
import type { Locale } from '@/lib/i18n'

export type MobileNavProps = {
  data: { items?: NavItemType[] }
  closeMenu: () => void
  lang: Locale
  /** Fires when Book Now link is hovered (e.g. header aurora on tablet with pointer). */
  onBookNowHoverChange?: (active: boolean) => void
}
