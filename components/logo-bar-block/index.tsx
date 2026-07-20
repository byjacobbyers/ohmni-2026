'use client'

import { useMemo } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import AppearAnimation from '@/components/appear-animation'
import SanityImage from '@/components/sanity-image'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import { cn } from '@/lib/utils'
import type { LogoBarBlockProps } from '@/types/components/logo-bar-block-type'

export default function LogoBarBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  eyebrow,
  logos = [],
}: LogoBarBlockProps) {
  const multiLogo = logos.length > 1
  const autoScrollPlugin = useMemo(
    () =>
      AutoScroll({
        speed: 1.15,
        startDelay: 0,
        playOnInit: true,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
      }),
    []
  )

  const [emblaRef] = useEmblaCarousel(
    {
      align: 'start',
      loop: multiLogo,
      dragFree: true,
      containScroll: 'trimSnaps',
    },
    multiLogo ? [autoScrollPlugin] : []
  )

  if (active === false) return null
  if (!logos.length && !eyebrow) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)

  return (
    <section
      id={anchor || `logo-bar-block-${componentIndex}`}
      className={cn(
        'logo-bar-block flex w-full justify-center px-5 py-12 md:py-16',
        sectionClass
      )}
    >
      {showTexture ? <TextureSectionBackdrop /> : null}
      <AppearAnimation
        className={cn(
          'container flex w-full min-w-0 max-w-full flex-col items-center gap-8',
          innerLiftClass
        )}
      >
        {eyebrow ? (
          <p className="text-center text-lg tracking-wide text-muted-foreground md:text-xl">
            {eyebrow}
          </p>
        ) : null}

        {logos.length ? (
          <div className="w-full min-w-0 overflow-x-clip" style={{ containerType: 'inline-size' }}>
            <div className="w-full min-w-0 overflow-hidden" ref={emblaRef}>
              <div className="flex touch-pan-y">
                {logos.map((entry, i) => (
                  <div
                    key={entry._key || `logo-${i}`}
                    className="min-w-0 shrink-0 grow-0 basis-[calc((100cqw-1.5rem)/2)] md:basis-[calc((100cqw-5rem)/6)]"
                  >
                    <div className="relative mx-auto aspect-224/64 w-full max-w-[90%] opacity-70 transition-opacity hover:opacity-100">
                      {entry.logo ? (
                        <SanityImage
                          image={entry.logo}
                          alt={entry.name || 'Client logo'}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 50vw, 16vw"
                        />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </AppearAnimation>
    </section>
  )
}
