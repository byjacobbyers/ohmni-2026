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
  layout?: 'image-left' | 'image-right' | string
  stats?: StatsBlockStat[]
}
