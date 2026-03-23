'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Route from '@/components/route'
import SimpleText from '@/components/simple-text'

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
      className="banner-block w-full flex justify-center px-5 py-16 lg:py-24"
    >
      <div className="container flex flex-col justify-center">
        <motion.div
          className="w-full mx-auto flex flex-col gap-6"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: componentIndex !== 0 ? 0.5 : 0 }}
        >
          {content ? (
            <div className="content text-body-lg [&_h1]:text-display [&_h1]:text-foreground [&_h1]:m-0 [&_p]:text-body-lg [&_p]:mb-0 [&_p]:mt-4">
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
