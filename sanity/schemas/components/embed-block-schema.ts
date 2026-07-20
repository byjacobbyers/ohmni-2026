import { defineType, defineField } from 'sanity'
import { CodeIcon } from '@sanity/icons/Code'
import {
  sectionActiveField,
  sectionAnchorField,
  sectionBackgroundField,
  simpleMaxWidthOptions,
} from '../lib/section-chrome'

export default defineType({
  title: 'Embed',
  name: 'embedBlock',
  type: 'object',
  icon: CodeIcon,
  description: 'Paste third-party HTML (calendars, widgets, iframes).',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'section', title: 'Section' },
  ],
  fields: [
    sectionActiveField('section'),
    sectionAnchorField('section'),
    sectionBackgroundField('section'),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      group: 'content',
      description: 'Optional heading displayed above the embed',
    }),
    defineField({
      title: 'Embed Code',
      name: 'embedCode',
      type: 'code',
      group: 'content',
      description: 'Paste embed code (e.g. Google Calendar iframe HTML)',
      options: {
        language: 'html',
        languageAlternatives: [{ title: 'HTML', value: 'html' }],
      },
    }),
    defineField({
      title: 'Max Width',
      name: 'maxWidth',
      type: 'string',
      group: 'content',
      initialValue: 'max-w-2xl',
      options: {
        list: simpleMaxWidthOptions,
        layout: 'dropdown',
      },
    }),
  ],
  preview: {
    select: { active: 'active', title: 'title' },
    prepare({ active, title }) {
      return {
        title: title || 'Embed',
        subtitle: active === false ? 'Inactive' : 'Active',
      }
    },
  },
})
