import AppearAnimation from '@/components/appear-animation'
import { cleanStega } from '@/lib/stega'
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
  title,
  embedCode,
  maxWidth = 'max-w-2xl',
}: EmbedBlockProps) {
  const html = cleanStega(getCodeString(embedCode)).trim()

  if (active === false) return null
  if (!html) return null

  const iframeTitle = title?.trim() || 'Embedded content'

  return (
    <section
      id={anchor || `embed-block-${componentIndex}`}
      className="embed-block w-full flex justify-center px-5 py-16 md:py-24"
      aria-label={iframeTitle}
    >
      <AppearAnimation className={`container w-full ${maxWidth} mx-auto content`}>
        {title ? <h2 className="text-center mb-6">{title}</h2> : null}
        <div
          className="embed-block__inner relative w-full min-h-[300px] rounded-lg overflow-hidden border border-border [&_iframe]:block [&_iframe]:min-h-[300px] [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:border-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </AppearAnimation>
    </section>
  )
}
