import type { SanityFormDocument } from '@/types/components/form-config-type'

export type FormBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  /** stacked = intro above form; split = intro left, form right */
  layout?: 'stacked' | 'split' | string
  backgroundColor?: string
  content?: unknown
  form?: SanityFormDocument | null
}
