import { defineType, defineField } from 'sanity'
import { BlockElementIcon } from '@sanity/icons/BlockElement'

export default defineType({
  title: 'Quote',
  name: 'quoteBlock',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({
      title: 'Active?',
      name: 'active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ title: 'Anchor', name: 'anchor', type: 'string' }),
    defineField({
      title: 'Background Image',
      name: 'image',
      type: 'defaultImage',
      description: 'Full-bleed background behind the quote',
    }),
    defineField({
      title: 'Quote',
      name: 'quote',
      type: 'simpleText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Attribution',
      name: 'title',
      type: 'string',
      description: 'Name / role under the quote',
    }),
    defineField({
      title: 'CTA',
      name: 'cta',
      type: 'cta',
    }),
  ],
  preview: {
    select: {
      active: 'active',
      quote: 'quote',
      title: 'title',
      media: 'image',
    },
    prepare({ active, quote, title, media }) {
      const quoteText =
        Array.isArray(quote) && quote[0]?.children?.[0]?.text
          ? quote[0].children[0].text
          : 'No quote'
      return {
        title: 'Quote',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${title ? `${quoteText} — ${title}` : quoteText}`,
        media,
      }
    },
  },
})
