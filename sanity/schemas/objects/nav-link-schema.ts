import { defineField, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons/Link'
import { iconOptions } from '../lib/icon-options'

/**
 * A destination inside a Sub Navigation dropdown. Carries the extra context a
 * bare route cannot: a scannable one-liner and an icon.
 */
export default defineType({
  name: 'navLink',
  title: 'Nav Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'route',
      title: 'Destination',
      type: 'route',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'string',
      description:
        'One line, read at a glance in the menu. Aim for under 60 characters. This is not the page meta description, which is written for search results and is far too long here.',
      validation: (Rule) =>
        Rule.max(80).warning('Over 80 characters will wrap awkwardly in the dropdown.'),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Rendered in brand blue beside the title.',
      options: { list: [...iconOptions] },
    }),
  ],
  preview: {
    select: { title: 'route.title', subtitle: 'description' },
    prepare({ title, subtitle }) {
      return { title: title || 'Nav link', subtitle }
    },
  },
})
