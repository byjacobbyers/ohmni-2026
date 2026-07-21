export type HeroBlockProps = {
  active?: boolean
  componentIndex?: number
  content?: unknown
  layout?: string
  anchor?: string
  backgroundColor?: string
  image?: { asset?: { url?: string }; alt?: string; crop?: unknown; hotspot?: unknown } | null
  /** Design gallery: wireframe slot when no Sanity image */
  showImagePlaceholder?: boolean
  cta?: { active?: boolean; route?: unknown } | null
}
