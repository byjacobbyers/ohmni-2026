import DividerBlock from '@/components/divider-block'
import type { SpacerBlockProps } from '@/types/components/spacer-block-type'

/** @deprecated Prefer dividerBlock (Spacing) with style="gap". Dual-render alias. */
export default function SpacerBlock(props: SpacerBlockProps) {
  return <DividerBlock {...props} style="gap" size={props.size || 'medium'} />
}
