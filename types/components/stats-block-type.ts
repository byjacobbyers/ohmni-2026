import type { PortableTextBlock } from 'next-sanity'
import type { SanityImageSource } from '@/types/components/sanity-image-type'

export type StatsBlockStat = {
  _key?: string
  statValue?: string
  content?: PortableTextBlock[] | unknown
}

export type StatsBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: string
  heading?: PortableTextBlock[] | unknown
  image?: SanityImageSource | null
  /** Design gallery: wireframe slot when no Sanity image */
  showImagePlaceholder?: boolean
  layout?: 'image-left' | 'image-right' | string
  /** cards = stat tiles with optional image; proof = claims-first strip */
  variant?: 'cards' | 'proof' | string
  stats?: StatsBlockStat[]
  /** Small line under the stats (scope notes, caveats) */
  footnote?: PortableTextBlock[] | unknown
}
