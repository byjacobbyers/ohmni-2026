import { defineType, defineField } from 'sanity'
import {RocketIcon} from '@sanity/icons/Rocket'

export default defineType({
  title: 'Feature',
  name: 'heroBlock',
  type: 'object',
  icon: RocketIcon,
  description: 'Split content + media (left/right). For full-bleed, use Hero.',
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
    }),
    defineField({
      title: 'Layout',
      name: 'layout',
      type: 'string',
      initialValue: 'image-right',
      options: {
        list: [
          { title: 'Image Right', value: 'image-right' },
          { title: 'Image Left', value: 'image-left' },
        ],
      },
    }),
    defineField({ name: 'image', type: 'defaultImage' }),
    defineField({ name: 'content', type: 'simpleText' }),
    defineField({ title: 'CTA', name: 'cta', type: 'cta' }),
  ],
  preview: {
    select: { active: 'active', layout: 'layout' },
    prepare({ active, layout }) {
      return { title: 'Feature', subtitle: `${active ? 'Active' : 'Inactive'} - ${layout}` }
    },
  },
})
