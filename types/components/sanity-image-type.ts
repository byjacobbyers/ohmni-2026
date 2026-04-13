import type { urlFor } from '@/sanity/lib/image'

export type SanityImageSource = Parameters<typeof urlFor>[0]

export type SanityImageProps = {
  image: SanityImageSource | null | undefined
  alt?: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
  priority?: boolean
  quality?: number
}
