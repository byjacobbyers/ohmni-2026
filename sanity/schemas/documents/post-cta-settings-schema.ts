import { defineField, defineType } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons/Envelope'

/**
 * Singleton for the default closing CTA on posts.
 * Per-post override lives on the post document (`cta`); this is the fallback.
 */
export default defineType({
  name: 'postCtaSettings',
  title: 'Post CTA Settings',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'cta',
      title: 'Default Article CTA',
      type: 'ctaBlock',
      description:
        'Shown at the end of every article that does not set its own closing call to action. Override per post under Closing call to action.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Post CTA Settings' }
    },
  },
})
