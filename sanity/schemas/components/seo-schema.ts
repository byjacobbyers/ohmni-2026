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
      title: 'Auto share image (Facebook, Slack, etc.)',
      name: 'autoShareImage',
      type: 'object',
      description:
        'Default 1200×630 share image is generated from this heading and background, plus your site name. On Site Settings, these values act as fallbacks when a page or event leaves fields empty.',
      options: { collapsible: true, collapsed: false },
      components: { input: AutoShareImageInput },
      fields: [
        defineField({
          title: 'Heading',
          name: 'heading',
          type: 'simpleText',
          description:
            'Large headline on the generated image. If empty, the document title is used, then meta title and site defaults.',
        }),
        defineField({
          title: 'Background',
          name: 'background',
          type: 'string',
          description:
            'Background for the generated image: brand blue, neutral, dark (#121117), or light “site” shell (matches header page background).',
          initialValue: 'primary',
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
        'Optional 1200×630 upload. Replaces the auto-generated share image on this page or event only. (Not used as a global default for other pages’ Open Graph.)',
    }),
  ],
})
