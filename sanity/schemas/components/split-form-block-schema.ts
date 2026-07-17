import { defineType, defineField } from 'sanity'
import {CommentIcon} from '@sanity/icons/Comment'

const splitFormBlock = defineType({
  title: 'Split Form Block',
  name: 'splitFormBlock',
  type: 'object',
  icon: CommentIcon,
  description: 'Rich text on the left, contact form on the right (stacked on mobile)',
  fields: [
    defineField({
      title: 'Active?',
      name: 'active',
      type: 'boolean',
      description: 'Set to false if you need to remove from page but not delete',
      initialValue: true,
    }),
    defineField({
      title: 'Anchor',
      name: 'anchor',
      type: 'string',
      description: 'The anchor for the section. No hash symbols. Optional.',
      validation: (Rule) =>
        Rule.regex(/^[a-z0-9-]+$/).warning(
          'Use only lowercase letters, numbers, and hyphens'
        ),
    }),
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
      title: 'Content',
      name: 'content',
      type: 'normalText',
      description: 'Shown left of the form (above it on mobile)',
    }),
    defineField({
      title: 'Submit Button Label',
      name: 'submitLabel',
      type: 'string',
      description: 'Defaults to "Send Message"',
    }),
  ],
  preview: {
    select: { active: 'active' },
    prepare({ active }) {
      return {
        title: 'Split Form Block',
        subtitle: active ? 'Active' : 'Not Active',
      }
    },
  },
})

export default splitFormBlock
