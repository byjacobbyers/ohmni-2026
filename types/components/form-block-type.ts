import type { SanityFormDocument } from '@/types/components/form-config-type'

export type FormBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  content?: unknown
  form?: SanityFormDocument | null
}
