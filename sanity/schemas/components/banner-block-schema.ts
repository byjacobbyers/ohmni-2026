import { defineType, defineField } from 'sanity'
import {BlockElementIcon} from '@sanity/icons/BlockElement'

export default defineType({
  title: 'Banner (branded)',
  name: 'bannerBlock',
  type: 'object',
  icon: BlockElementIcon,
  description: 'Signature aurora CTA strip. Prefer Form or CTA for standard conversion bands.',
  fields: [
    defineField({
      title: 'Active?',
      name: 'active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      title: 'Anchor',
      name: 'anchor',
      type: 'string',
      description: 'Section anchor for deep linking (no hash)',
    }),
    defineField({
      title: 'Content',
      name: 'content',
      type: 'simpleText',
      description: 'Headline and supporting text (H1 uses display typography in this block)',
    }),
    defineField({ title: 'CTA', name: 'cta', type: 'cta' }),
  ],
  preview: {
    select: { active: 'active' },
    prepare({ active }) {
      return {
        title: 'Banner',
        subtitle: active ? 'Active' : 'Inactive',
      }
    },
  },
})
