'use client'

import { motion } from 'framer-motion'
import SimpleText from '@/components/simple-text'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

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
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible defaultValue="faq-0" className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-xl font-semibold cursor-pointer">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-left text-balance">
                  {faq.answer && Array.isArray(faq.answer) ? (
                    <div className="rich-text">
                      <SimpleText content={faq.answer} />
                    </div>
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
