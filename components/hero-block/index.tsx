import AppearAnimation from '@/components/appear-animation'
import CtaRouteButton from '@/components/cta-route-button'
import { isActiveCta } from '@/lib/cta'
import SanityImage from '@/components/sanity-image'
import SimpleText from '@/components/simple-text'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'
import { cn } from '@/lib/utils'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import type { HeroBlockProps } from '@/types/components/hero-block-type'

export default function HeroBlock({
  active = true,
  componentIndex = 0,
  layout = 'image-right',
  anchor,
  backgroundColor = 'primary',
  image,
  showImagePlaceholder = false,
  content,
  cta,
}: HeroBlockProps) {
  if (active === false) return null

  const layoutClass = layout === 'image-left' ? 'md:flex-row-reverse' : 'md:flex-row'
  const delay = componentIndex !== 0 ? 0.5 : 0
  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)
  const hasImage = Boolean(image)
  const showMedia = hasImage || showImagePlaceholder

  return (
    <section
      id={anchor || `hero-block-${componentIndex}`}
      className={cn(
        'hero-block w-full flex justify-center px-5 py-16 md:py-24',
        sectionClass
      )}
    >
      {showTexture ? <TextureSectionBackdrop /> : null}
      <div
        className={cn(
          'container flex flex-wrap md:flex-nowrap flex-col-reverse items-center w-full gap-10',
          layoutClass,
          innerLiftClass
        )}
      >
        <AppearAnimation
          className="w-full md:w-1/2 flex flex-col gap-6"
          scale
          delay={delay}
        >
          {content ? (
            <div className="content">
              <SimpleText content={content} />
            </div>
          ) : null}
          {isActiveCta(cta) ? (
            <div className="flex">
              <CtaRouteButton route={cta.route} variant="default" className="mt-5" />
            </div>
          ) : null}
        </AppearAnimation>
        {showMedia ? (
          <AppearAnimation className="relative w-full md:w-1/2" scale delay={delay}>
            {hasImage ? (
              <SanityImage
                image={image}
                fill={false}
                alt={image?.alt || 'Feature'}
                className="h-auto w-full object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <ImagePlaceholder aspect="video" caption="Hero media" />
            )}
          </AppearAnimation>
        ) : null}
      </div>
    </section>
  )
}
