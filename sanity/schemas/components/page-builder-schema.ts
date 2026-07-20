import { defineField } from 'sanity'

/**
 * Page builder: core symbols first, Ohmni/client add-ons last.
 * Deprecated aliases (coverVideo, splitForm, projectColumns, spacer) stay
 * registered in schema/index for dual-render but are omitted from the picker.
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
    { type: 'problemBlock' },
    { type: 'postsBlock' },
    { type: 'eventsBlock' },
    { type: 'teamMemberBlock' },
  ],
})
