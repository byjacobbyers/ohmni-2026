import AppearAnimation from '@/components/appear-animation'
import SimpleText from '@/components/simple-text'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import type { FaqBlockProps } from '@/types/components/faq-block-type'

export default function FaqBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  faqs = [],
}: FaqBlockProps) {
  if (active === false || !faqs?.length) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)

  return (
    <section
      id={anchor || `faq-block-${componentIndex}`}
      className={cn(
        'faq-block w-full flex justify-center px-5 py-16 md:py-24',
        sectionClass
      )}
    >
      {showTexture ? <TextureSectionBackdrop /> : null}
      <AppearAnimation
        className={cn('container relative z-10 w-full max-w-full', innerLiftClass)}
      >
        <Accordion type="single" collapsible defaultValue="faq-0">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                {faq.answer && Array.isArray(faq.answer) ? (
                  <div className="content compact input-size">
                    <SimpleText content={faq.answer} />
                  </div>
                ) : null}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </AppearAnimation>
    </section>
  )
}
