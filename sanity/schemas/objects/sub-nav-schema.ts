import { defineField, defineType } from 'sanity'
import { ChevronDownIcon } from '@sanity/icons/ChevronDown'

/**
 * A top-level nav item that opens a dropdown instead of navigating. Renders as
 * a panel of cards on desktop and an expanded section in the mobile menu.
 */
export default defineType({
  name: 'subNav',
  title: 'Sub Navigation',
  type: 'object',
  icon: ChevronDownIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Label',
      type: 'string',
      description: 'The word shown in the header, e.g. Product or Company.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'display',
      title: 'Display as',
      type: 'string',
      initialValue: 'cards',
      description:
        'Cards suit things that need explaining, like products. List suits short utility links and keeps the mobile menu from overflowing.',
      options: {
        list: [
          { title: 'Cards (icon, title, description)', value: 'cards' },
          { title: 'List (title only)', value: 'list' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'items',
      title: 'Links',
      type: 'array',
      of: [{ type: 'navLink' }],
      validation: (Rule) => Rule.min(1).error('A dropdown needs at least one link.'),
    }),
  ],
  preview: {
    select: { title: 'title', items: 'items' },
    prepare({ title, items }) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: title || 'Sub navigation',
        subtitle: `Dropdown · ${count} link${count === 1 ? '' : 's'}`,
      }
    },
  },
})
