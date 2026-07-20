import type { PortableTextBlock } from 'next-sanity'
import type { SanityImageSource } from '@/types/components/sanity-image-type'
import type { BaseRouteType } from '@/types/objects/route-type'

export type QuoteBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  image?: SanityImageSource | null
  quote?: PortableTextBlock[] | unknown
  title?: string
  cta?: {
    active?: boolean
    route?: BaseRouteType | Record<string, unknown>
  } | null
}
