import { PageType } from '../documents/page-type'
import { EventType } from '../documents/event-type'
import { PostType } from '../documents/post-type'

export type UtmParametersType = {
  source?: string
  medium?: string
  campaign?: string
  term?: string
  content?: string
}

export type DataAttributeType = {
  key: string
  value: string
  _key?: string
}

export type BaseRouteType = {
  _type: string
  title?: string
  /** One-line blurb used where the link renders as a card */
  description?: string
  /** Icon name from the shared vocabulary, e.g. 'LuTag' */
  icon?: string
  linkType: 'page' | 'event' | 'post' | 'path' | 'anchor' | 'file' | 'external' | 'email' | 'telephone'
  /* routeQuery projects "slug": slug.current, so slug arrives as a plain string */
  pageRoute?: Omit<PageType, 'slug'> & { _type: 'page'; slug?: string; language?: string }
  eventRoute?: Omit<EventType, 'slug'> & { _type: 'event'; slug?: string }
  postRoute?: Omit<PostType, 'slug'> & { _type: 'post'; slug?: string; language?: string }
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
  utm?: UtmParametersType
  trackingId?: string
  relAttributes?: string[]
  dataAttributes?: DataAttributeType[]
}
