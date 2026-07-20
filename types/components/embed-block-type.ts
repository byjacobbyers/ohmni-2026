export type EmbedCodeValue =
  | string
  | { code?: string; language?: string }
  | null
  | undefined

export type EmbedBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: string
  title?: string | null
  embedCode?: EmbedCodeValue
  maxWidth?: string
}
