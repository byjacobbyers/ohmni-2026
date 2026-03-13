import { BaseRouteType } from '@/types/objects/route-type'

export function resolveRouteUrl(route: BaseRouteType): string {
  if (!route || !route.linkType) return '#'

  switch (route.linkType) {
    case 'page': {
      const pageSlug =
        typeof route.pageRoute?.slug === 'string' ? route.pageRoute.slug : route.pageRoute?.slug?.current
      return pageSlug ? `/${pageSlug}` : '#'
    }
    case 'event': {
      const eventSlug =
        typeof route.eventRoute?.slug === 'string' ? route.eventRoute.slug : route.eventRoute?.slug?.current
      return eventSlug ? `/events/${eventSlug}` : '#'
    }
    case 'path':
      return route.route ? `/${route.route}` : '#'
    case 'anchor':
      return route.anchor ? `#${route.anchor}` : '#'
    case 'file':
      return route.fileRoute?.asset?.url || '#'
    case 'external':
      return route.link || '#'
    case 'email':
      return route.email ? `mailto:${route.email}` : '#'
    case 'telephone':
      return route.telephone ? `tel:${route.telephone}` : '#'
    default:
      return '#'
  }
}

export function buildRouteProps(route: BaseRouteType) {
  if (!route || !route.linkType) {
    return { href: '#' }
  }

  const href = resolveRouteUrl(route)
  const isExternal =
    route.linkType === 'external' || route.linkType === 'email' || route.linkType === 'telephone'
  const isFileDownload = route.linkType === 'file'
  const isAnchor = route.linkType === 'anchor'

  const props: {
    href: string
    target?: string
    rel?: string
    download?: string
    'aria-label'?: string
    title?: string
  } = { href }

  if (route.blank || isExternal || isFileDownload) {
    props.target = '_blank'
    props.rel = 'noopener noreferrer'
  }

  if (isFileDownload && route.fileRoute?.asset?.originalFilename) {
    props.download = route.fileRoute.asset.originalFilename
  }

  if (route.ariaLabel) {
    props['aria-label'] = route.ariaLabel
  }

  if (route.titleAttr) {
    props.title = route.titleAttr
  }

  return props
}
