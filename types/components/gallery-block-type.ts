export type GalleryBlockImage = {
  asset?: { metadata?: { dimensions?: { width?: number; height?: number } } }
  [key: string]: unknown
}

export type GalleryBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: string
  images?: GalleryBlockImage[]
  imagesPerRow?: number
  enableLightbox?: boolean
  /** Design gallery: wireframe tiles when no Sanity images */
  showImagePlaceholder?: boolean
  /** How many placeholder tiles (default 6) */
  placeholderCount?: number
}
