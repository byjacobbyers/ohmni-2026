import type { NavItemType } from '@/types/components/nav-type'
import type { Locale } from '@/lib/i18n'

export type HeaderProps = {
  /** Items are either plain routes or subNav dropdowns. */
  navigation?: { items?: NavItemType[] } | null
  /** Short brand wordmark; defaults applied by the layout via resolveBrand */
  brandName: string
  brandTagline: string
  lang: Locale
}
