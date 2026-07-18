import AppearAnimation from '@/components/appear-animation'
import SimpleText from '@/components/simple-text'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import LeadForm from '@/components/form-block/lead-form'
import { sanityFetch } from '@/sanity/lib/live'
import { formSettingsQuery } from '@/sanity/queries/documents/form-query'
import { resolveFormConfig } from '@/lib/form-config'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import type { SplitFormBlockProps } from '@/types/components/split-form-block-type'
import type { FormSettingsData, SanityFormDocument } from '@/types/components/form-config-type'

export default async function SplitFormBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  content,
  form,
}: SplitFormBlockProps) {
  if (active === false) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)

  const { data: settings } = (await sanityFetch({
    query: formSettingsQuery,
    stega: false,
  })) as { data: FormSettingsData | null }

  const config = resolveFormConfig(form as SanityFormDocument | null, settings)

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

        <div className="w-full md:w-1/2 md:sticky md:top-24 md:self-start">
          {config ? (
            <div className="bg-background text-foreground shadow-lg">
              <LeadForm config={config} />
            </div>
          ) : null}
        </div>
      </AppearAnimation>
    </section>
  )
}
