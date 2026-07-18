import type { SimpleTextProps } from '@/types/components/simple-text-type'

export type SplitFormBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: string
  content?: SimpleTextProps['content']
  submitLabel?: string
}
