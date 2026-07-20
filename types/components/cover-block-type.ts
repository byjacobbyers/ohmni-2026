/** Matches text block + schema. Legacy `black` / `white` still render; old `primary` (brand fill) is now `secondary` in Studio—stored `primary` reads as default surface. */
export type CoverColorBg = 'primary' | 'secondary' | 'texture' | 'legacyBlack'

export type CoverBlockImage = {
  asset?: {
    url?: string
    metadata?: { dimensions?: { width?: number; height?: number } }
  }
  alt?: string
  crop?: unknown
  hotspot?: { x?: number; y?: number }
}

export type CoverBlockImageMobile = {
  asset?: {
    url?: string
    metadata?: { dimensions?: { width?: number; height?: number } }
  }
  hotspot?: { x?: number; y?: number }
}

export type CoverBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundType?: 'image' | 'color' | 'video' | string
  image?: CoverBlockImage
  imageMobile?: CoverBlockImageMobile | null
  backgroundColor?: string
  height?: 'auto' | 'full' | 'threeQuarter' | 'half' | string
  overlayColor?: 'none' | 'black' | 'white' | 'primary'
  overlayOpacity?: number
  contentPosition?: string
  contentHalfWidth?: boolean
  content?: unknown
  cta?: { active?: boolean; route?: unknown } | null
  videoProvider?: string
  muxUrl?: unknown
  muxUrlMobile?: unknown
  vimeoUrl?: string
  vimeoUrlMobile?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
}
