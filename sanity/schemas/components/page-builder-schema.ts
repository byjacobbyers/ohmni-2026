import { defineField } from 'sanity'

export default defineField({
  title: 'Page sections',
  name: 'sections',
  type: 'array',
  of: [
    { type: 'bannerBlock' },
    { type: 'coverBlock' },
    { type: 'coverVideo' },
    { type: 'heroBlock' },
    { type: 'ctaBlock' },
    { type: 'textBlock' },
    { type: 'imageBlock' },
    { type: 'videoBlock' },
    { type: 'galleryBlock' },
    { type: 'faqBlock' },
    { type: 'splitScrollBlock' },
    { type: 'columnBlock' },
    { type: 'formBlock' },
    { type: 'embedBlock' },
    { type: 'spacerBlock' },
    { type: 'dividerBlock' },
  ],
})
