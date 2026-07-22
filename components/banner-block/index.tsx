import AppearAnimation from '@/components/appear-animation'
import CtaRouteButton from '@/components/cta-route-button'
import { isActiveCta } from '@/lib/cta'
import SimpleText from '@/components/simple-text'
import SoftAurora from '@/components/soft-aurora'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import { cleanStega } from '@/lib/stega'
import { cn } from '@/lib/utils'
import type { BannerBlockProps } from '@/types/components/banner-block-type'

export default function BannerBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'aurora',
  content,
  cta,
}: BannerBlockProps) {
  if (active === false) return null

  const raw = cleanStega(typeof backgroundColor === 'string' ? backgroundColor : '')
  const useAurora = raw === 'aurora' || raw === ''
  const bg = useAurora ? 'texture' : normalizeSectionBackground(raw)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)

  return (
    <section
      id={anchor || `banner-block-${componentIndex}`}
      className={cn(
        'banner-block relative w-full flex justify-center px-5 py-16 md:py-24',
        useAurora ? 'bg-black' : sectionClass
      )}
    >
      {useAurora ? (
        <>
          <div className="absolute inset-0 h-full w-full pointer-events-none">
            <SoftAurora
              color1="#f7f7f7"
              color2="#3566ff"
              enableMouseInteraction={false}
              speed={0.6}
              scale={1.5}
              brightness={1}
            />
          </div>
          <div
            className="futuristic-pattern absolute top-0 left-0 h-full w-full opacity-20 pointer-events-none"
            aria-hidden
          >
            <span className="ripple-overlay" />
            <svg className="texture-filter" aria-hidden>
              <filter id="advanced-texture">
                <feTurbulence
                  result="noise"
                  numOctaves="3"
                  baseFrequency="0.7"
                  type="fractalNoise"
                />
                <feSpecularLighting
                  result="specular"
                  lightingColor="white"
                  specularExponent="20"
                  specularConstant="0.8"
                  surfaceScale="2"
                  in="noise"
                >
                  <fePointLight z="100" y="50" x="50" />
                </feSpecularLighting>
                <feComposite
                  result="litNoise"
                  operator="in"
                  in2="SourceGraphic"
                  in="specular"
                />
                <feBlend mode="overlay" in2="litNoise" in="SourceGraphic" />
              </filter>
            </svg>
          </div>
        </>
      ) : showTexture ? (
        <TextureSectionBackdrop />
      ) : null}
      <AppearAnimation
        className={cn(
          'container relative z-10 mx-auto flex w-full flex-col justify-center gap-6 text-foreground',
          innerLiftClass
        )}
        scale
        delay={componentIndex !== 0 ? 0.5 : 0}
      >
        {content ? (
          <div className="content [&_h1]:text-display ">
            <SimpleText content={content} />
          </div>
        ) : null}
        {isActiveCta(cta) ? (
          <div className="flex justify-center pt-2 md:justify-start">
            <CtaRouteButton route={cta.route} variant="default" />
          </div>
        ) : null}
      </AppearAnimation>
    </section>
  )
}
