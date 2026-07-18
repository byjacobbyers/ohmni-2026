import AppearAnimation from '@/components/appear-animation'
import SimpleText from '@/components/simple-text'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import type { TextBlockProps } from '@/types/components/text-block-type'

export default function TextBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  contentAlignment = 'left',
  content,
}: TextBlockProps) {
  if (active === false) return null

  const alignClass =
    contentAlignment === 'center' ? 'text-center' : contentAlignment === 'right' ? 'text-right' : 'text-left'
  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)

  return (
    <section
      id={anchor || `text-block-${componentIndex}`}
      className={`text-block w-full flex justify-center px-5 py-16 md:py-24 ${sectionClass}`}
    >
      {showTexture ? <TextureSectionBackdrop /> : null}
      <AppearAnimation className={`container ${alignClass} ${innerLiftClass}`}>
        <div className="content">
          <SimpleText content={content} />
        </div>
      </AppearAnimation>
    </section>
  )
}
