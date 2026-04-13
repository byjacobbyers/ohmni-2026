export type ProjectColumnsBlockItem = {
  _key?: string
  title?: string
  content?: unknown
  image?: {
    asset?: { metadata?: { dimensions?: { width?: number; height?: number } } }
    [key: string]: unknown
  } | null
  cta?: { active?: boolean; route?: { title?: string; [key: string]: unknown } } | null
}

export type ProjectColumnsBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: string
  title?: string
  columnsPerRow?: number
  projects?: ProjectColumnsBlockItem[]
}
