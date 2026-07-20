import AppearAnimation from '@/components/appear-animation'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import { cleanStega } from '@/lib/stega'
import { cn } from '@/lib/utils'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import type { EmbedBlockProps, EmbedCodeValue } from '@/types/components/embed-block-type'

function getCodeString(value: EmbedCodeValue): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'code' in value) {
    return typeof value.code === 'string' ? value.code : ''
  }
  return ''
}

export default function EmbedBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  title,
  embedCode,
  maxWidth = 'max-w-2xl',
}: EmbedBlockProps) {
  const html = cleanStega(getCodeString(embedCode)).trim()

  if (active === false) return null
  if (!html) return null

  const iframeTitle = title?.trim() || 'Embedded content'
  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)

  return (
    <section
      id={anchor || `embed-block-${componentIndex}`}
      className={cn(
        'embed-block w-full flex justify-center px-5 py-16 md:py-24',
        sectionClass
      )}
      aria-label={iframeTitle}
    >
      {showTexture ? <TextureSectionBackdrop /> : null}
      <AppearAnimation
        className={cn(`container w-full ${maxWidth} mx-auto content`, innerLiftClass)}
      >
        {title ? <h2 className="text-center mb-6">{title}</h2> : null}
        <div
          className="embed-block__inner relative w-full min-h-[300px] rounded-lg overflow-hidden border border-border [&_iframe]:block [&_iframe]:min-h-[300px] [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:border-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </AppearAnimation>
    </section>
  )
}
