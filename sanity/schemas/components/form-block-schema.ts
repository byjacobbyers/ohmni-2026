import { defineType, defineField } from 'sanity'
import { CalendarIcon } from '@sanity/icons/Calendar'

export default defineType({
  title: 'Form',
  name: 'formBlock',
  icon: CalendarIcon,
  type: 'object',
  fields: [
    defineField({
      title: 'Active',
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
      title: 'Layout',
      name: 'layout',
      type: 'string',
      initialValue: 'stacked',
      options: {
        list: [
          { title: 'Stacked (intro above form)', value: 'stacked' },
          { title: 'Split (intro left, form right)', value: 'split' },
        ],
      },
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
      hidden: ({ parent }) => parent?.layout !== 'split',
    }),
    defineField({
      name: 'content',
      title: 'Intro Content',
      type: 'normalText',
      description: 'Copy above the form (stacked) or beside it (split).',
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
    select: { formTitle: 'form.title', active: 'active', layout: 'layout' },
    prepare({ formTitle, active, layout }) {
      return {
        title: formTitle || 'Form',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${layout === 'split' ? 'Split' : 'Stacked'}`,
      }
    },
  },
})
