import AppearAnimation from '@/components/appear-animation'
import SimpleText from '@/components/simple-text'
import LeadForm from '@/components/form-block/lead-form'
import { sanityFetch } from '@/sanity/lib/live'
import { formSettingsQuery } from '@/sanity/queries/documents/form-query'
import { resolveFormConfig } from '@/lib/form-config'
import type { FormBlockProps } from '@/types/components/form-block-type'
import type { FormSettingsData, SanityFormDocument } from '@/types/components/form-config-type'

export default async function FormBlock({
  active = true,
  componentIndex = 0,
  anchor,
  content,
  form,
}: FormBlockProps) {
  if (active === false) return null

  const { data: settings } = (await sanityFetch({
    query: formSettingsQuery,
    stega: false,
  })) as { data: FormSettingsData | null }

  const config = resolveFormConfig(form as SanityFormDocument | null, settings)

  return (
    <section
      id={anchor || `form-${componentIndex}`}
      className="form-block w-full flex justify-center px-5 py-16 lg:py-24 bg-primary text-primary-foreground"
    >
      <AppearAnimation
        className="container flex w-full max-w-2xl flex-col justify-center mx-auto"
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
          <div className="bg-background text-foreground shadow-lg mt-8">
            <LeadForm config={config} />
          </div>
        ) : null}
      </AppearAnimation>
    </section>
  )
}
