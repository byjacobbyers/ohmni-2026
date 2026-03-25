'use client'

import { motion } from 'framer-motion'
import NormalText from '@/components/normal-text'

type TextBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundColor?: 'primary' | 'secondary'
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
  const bgClass = backgroundColor === 'secondary' ? 'bg-primary text-primary-foreground' : ''

  return (
    <section
      id={anchor || `text-block-${componentIndex}`}
      className={`text-block w-full flex justify-center px-5 py-16 ${bgClass}`}
    >
      <motion.div
        className={`container ${alignClass}`}
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
