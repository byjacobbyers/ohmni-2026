export type BannerBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: 'primary' | 'secondary' | 'texture' | 'aurora' | string
  content?: unknown
  cta?: { active?: boolean; route?: unknown } | null
}
