import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'linkWithRoute',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'route',
      type: 'route',
      title: 'Link destination',
    }),
  ],
  options: {
    modal: { type: 'popover' },
  },
})
