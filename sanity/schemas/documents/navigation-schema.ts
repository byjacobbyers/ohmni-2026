import { LinkIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

export default defineType({
  type: 'document',
  name: 'navigation',
  title: 'Navigation',
  icon: LinkIcon,
  fields: [
    defineField({ type: 'string', name: 'title' }),
    defineField({
      type: 'array',
      name: 'items',
      of: [{ type: 'route' }],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title || 'Navigation' }
    },
  },
})
