import FormBlock from '@/components/form-block'
import type { SplitFormBlockProps } from '@/types/components/split-form-block-type'

/** @deprecated Prefer formBlock with layout="split". Kept for dual-render during migration. */
export default function SplitFormBlock(props: SplitFormBlockProps) {
  return <FormBlock {...props} layout="split" />
}
