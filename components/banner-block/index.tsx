'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Route from '@/components/route'
import SimpleText from '@/components/simple-text'
import SoftAurora from '@/components/soft-aurora'

type BannerBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  content?: unknown
  cta?: { active?: boolean; route?: unknown } | null
}

export default function BannerBlock({
  active = true,
  componentIndex = 0,
  anchor,
  content,
  cta,
}: BannerBlockProps) {
  if (!active) return null

  return (
    <section
      id={anchor || `banner-block-${componentIndex}`}
      className="banner-block relative w-full flex justify-center px-5 py-16 lg:py-24 bg-black"
    >
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <SoftAurora
          color1="#f7f7f7"
          color2="#3566ff"
          enableMouseInteraction={false}
          speed={0.6}
          scale={1.5}
          brightness={1}
        />
      </div>
      <div className="futuristic-pattern opacity-20 absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden>
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
      <div className="container relative z-10 flex flex-col justify-center text-foreground">
        <motion.div
          className="w-full mx-auto flex flex-col gap-6"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: componentIndex !== 0 ? 0.5 : 0 }}
        >
          {content ? (
            <div className="content [&_h1]:text-display [&_p]:text-body-lg">
              <SimpleText content={content} />
            </div>
          ) : null}
          {cta?.active && cta?.route ? (
            <div className="flex pt-2">
              <Button asChild variant="default">
                <Route data={cta.route as Parameters<typeof Route>[0]['data']}>
                  {(cta.route as { title?: string }).title || 'Learn More'}
                </Route>
              </Button>
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  )
}
