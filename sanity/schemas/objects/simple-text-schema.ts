import { defineType } from 'sanity'
import { TextIcon } from '@sanity/icons'

export default defineType({
  title: 'Text',
  name: 'simpleText',
  type: 'array',
  icon: TextIcon,
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Small', value: 'small' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      marks: {
        annotations: [{ type: 'linkWithRoute' }],
      },
    },
  ],
})
