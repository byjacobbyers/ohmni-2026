import { defineType, defineField } from 'sanity'
import { BlockElementIcon } from '@sanity/icons/BlockElement'
import {
  sectionActiveField,
  sectionAnchorField,
} from '../lib/section-chrome'

export default defineType({
  title: 'Stats',
  name: 'statsBlock',
  type: 'object',
  icon: BlockElementIcon,
  description: 'Metric proof with optional image and heading.',
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
      title: 'Heading',
      name: 'heading',
      type: 'simpleText',
      group: 'content',
      description: 'Title + intro above the image/stats split',
    }),
    defineField({
      title: 'Image',
      name: 'image',
      type: 'defaultImage',
      group: 'content',
    }),
    defineField({
      title: 'Layout',
      name: 'layout',
      type: 'string',
      group: 'content',
      initialValue: 'image-left',
      options: {
        list: [
          { title: 'Image Left', value: 'image-left' },
          { title: 'Image Right', value: 'image-right' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      title: 'Stats',
      name: 'stats',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'stat',
          fields: [
            defineField({
              title: 'Stat value',
              name: 'statValue',
              type: 'string',
              description: 'e.g. 3×, 14 days, 99%',
            }),
            defineField({
              title: 'Content',
              name: 'content',
              type: 'simpleText',
            }),
          ],
          preview: { select: { title: 'statValue' } },
        },
      ],
      validation: (Rule) => Rule.min(1).max(6),
    }),
  ],
  preview: {
    select: { active: 'active', stats: 'stats', media: 'image' },
    prepare({ active, stats, media }) {
      const count = Array.isArray(stats) ? stats.length : 0
      return {
        title: 'Stats',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${count} stat${count === 1 ? '' : 's'}`,
        media,
      }
    },
  },
})
