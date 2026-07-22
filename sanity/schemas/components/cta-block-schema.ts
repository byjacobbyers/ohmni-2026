import { defineType, defineField } from 'sanity'
import { PresentationIcon } from '@sanity/icons/Presentation'
import {
  sectionActiveField,
  sectionAnchorField,
} from '../lib/section-chrome'

export default defineType({
  title: 'CTA',
  name: 'ctaBlock',
  type: 'object',
  icon: PresentationIcon,
  description: 'Conversion band with copy and a button.',
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
      title: 'Alignment',
      name: 'alignment',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Left', value: 'text-left' },
          { title: 'Center', value: 'text-center' },
          { title: 'Right', value: 'text-right' },
        ],
      },
      initialValue: 'text-center',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'simpleText',
      group: 'content',
      description: 'Text displayed above the button',
    }),
    defineField({
      title: 'CTA',
      name: 'cta',
      type: 'cta',
      group: 'content',
    }),
  ],
  preview: {
    select: {
      active: 'active',
      content: 'content',
      ctaTitle: 'cta.route.title',
    },
    prepare({ active, content, ctaTitle }) {
      const excerpt =
        Array.isArray(content) && content[0]?.children?.[0]?.text
          ? content[0].children[0].text
          : ctaTitle || 'No CTA'
      return {
        title: 'CTA',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${excerpt}`,
      }
    },
  },
})
