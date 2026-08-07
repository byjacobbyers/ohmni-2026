import type { BaseRouteType } from '@/types/objects/route-type'

/** A destination inside a dropdown: route plus the context a bare route lacks. */
export type NavLinkType = {
  _key?: string
  route?: BaseRouteType
  description?: string
  /** Icon name from the shared vocabulary, e.g. 'LuLayers' */
  icon?: string
}

/** A top-level item that opens a dropdown instead of navigating. */
export type SubNavType = {
  _key?: string
  _type: 'subNav'
  title?: string
  items?: NavLinkType[]
}

/** A top-level item that navigates directly. */
export type NavRouteType = BaseRouteType & {
  _key?: string
  _type: 'route'
}

export type NavItemType = NavRouteType | SubNavType

export type NavigationData = {
  title?: string
  items?: NavItemType[]
}

export function isSubNav(item: NavItemType): item is SubNavType {
  return item?._type === 'subNav'
}
