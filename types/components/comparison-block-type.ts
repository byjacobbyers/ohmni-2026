export type ComparisonRowType = {
  _key?: string
  label?: string
  value?: string
}

export type ComparisonColumnType = {
  _key?: string
  title?: string
  subtitle?: string
  rows?: ComparisonRowType[]
  totalLabel?: string
  total?: string
  footnote?: string
  highlight?: boolean
}

export type ComparisonBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: string
  /** String today; may be legacy portable text on older documents. */
  heading?: unknown
  intro?: string
  columns?: ComparisonColumnType[]
  note?: string
}
