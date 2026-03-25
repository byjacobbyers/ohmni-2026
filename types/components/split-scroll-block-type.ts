/** Portable text block (simpleText) — aligned with FAQ / column usage */
export type SplitScrollBlockItem = {
  _key?: string
  image?: {
    asset?: { metadata?: { dimensions?: { width?: number; height?: number } } }
    alt?: string
    [key: string]: unknown
  } | null
  content?: unknown
}

export type SplitScrollBlockType = {
  _type: 'splitScrollBlock'
  _key?: string
  active?: boolean
  anchor?: string
  title?: unknown
  items?: SplitScrollBlockItem[]
}
