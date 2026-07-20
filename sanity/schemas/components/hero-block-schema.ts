import { defineType, defineField } from 'sanity'
import { RocketIcon } from '@sanity/icons/Rocket'
import {
  sectionActiveField,
  sectionAnchorField,
  sectionBackgroundField,
} from '../lib/section-chrome'

export default defineType({
  title: 'Feature',
  name: 'heroBlock',
  type: 'object',
  icon: RocketIcon,
  description: 'Split content + media (left/right). For full-bleed, use Hero.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'section', title: 'Section' },
  ],
  fields: [
    sectionActiveField('section'),
    sectionAnchorField('section'),
    sectionBackgroundField('section'),
    defineField({
      title: 'Layout',
      name: 'layout',
      type: 'string',
      group: 'content',
      initialValue: 'image-right',
      options: {
        list: [
          { title: 'Image Right', value: 'image-right' },
          { title: 'Image Left', value: 'image-left' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      title: 'Image',
      name: 'image',
      type: 'defaultImage',
      group: 'content',
    }),
    defineField({
      title: 'Content',
      name: 'content',
      type: 'simpleText',
      group: 'content',
    }),
    defineField({
      title: 'CTA',
      name: 'cta',
      type: 'cta',
      group: 'content',
    }),
  ],
  preview: {
    select: { active: 'active', layout: 'layout', media: 'image' },
    prepare({ active, layout, media }) {
      return {
        title: 'Feature',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${layout || 'image-right'}`,
        media,
      }
    },
  },
})
