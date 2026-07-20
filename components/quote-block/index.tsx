import AppearAnimation from '@/components/appear-animation'
import SanityImage from '@/components/sanity-image'
import SimpleText from '@/components/simple-text'
import CtaRouteButton from '@/components/cta-route-button'
import { isActiveCta } from '@/lib/cta'
import type { QuoteBlockProps } from '@/types/components/quote-block-type'

export default function QuoteBlock({
  active = true,
  componentIndex = 0,
  anchor,
  image,
  quote,
  title,
  cta,
}: QuoteBlockProps) {
  if (active === false) return null

  const hasBackgroundImage = Boolean(
    image && typeof image === 'object' && 'asset' in image && image.asset
  )

  return (
    <section
      id={anchor || `quote-block-${componentIndex}`}
      className="quote-block relative flex min-h-[500px] w-full items-center md:min-h-[600px]"
    >
      {hasBackgroundImage ? (
        <>
          <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
            <SanityImage
              image={image!}
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 z-10 bg-black/40" aria-hidden />
        </>
      ) : (
        <div className="absolute inset-0 z-0 bg-muted" aria-hidden />
      )}

      <div className="relative z-20 w-full px-5 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="container mx-auto max-w-2xl">
          <AppearAnimation>
            {quote ? (
              <blockquote
                className={`mb-6 text-3xl leading-tight md:text-4xl lg:text-5xl ${
                  hasBackgroundImage ? 'text-white' : 'text-foreground'
                }`}
              >
                <SimpleText content={quote} />
              </blockquote>
            ) : null}
            {title ? (
              <p
                className={`mb-8 text-lg uppercase tracking-wider md:text-xl ${
                  hasBackgroundImage ? 'text-white/90' : 'text-muted-foreground'
                }`}
              >
                {title}
              </p>
            ) : null}
            {isActiveCta(cta) ? (
              <div className="mt-10">
                <CtaRouteButton
                  route={cta.route}
                  variant={hasBackgroundImage ? 'secondary' : 'default'}
                />
              </div>
            ) : null}
          </AppearAnimation>
        </div>
      </div>
    </section>
  )
}
