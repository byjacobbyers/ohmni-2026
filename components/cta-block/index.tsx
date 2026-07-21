import CtaRouteButton from '@/components/cta-route-button'
import { isActiveCta } from '@/lib/cta'
import SimpleText from '@/components/simple-text'
import { secondarySectionClass } from '@/lib/section-background'
import type { CtaBlockProps } from '@/types/components/cta-block-type'

export default function CtaBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  alignment = 'text-center',
  content,
  cta,
}: CtaBlockProps) {
  if (active === false) return null

  const bgClass = secondarySectionClass(backgroundColor)
  const copyAlignClass = alignment ?? 'text-center'
  const stackItemsClass =
    copyAlignClass === 'text-left'
      ? 'items-start'
      : copyAlignClass === 'text-right'
        ? 'items-end'
        : 'items-center'
  const buttonJustifyClass =
    copyAlignClass === 'text-left'
      ? 'justify-start'
      : copyAlignClass === 'text-right'
        ? 'justify-end'
        : 'justify-center'
  const buttonVariant = backgroundColor === 'secondary' ? 'secondary' : 'huge'

  return (
    <section
      id={anchor || `cta-block-${componentIndex}`}
      className={`cta-block w-full flex justify-center px-5 py-16 md:py-24 ${bgClass}`}
    >
      <div className={`container mt-5 flex w-full flex-col gap-6 ${stackItemsClass}`}>
        {content ? (
          <div className={`w-full ${copyAlignClass}`}>
            <div className="content">
              <SimpleText content={content} />
            </div>
          </div>
        ) : null}
        {isActiveCta(cta) ? (
          <div className={`flex w-full pt-5 ${buttonJustifyClass}`}>
            <CtaRouteButton route={cta.route} variant={buttonVariant} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
