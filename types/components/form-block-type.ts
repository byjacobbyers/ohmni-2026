import type { SanityFormDocument } from '@/types/components/form-config-type'
import type { Locale } from '@/lib/i18n'

export type FormBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  /** stacked = intro above form; split = intro left, form right */
  layout?: 'stacked' | 'split' | string
  backgroundColor?: string
  content?: unknown
  form?: SanityFormDocument | null
  /** Page language: picks the matching Form Settings and the UI strings */
  lang?: Locale
}
