import {LinkIcon} from '@sanity/icons/Link'
import { defineType, defineField } from 'sanity'
import { languageField } from '../lib/language'

export default defineType({
  type: 'document',
  name: 'navigation',
  title: 'Navigation',
  icon: LinkIcon,
  fields: [
    defineField({ type: 'string', name: 'title', hidden: true }),
    languageField,
    defineField({
      type: 'array',
      name: 'items',
      of: [{ type: 'route' }, { type: 'subNav' }],
    }),
  ],
  preview: {
    select: { title: 'title', language: 'language' },
    prepare({ title, language }) {
      return { title: title || 'Navigation', subtitle: language === 'es' ? 'Español' : undefined }
    },
  },
})
