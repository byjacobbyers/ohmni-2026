import type { NavItemType } from '@/types/components/nav-type'

export type MobileNavProps = {
  data: { items?: NavItemType[] }
  closeMenu: () => void
  /** Fires when Book Now link is hovered (e.g. header aurora on tablet with pointer). */
  onBookNowHoverChange?: (active: boolean) => void
}
