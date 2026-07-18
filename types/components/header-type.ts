import type { BaseRouteType } from '@/types/objects/route-type'

export type HeaderProps = {
  navigation?: { items?: BaseRouteType[] } | null
  /** Short brand wordmark; defaults applied by the layout via resolveBrand */
  brandName: string
  brandTagline: string
}
