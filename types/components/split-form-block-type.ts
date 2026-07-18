import type { SimpleTextProps } from '@/types/components/simple-text-type'
import type { SanityFormDocument } from '@/types/components/form-config-type'

export type SplitFormBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: string
  content?: SimpleTextProps['content']
  form?: SanityFormDocument | null
}
