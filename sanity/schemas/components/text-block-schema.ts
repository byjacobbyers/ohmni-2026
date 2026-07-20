import { defineType, defineField } from 'sanity'
import { BlockContentIcon } from '@sanity/icons/BlockContent'
import {
  sectionActiveField,
  sectionAnchorField,
} from '../lib/section-chrome'

export default defineType({
  title: 'Text',
  type: 'object',
  icon: BlockContentIcon,
  name: 'textBlock',
  description: 'Rich text section with alignment and background.',
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
      title: 'Content Alignment',
      name: 'contentAlignment',
      type: 'string',
      group: 'content',
      initialValue: 'left',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
      },
    }),
    defineField({
      title: 'Content',
      name: 'content',
      type: 'normalText',
      group: 'content',
    }),
  ],
  preview: {
    select: { active: 'active', content: 'content' },
    prepare({ active, content }) {
      const excerpt =
        Array.isArray(content) && content[0]?.children?.[0]?.text
          ? content[0].children[0].text
          : 'Empty'
      return {
        title: 'Text',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${excerpt}`,
      }
    },
  },
})
