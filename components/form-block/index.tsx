'use client'

import { motion } from 'motion/react'
import SimpleText from '@/components/simple-text'
import LeadForm from '@/components/form-block/lead-form'
import type { FormBlockProps } from '@/types/components/form-block-type'

export default function FormBlock({
  active = true,
  componentIndex = 0,
  anchor,
  content,
}: FormBlockProps) {
  if (!active) return null

  return (
    <section
      id={anchor || `form-${componentIndex}`}
      className="form-block w-full flex justify-center px-5 py-16 lg:py-24 bg-primary text-primary-foreground"
    >
      <motion.div
        className="container flex w-full max-w-2xl flex-col justify-center mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: componentIndex !== 0 ? 0.5 : 0,
          type: 'spring',
          duration: 1.5,
        }}
      >
        {content ? (
          <div className="content">
            <SimpleText content={content} />
          </div>
        ) : null}

        <div className="bg-background text-foreground shadow-lg p-6 mt-8">
          <LeadForm />
        </div>
      </motion.div>
    </section>
  )
}
