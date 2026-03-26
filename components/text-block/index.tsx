'use client'

import { motion } from 'framer-motion'
import NormalText from '@/components/normal-text'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'

type TextBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: 'primary' | 'secondary' | 'texture'
  contentAlignment?: string
  content?: unknown
}

export default function TextBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  contentAlignment = 'left',
  content,
}: TextBlockProps) {
  if (!active) return null

  const alignClass =
    contentAlignment === 'center' ? 'text-center' : contentAlignment === 'right' ? 'text-right' : 'text-left'
  const bgClass =
    backgroundColor === 'secondary'
      ? 'bg-primary text-primary-foreground'
      : backgroundColor === 'texture'
        ? 'relative bg-black'
        : ''

  return (
    <section
      id={anchor || `text-block-${componentIndex}`}
      className={`text-block w-full flex justify-center px-5 py-16 md:py-24 ${bgClass}`}
    >
      {backgroundColor === 'texture' ? <TextureSectionBackdrop /> : null}
      <motion.div
        className={`container ${alignClass} ${backgroundColor === 'texture' ? 'relative z-10 text-foreground' : ''}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="content">
          <NormalText content={content} />
        </div>
      </motion.div>
    </section>
  )
}
