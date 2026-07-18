import AppearAnimation from '@/components/appear-animation'
import NormalText from '@/components/normal-text'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import LeadForm from '@/components/form-block/lead-form'
import { cleanStega } from '@/lib/stega'
import type { SplitFormBlockProps } from '@/types/components/split-form-block-type'

function normalizeBackgroundColor(raw?: string): 'primary' | 'secondary' | 'texture' {
  const v = cleanStega(typeof raw === 'string' ? raw : '').toLowerCase()
  if (v === 'secondary' || v === 'texture') return v
  return 'primary'
}

export default function SplitFormBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  content,
  submitLabel,
}: SplitFormBlockProps) {
  if (!active) return null

  const bg = normalizeBackgroundColor(backgroundColor)
  const bgClass =
    bg === 'secondary'
      ? 'bg-primary text-primary-foreground'
      : bg === 'texture'
        ? 'relative bg-black'
        : ''
  const innerLiftClass = bg === 'texture' ? 'relative z-10 text-foreground' : ''

  return (
    <section
      id={anchor || `split-form-block-${componentIndex}`}
      className={`split-form-block w-full flex justify-center px-5 py-16 md:py-24 ${bgClass}`}
    >
      {bg === 'texture' ? <TextureSectionBackdrop /> : null}
      <AppearAnimation
        className={`relative z-10 container flex w-full flex-col gap-10 md:flex-row md:items-start md:gap-12 lg:gap-16 ${innerLiftClass}`}
      >
        <div className="w-full md:w-1/2">
          <div className="content">
            <NormalText content={content} />
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
