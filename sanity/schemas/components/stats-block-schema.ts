import { defineType, defineField } from 'sanity'
import { BlockElementIcon } from '@sanity/icons/BlockElement'

export default defineType({
  title: 'Stats',
  name: 'statsBlock',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({
      title: 'Active?',
      name: 'active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ title: 'Anchor', name: 'anchor', type: 'string' }),
    defineField({
      title: 'Background Color',
      name: 'backgroundColor',
      type: 'string',
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
      description: 'Title + intro above the image/stats split',
    }),
    defineField({
      title: 'Image',
      name: 'image',
      type: 'defaultImage',
    }),
    defineField({
      title: 'Layout',
      name: 'layout',
      type: 'string',
      initialValue: 'image-left',
      options: {
        list: [
          { title: 'Image Left', value: 'image-left' },
          { title: 'Image Right', value: 'image-right' },
        ],
      },
    }),
    defineField({
      title: 'Stats',
      name: 'stats',
      type: 'array',
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
    select: { active: 'active', stats: 'stats' },
    prepare({ active, stats }) {
      const count = Array.isArray(stats) ? stats.length : 0
      return {
        title: 'Stats',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${count} stat${count === 1 ? '' : 's'}`,
      }
    },
  },
})
