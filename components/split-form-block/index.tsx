import AppearAnimation from '@/components/appear-animation'
import SimpleText from '@/components/simple-text'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import LeadForm from '@/components/form-block/lead-form'
import { cleanStega } from '@/lib/stega'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import type { SplitFormBlockProps } from '@/types/components/split-form-block-type'

export default function SplitFormBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  content,
  submitLabel,
}: SplitFormBlockProps) {
  if (active === false) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)

  return (
    <section
      id={anchor || `split-form-block-${componentIndex}`}
      className={`split-form-block w-full flex justify-center px-5 py-16 md:py-24 ${sectionClass}`}
    >
      {showTexture ? <TextureSectionBackdrop /> : null}
      <AppearAnimation
        className={`relative z-10 container flex w-full flex-col gap-10 md:flex-row md:items-start md:gap-12 lg:gap-16 ${innerLiftClass}`}
      >
        <div className="w-full md:w-1/2">
          <div className="content">
            <SimpleText content={content} />
          </div>
        </div>

        {/* Sticky on md+: the form pins below the header and follows while the content column scrolls */}
        <div className="w-full md:w-1/2 md:sticky md:top-24 md:self-start">
          <div className="bg-background text-foreground shadow-lg">
            <LeadForm
              formName="split-form"
              submitLabel={cleanStega(submitLabel || '') || undefined}
            />
          </div>
        </div>
      </AppearAnimation>
    </section>
  )
}
