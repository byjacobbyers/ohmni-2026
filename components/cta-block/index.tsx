'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Route from '@/components/route'
import SimpleText from '@/components/simple-text'

type CtaBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: 'primary' | 'secondary'
  content?: unknown
  alignment?: string
  cta?: { active?: boolean; route?: unknown } | null
}

export default function CtaBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  alignment = 'text-center',
  content,
  cta,
}: CtaBlockProps) {
  if (!active) return null

  const bgClass = backgroundColor === 'secondary' ? 'bg-primary text-primary-foreground' : ''
  const copyAlignClass = alignment ?? 'text-center'
  const stackItemsClass =
    copyAlignClass === 'text-left'
      ? 'items-start'
      : copyAlignClass === 'text-right'
        ? 'items-end'
        : 'items-center'
  const buttonVariant = backgroundColor === 'secondary' ? 'secondary' : 'huge'

  return (
    <section
      id={anchor || `cta-block-${componentIndex}`}
      className={`cta-block w-full flex justify-center px-5 py-16 md:py-24 ${bgClass}`}
    >
      <div className="container">
        <motion.div
          className={`mt-5 flex w-full flex-col gap-6 ${stackItemsClass}`}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: componentIndex !== 0 ? 0.5 : 0 }}
        >
          {content ? (
            <div className={`w-full ${copyAlignClass}`}>
              <div className="content">
                <SimpleText content={content} />
              </div>
            </div>
          ) : null}
          {cta?.active && cta?.route ? (
            <div className="shrink-0 pt-5">
              <Button asChild variant={buttonVariant}>
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
