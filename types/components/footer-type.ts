import type { BaseRouteType } from '@/types/objects/route-type'
import type { Locale } from '@/lib/i18n'

export type FooterProps = {
  navigation?: { items?: BaseRouteType[] } | null
  brandName: string
  lang: Locale
}
