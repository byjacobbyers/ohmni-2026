import { defineType, defineField } from 'sanity'
import SeoInput from '../inputs/seo-input'
import AutoShareImageInput from '../inputs/auto-share-image-input'

export default defineType({
  title: 'SEO / Share Settings',
  name: 'seo',
  type: 'object',
  description:
    'Customize SEO and share settings. Leave fields empty to use document title and description as defaults on the frontend where applicable.',
  components: {
    input: SeoInput,
  },
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      title: 'No Index?',
      name: 'noIndex',
      type: 'boolean',
      hidden: ({ document }) => document?._type !== 'page',
    }),
    defineField({
      title: 'Meta Title',
      name: 'metaTitle',
      type: 'string',
      description:
        'Will default to the document title if left empty. Override here for a custom SEO title.',
      validation: (Rule) =>
        Rule.max(60).warning('Longer titles may be truncated by search engines'),
    }),
    defineField({
      title: 'Meta Description',
      name: 'metaDesc',
      type: 'text',
      rows: 3,
      description:
        'Will default to the document description if left empty. Override here for a custom SEO description.',
      validation: (Rule) =>
        Rule.max(160).warning('Longer descriptions may be truncated by search engines'),
    }),
    defineField({
      title: 'Canonical URL',
      name: 'canonicalUrl',
      type: 'string',
      description:
        'Leave empty to use this page’s own URL (the default and usually correct). Set only when this content is a copy of a page that lives elsewhere: a path (/original-page) or a full URL.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          return value.startsWith('/') || value.startsWith('https://') || value.startsWith('http://')
            ? true
            : 'Must be a path starting with / or a full URL'
        }),
    }),
    defineField({
      title: 'Auto share image (Facebook, Slack, etc.)',
      name: 'autoShareImage',
      type: 'object',
      description:
        'Default 1200×630 share image is generated from this heading and background, plus your site name. On Site Settings, these values act as fallbacks when a page, post, or event leaves fields empty.',
      options: { collapsible: true, collapsed: false },
      components: { input: AutoShareImageInput },
      fields: [
        defineField({
          title: 'Heading',
          name: 'heading',
          type: 'simpleText',
          description:
            'Large headline on the generated image (simpleText). Leave empty to use the document title as an H2. Site Settings heading is only used when this document has no title either.',
        }),
        defineField({
          title: 'Background',
          name: 'background',
          type: 'string',
          description:
            'Background for the generated image: brand blue, neutral, dark (#121117), or light “site” shell (matches header page background).',
          initialValue: 'black',
          options: {
            list: [
              { title: 'Primary (brand blue)', value: 'primary' },
              { title: 'Secondary (neutral)', value: 'secondary' },
              { title: 'Black', value: 'black' },
              { title: 'Site (light)', value: 'site' },
            ],
            layout: 'radio',
          },
        }),
      ],
    }),
    defineField({
      title: 'Custom share image',
      name: 'shareGraphic',
      type: 'defaultImage',
      description:
        'Optional 1200×630 upload. Replaces the auto-generated share image on this page, post, or event only. (Not used as a global default for other pages’ Open Graph.)',
    }),
  ],
})
