import { defineType, defineField } from 'sanity'
import { InlineElementIcon } from '@sanity/icons/InlineElement'
import {
  sectionActiveField,
  sectionAnchorField,
} from '../lib/section-chrome'

export default defineType({
  title: 'Split Scroll (add-on)',
  name: 'splitScrollBlock',
  type: 'object',
  icon: InlineElementIcon,
  description: 'Signature narrative scroll. Ohmni/client add-on — not a core kit symbol.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'section', title: 'Section' },
  ],
  fields: [
    sectionActiveField('section'),
    sectionAnchorField('section'),
    defineField({
      title: 'Background Color',
      name: 'backgroundColor',
      type: 'string',
      group: 'section',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Texture', value: 'texture' },
        ],
      },
      initialValue: 'primary',
    }),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'simpleText',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Items',
      name: 'items',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              title: 'Image',
              name: 'image',
              type: 'defaultImage',
            }),
            defineField({
              title: 'Content',
              name: 'content',
              type: 'simpleText',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { image: 'image', content: 'content' },
            prepare(selection: { image?: { alt?: string }; content?: Array<{ children?: Array<{ text?: string }> }> }) {
              const { image, content } = selection
              return {
                title: image?.alt || 'Item',
                subtitle: content?.[0]?.children?.[0]?.text || '',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: 'title', active: 'active', items: 'items' },
    prepare(selection: { title?: Array<{ children?: Array<{ text?: string }> }>; active?: boolean; items?: unknown[] }) {
      const { title, active, items } = selection
      const count = items?.length ?? 0
      const titlePreview = title?.[0]?.children?.[0]?.text || ''
      return {
        title: 'Split Scroll Block',
        subtitle: `${active ? 'Active' : 'Inactive'} — ${count} item${count !== 1 ? 's' : ''}${titlePreview ? ` — ${titlePreview}` : ''}`,
      }
    },
  },
})
