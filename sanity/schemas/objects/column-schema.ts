import { defineType, defineField } from 'sanity'
import { InlineIcon } from '@sanity/icons/Inline'
import { iconOptions } from '../lib/icon-options'

const column = defineType({
  title: 'Card',
  type: 'object',
  name: 'column',
  icon: InlineIcon,
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Optional title for this card',
    }),
    defineField({
      title: 'Content',
      name: 'content',
      type: 'simpleText',
      description: 'Main content for the card',
    }),
    defineField({
      title: 'Icon',
      name: 'icon',
      type: 'string',
      description: 'Optional Lucide icon when there is no image (logo-style cards).',
      options: { list: [...iconOptions] },
    }),
    defineField({
      title: 'Image',
      name: 'image',
      type: 'defaultImage',
      description: 'Optional image for this card',
    }),
    defineField({
      title: 'CTA',
      name: 'cta',
      type: 'cta',
      description: 'Optional call to action button',
    }),
    defineField({
      title: 'Highlight this card',
      name: 'highlight',
      type: 'boolean',
      initialValue: false,
      description:
        'Marks one card as the recommended option. Use it when one card really is the answer, such as a pricing tier. Highlighting a card in a list of symptoms says something you do not mean.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      content: 'content',
      media: 'image',
    },
    prepare(selection) {
      const { title, content, media } = selection
      return {
        title: title || 'Card',
        subtitle: content ? content[0]?.children[0]?.text || 'No Content' : 'No Content',
        media,
      }
    },
  },
})

export default column
