export type PanelType = {
  _key?: string
  eyebrow?: string
  title?: string
  tags?: string[]
  body?: unknown[]
  highlight?: boolean
}

export type PanelsBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: string
  kicker?: string
  heading?: string
  intro?: string
  columnsPerRow?: number
  panels?: PanelType[]
  note?: unknown[]
}
