export type ColumnBlockColumn = {
  _key?: string
  title?: string
  content?: unknown
  icon?: 'LuClock' | 'LuCode' | 'LuLayers' | string
  image?: {
    asset?: { metadata?: { dimensions?: { width?: number; height?: number } } }
    [key: string]: unknown
  } | null
  highlight?: boolean
  cta?: { active?: boolean; route?: { title?: string; [key: string]: unknown } } | null
}

export type ColumnBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: string
  cardStyle?: 'logo' | 'project' | string
  title?: string
  /** Optional rich intro above the card grid. */
  intro?: unknown
  /** @deprecated Prefer intro — kept for migrated problemBlock content. */
  content?: unknown
  /** Optional rich footer below the card grid. */
  excerpt?: unknown
  columnsPerRow?: number
  columns?: ColumnBlockColumn[]
  /** Design gallery: wireframe media when project cards have no image */
  showImagePlaceholder?: boolean
}
