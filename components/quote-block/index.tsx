import AppearAnimation from '@/components/appear-animation'
import SimpleText from '@/components/simple-text'
import CtaRouteButton from '@/components/cta-route-button'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { isActiveCta } from '@/lib/cta'
import { cn } from '@/lib/utils'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import { urlFor } from '@/sanity/lib/image'
import type { QuoteBlockProps } from '@/types/components/quote-block-type'

function attributionInitials(name?: string): string {
  if (!name?.trim()) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
}

export default function QuoteBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  image,
  quote,
  title,
  cta,
}: QuoteBlockProps) {
  if (active === false) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)

  const hasPortrait = Boolean(
    image && typeof image === 'object' && 'asset' in image && image.asset
  )
  const portraitUrl = hasPortrait
    ? urlFor(image!).width(128).height(128).fit('crop').quality(80).url()
    : null
  const portraitAlt =
    hasPortrait && image && typeof image === 'object' && 'alt' in image
      ? (image as { alt?: string }).alt || title || 'Portrait'
      : title || 'Portrait'

  return (
    <section
      id={anchor || `quote-block-${componentIndex}`}
      className={cn(
        'quote-block flex w-full justify-center px-5 py-16 md:py-24',
        sectionClass
      )}
    >
      {showTexture ? <TextureSectionBackdrop /> : null}
      <div className={cn('container', innerLiftClass)}>
        <AppearAnimation className="flex flex-col gap-8">
          {quote ? (
            <blockquote className="text-3xl leading-tight text-balance md:text-4xl lg:text-5xl">
              <SimpleText content={quote} />
            </blockquote>
          ) : null}

          {(hasPortrait || title) && (
            <footer className="flex items-center gap-4">
              <Avatar className="size-12 shrink-0 border border-border md:size-14">
                {portraitUrl ? (
                  <AvatarImage src={portraitUrl} alt={portraitAlt} />
                ) : null}
                <AvatarFallback>{attributionInitials(title)}</AvatarFallback>
              </Avatar>
              {title ? (
                <cite className="not-italic text-base font-medium tracking-wide text-muted-foreground md:text-lg">
                  {title}
                </cite>
              ) : null}
            </footer>
          )}

          {isActiveCta(cta) ? (
            <div>
              <CtaRouteButton route={cta.route} variant="default" />
            </div>
          ) : null}
        </AppearAnimation>
      </div>
    </section>
  )
}
