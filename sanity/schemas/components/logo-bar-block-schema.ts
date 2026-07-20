import { defineType, defineField } from 'sanity'
import { ImagesIcon } from '@sanity/icons/Images'
import {
  sectionActiveField,
  sectionAnchorField,
} from '../lib/section-chrome'

export default defineType({
  title: 'Logo Bar',
  name: 'logoBarBlock',
  type: 'object',
  icon: ImagesIcon,
  description: 'Scrolling or static trust strip of partner/client logos.',
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
      title: 'Eyebrow',
      name: 'eyebrow',
      type: 'string',
      group: 'content',
      description: 'Short line above the logos, e.g. “Trusted by teams who ship.”',
    }),
    defineField({
      title: 'Logos',
      name: 'logos',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'logoEntry',
          fields: [
            defineField({ title: 'Logo', name: 'logo', type: 'defaultImage' }),
            defineField({ title: 'Company name', name: 'name', type: 'string' }),
          ],
          preview: { select: { title: 'name', media: 'logo' } },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      active: 'active',
      logos: 'logos',
      eyebrow: 'eyebrow',
      media: 'logos.0.logo',
    },
    prepare({ active, logos, eyebrow, media }) {
      const count = Array.isArray(logos) ? logos.length : 0
      return {
        title: 'Logo Bar',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${count} logo${count === 1 ? '' : 's'}${eyebrow ? ` · ${eyebrow}` : ''}`,
        media,
      }
    },
  },
})
