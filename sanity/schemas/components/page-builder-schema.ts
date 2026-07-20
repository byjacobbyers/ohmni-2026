import { defineField } from 'sanity'

/**
 * Page builder: core symbols first, Ohmni/client add-ons last.
 */
export default defineField({
  title: 'Page sections',
  name: 'sections',
  type: 'array',
  of: [
    // Core
    { type: 'coverBlock' },
    { type: 'heroBlock' },
    { type: 'bannerBlock' },
    { type: 'textBlock' },
    { type: 'imageBlock' },
    { type: 'galleryBlock' },
    { type: 'columnBlock' },
    { type: 'ctaBlock' },
    { type: 'logoBarBlock' },
    { type: 'quoteBlock' },
    { type: 'statsBlock' },
    { type: 'formBlock' },
    { type: 'faqBlock' },
    { type: 'dividerBlock' },
    { type: 'embedBlock' },
    // Add-ons
    { type: 'splitScrollBlock' },
    { type: 'postsBlock' },
    { type: 'eventsBlock' },
    { type: 'teamMemberBlock' },
  ],
})
