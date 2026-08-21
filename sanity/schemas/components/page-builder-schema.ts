import { defineField } from 'sanity'

const CORE_TYPES = [
  'coverBlock',
  'heroBlock',
  'bannerBlock',
  'textBlock',
  'imageBlock',
  'galleryBlock',
  'columnBlock',
  'ctaBlock',
  'logoBarBlock',
  'quoteBlock',
  'statsBlock',
  'formBlock',
  'faqBlock',
  'dividerBlock',
  'embedBlock',
] as const

const ADDON_TYPES = [
  'comparisonBlock',
  'splitScrollBlock',
  'postsBlock',
  'eventsBlock',
  'teamMemberBlock',
] as const

/**
 * Page builder: core symbols first, Ohmni/client add-ons last.
 */
export default defineField({
  title: 'Page sections',
  name: 'sections',
  type: 'array',
  description:
    'Build the page from sections. Browse live examples at /design/sections (also via “Browse section gallery” in document actions).',
  of: [
    // Core
    ...CORE_TYPES.map((type) => ({ type })),
    // Add-ons
    ...ADDON_TYPES.map((type) => ({ type })),
  ],
  options: {
    insertMenu: {
      filter: true,
      groups: [
        { name: 'core', title: 'Core', of: [...CORE_TYPES] },
        { name: 'addons', title: 'Add-ons', of: [...ADDON_TYPES] },
      ],
      views: [
        {
          name: 'grid',
          previewImageUrl: (schemaTypeName) =>
            `/section-previews/${schemaTypeName}.png`,
        },
        { name: 'list' },
      ],
    },
  },
})
