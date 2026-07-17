import type { NormalTextProps } from '@/types/components/normal-text-type'

export type SplitFormBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: string
  content?: NormalTextProps['content']
  submitLabel?: string
}
