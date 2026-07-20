import { defineType, defineField } from 'sanity'
import { BlockElementIcon } from '@sanity/icons/BlockElement'
import {
  sectionActiveField,
  sectionAnchorField,
  sectionBackgroundField,
} from '../lib/section-chrome'

export default defineType({
  title: 'Quote',
  name: 'quoteBlock',
  type: 'object',
  icon: BlockElementIcon,
  description: 'Testimonial with optional person portrait and attribution.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'section', title: 'Section' },
  ],
  fields: [
    sectionActiveField('section'),
    sectionAnchorField('section'),
    sectionBackgroundField('section'),
    defineField({
      title: 'Quote',
      name: 'quote',
      type: 'simpleText',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Portrait',
      name: 'image',
      type: 'defaultImage',
      group: 'content',
      description: 'Photo of the person giving the quote (shown as an avatar).',
    }),
    defineField({
      title: 'Attribution',
      name: 'title',
      type: 'string',
      group: 'content',
      description: 'Name and role under the quote (e.g. Jane Doe, VP Marketing)',
    }),
    defineField({
      title: 'CTA',
      name: 'cta',
      type: 'cta',
      group: 'content',
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
