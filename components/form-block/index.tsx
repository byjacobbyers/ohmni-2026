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
import type { FormBlockProps } from '@/types/components/form-block-type'
import type { FormSettingsData, SanityFormDocument } from '@/types/components/form-config-type'

export default async function FormBlock({
  active = true,
  componentIndex = 0,
  anchor,
  layout = 'stacked',
  backgroundColor = 'primary',
  content,
  form,
}: FormBlockProps) {
  if (active === false) return null

  const isSplit = layout === 'split'
  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)

  const { data: settings } = (await sanityFetch({
    query: formSettingsQuery,
    stega: false,
  })) as { data: FormSettingsData | null }

  const config = resolveFormConfig(form as SanityFormDocument | null, settings)

  if (isSplit) {
    return (
      <section
        id={anchor || `form-${componentIndex}`}
        className={`form-block form-block--split w-full flex justify-center px-5 py-16 md:py-24 ${sectionClass}`}
      >
        {showTexture ? <TextureSectionBackdrop /> : null}
        <AppearAnimation
          className={`relative z-10 container flex w-full flex-col gap-10 md:flex-row md:items-start md:gap-12 lg:gap-16 ${innerLiftClass}`}
        >
          <div className="w-full md:w-1/2">
            {content ? (
              <div className="content">
                <SimpleText content={content} />
              </div>
            ) : null}
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

  return (
    <section
      id={anchor || `form-${componentIndex}`}
      className={`form-block form-block--stacked w-full flex justify-center px-5 py-16 md:py-24 ${sectionClass}`}
    >
      {showTexture ? <TextureSectionBackdrop /> : null}
      <AppearAnimation
        className={`relative z-10 container mx-auto flex w-full max-w-2xl flex-col justify-center ${innerLiftClass}`}
        scale
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

        {config ? (
          <div className="mt-8 bg-background text-foreground shadow-lg">
            <LeadForm config={config} />
          </div>
        ) : null}
      </AppearAnimation>
    </section>
  )
}
