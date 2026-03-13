'use client'

import HeroBlock from '@/components/hero-block'
import CtaBlock from '@/components/cta-block'
import TextBlock from '@/components/text-block'
import ImageBlock from '@/components/image-block'
import FaqBlock from '@/components/faq-block'
import EmbedBlock from '@/components/embed-block'
import SpacerBlock from '@/components/spacer-block'
import DividerBlock from '@/components/divider-block'

const blockMap: Record<string, React.FC<Record<string, unknown>>> = {
  heroBlock: HeroBlock as React.FC<Record<string, unknown>>,
  ctaBlock: CtaBlock as React.FC<Record<string, unknown>>,
  textBlock: TextBlock as React.FC<Record<string, unknown>>,
  imageBlock: ImageBlock as React.FC<Record<string, unknown>>,
  faqBlock: FaqBlock as React.FC<Record<string, unknown>>,
  embedBlock: EmbedBlock as React.FC<Record<string, unknown>>,
  spacerBlock: SpacerBlock as React.FC<Record<string, unknown>>,
  dividerBlock: DividerBlock as React.FC<Record<string, unknown>>,
}

export default function Sections({
  body,
}: {
  body?: Array<{ _type?: string; _key?: string } & Record<string, unknown>>
}) {
  if (!body?.length) return null

  return (
    <>
      {body.map((block, i) => {
        const key = block._key || `block-${i}`
        const Component = block._type ? blockMap[block._type] : null
        if (!Component) return null
        return (
          <Component
            key={key}
            componentIndex={i}
            {...block}
          />
        )
      })}
    </>
  )
}
