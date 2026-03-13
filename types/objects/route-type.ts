import { PageType } from '../documents/page-type'
import { EventType } from '../documents/event-type'

export type BaseRouteType = {
  _type: string
  title?: string
  linkType: 'page' | 'event' | 'path' | 'anchor' | 'file' | 'external' | 'email' | 'telephone'
  pageRoute?: PageType & { _type: 'page' }
  eventRoute?: EventType & { _type: 'event' }
  fileRoute?: {
    asset?: {
      url?: string
      originalFilename?: string
    }
  }
  route?: string
  anchor?: string
  link?: string
  email?: string
  telephone?: string
  blank?: boolean
  titleAttr?: string
  ariaLabel?: string
}
