import { defineType, defineField } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export default defineType({
  title: 'Image Block',
  name: 'imageBlock',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      title: 'Active?',
      name: 'active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ title: 'Anchor', name: 'anchor', type: 'string' }),
    defineField({ title: 'Image', name: 'image', type: 'defaultImage' }),
  ],
  preview: {
    select: { active: 'active' },
    prepare({ active }) {
      return { title: 'Image Block', subtitle: active ? 'Active' : 'Inactive' }
    },
  },
})
