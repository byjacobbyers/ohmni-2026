import { defineType, defineField } from 'sanity'
import { ErrorOutlineIcon } from '@sanity/icons/ErrorOutline'
import {
  sectionActiveField,
  sectionAnchorField,
  sectionBackgroundField,
} from '../lib/section-chrome'

export default defineType({
  title: 'FAQ',
  name: 'faqBlock',
  type: 'object',
  icon: ErrorOutlineIcon,
  description: 'Accordion of questions and answers.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'section', title: 'Section' },
  ],
  fields: [
    sectionActiveField('section'),
    sectionAnchorField('section'),
    sectionBackgroundField('section'),
    defineField({
      title: 'FAQs',
      name: 'faqs',
      type: 'array',
      group: 'content',
      validation: (Rule) => Rule.min(1),
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              title: 'Question',
              name: 'question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              title: 'Answer',
              name: 'answer',
              type: 'simpleText',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'question' },
            prepare({ title }) {
              return { title: title || 'Untitled' }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { active: 'active', faqs: 'faqs' },
    prepare({ active, faqs }) {
      const count = Array.isArray(faqs) ? faqs.length : 0
      return {
        title: 'FAQ',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${count} question${count === 1 ? '' : 's'}`,
      }
    },
  },
})
