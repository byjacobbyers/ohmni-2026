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

  const alignClass =
    alignment === 'text-left' ? 'items-start' : alignment === 'text-right' ? 'items-end' : 'items-center'
  const justifyClass =
    alignment === 'text-left' ? 'justify-start' : alignment === 'text-right' ? 'justify-end' : 'justify-center'
  const bgClass = backgroundColor === 'secondary' ? 'bg-primary text-primary-foreground' : ''

  return (
    <section
      id={anchor || `cta-block-${componentIndex}`}
      className={`cta-block w-full flex justify-center px-5 py-12 ${bgClass}`}
    >
      <div className={`container flex flex-col ${alignClass} justify-center`}>
        <motion.div
          className={`w-full max-w-4xl ${alignment} flex flex-col ${justifyClass} gap-6 mt-5`}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: componentIndex !== 0 ? 0.5 : 0 }}
        >
          {content ? (
            <div className="content">
              <SimpleText content={content} />
            </div>
          ) : null}
          {cta?.active && cta?.route ? (
            <div className={`container flex ${justifyClass}`}>
              <Button
                asChild
                variant={backgroundColor === 'secondary' ? 'secondary' : 'default'}
              >
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
