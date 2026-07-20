import type { SanityImageSource } from '@/types/components/sanity-image-type'

export type LogoBarEntry = {
  _key?: string
  logo?: SanityImageSource
  name?: string
}

export type LogoBarBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: string
  eyebrow?: string
  logos?: LogoBarEntry[]
}
