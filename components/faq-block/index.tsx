'use client'

import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/lib/portable-text-components'

type Faq = {
  question?: string
  answer?: unknown
}

type FaqBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  faqs?: Faq[]
}

export default function FaqBlock({
  active = true,
  componentIndex = 0,
  anchor,
  faqs = [],
}: FaqBlockProps) {
  if (!active || !faqs?.length) return null

  return (
    <section
      id={anchor || `faq-block-${componentIndex}`}
      className="faq-block w-full flex justify-center px-5 py-12"
    >
      <div className="container max-w-3xl">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-border pb-6">
              <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
              {faq.answer && Array.isArray(faq.answer) ? (
                <div className="prose prose-sm max-w-none">
                  <PortableText
                  value={faq.answer as Parameters<typeof PortableText>[0]['value']}
                  components={portableTextComponents}
                />
                </div>
              ) : null}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
