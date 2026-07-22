export type VideoBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: 'primary' | 'secondary' | 'texture' | string
  videoProvider?: 'mux' | 'vimeo'
  muxUrl?: { asset?: { playbackId?: string } }
  muxUrlMobile?: { asset?: { playbackId?: string } } | null
  vimeoUrl?: string | null
  vimeoUrlMobile?: string | null
  maxWidth?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
}
