import AppearAnimation from '@/components/appear-animation'
import CtaRouteButton from '@/components/cta-route-button'
import { isActiveCta } from '@/lib/cta'
import SanityImage from '@/components/sanity-image'
import SimpleText from '@/components/simple-text'
import type { HeroBlockProps } from '@/types/components/hero-block-type'

export default function HeroBlock({
  active = true,
  componentIndex = 0,
  layout = 'image-right',
  anchor,
  image,
  content,
  cta,
}: HeroBlockProps) {
  if (active === false) return null

  const layoutClass = layout === 'image-left' ? 'md:flex-row-reverse' : 'md:flex-row'
  const delay = componentIndex !== 0 ? 0.5 : 0

  return (
    <section
      id={anchor || `hero-block-${componentIndex}`}
      className="hero-block w-full flex justify-center px-5"
    >
      <div
        className={`container flex flex-wrap md:flex-nowrap ${layoutClass} flex-col-reverse items-center w-full gap-10`}
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
        <AppearAnimation className="w-full md:w-1/2 relative" scale delay={delay}>
          {image ? (
            <SanityImage
              image={image}
              fill={false}
              alt={image.alt || 'Hero'}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : null}
        </AppearAnimation>
      </div>
    </section>
  )
}
