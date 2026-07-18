import { defineType, defineField } from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'

export default defineType({
  title: 'Form Block',
  name: 'formBlock',
  icon: CalendarIcon,
  type: 'object',
  fields: [
    defineField({
      title: 'Active',
      name: 'active',
      type: 'boolean',
      description:
        'Set to false if you need to remove from page but not delete',
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
      name: 'content',
      title: 'Intro Content',
      type: 'simpleText',
      description: 'Optional copy above the form.',
    }),
    defineField({
      name: 'form',
      title: 'Form',
      type: 'reference',
      to: [{ type: 'form' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { formTitle: 'form.title', active: 'active' },
    prepare({ formTitle, active }) {
      return {
        title: formTitle || 'Form Block',
        subtitle: active === false ? 'Inactive' : 'Active',
      }
    },
  },
})
