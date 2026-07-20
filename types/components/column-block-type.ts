export type ColumnBlockColumn = {
  _key?: string
  title?: string
  content?: unknown
  image?: {
    asset?: { metadata?: { dimensions?: { width?: number; height?: number } } }
    [key: string]: unknown
  } | null
  cta?: { active?: boolean; route?: { title?: string; [key: string]: unknown } } | null
}

export type ColumnBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: string
  cardStyle?: 'logo' | 'project' | string
  title?: string
  columnsPerRow?: number
  columns?: ColumnBlockColumn[]
  /** @deprecated Dual-render from projectColumnsBlock */
  projects?: ColumnBlockColumn[]
}
