export type ImageBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  image?: { asset?: { url?: string }; alt?: string; crop?: unknown; hotspot?: unknown } | null
  imageMobile?: { asset?: { url?: string }; alt?: string; crop?: unknown; hotspot?: unknown } | null
  maxWidth?: string
}
