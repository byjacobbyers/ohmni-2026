import { defineField, defineType } from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'
import { languageField } from '../lib/language'

export default defineType({
  name: 'formSettings',
  title: 'Form Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    languageField,
    defineField({
      name: 'disclaimer',
      title: 'Default Disclaimer',
      type: 'simpleText',
      description: 'Shown under every form unless the form overrides it.',
    }),
    defineField({
      name: 'optInLabel',
      title: 'Default Opt-in Label',
      type: 'string',
      initialValue: 'Opt in for news and updates',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'optInDefault',
      title: 'Opt-in Checked by Default',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'showOptInByDefault',
      title: 'Show Opt-in by Default',
      type: 'boolean',
      description: 'When enabled, forms show the marketing opt-in unless they override.',
      initialValue: true,
    }),
    defineField({
      name: 'defaultSubmitLabel',
      title: 'Default Submit Button Label',
      type: 'string',
      initialValue: 'Send Message',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { language: 'language' },
    prepare({ language }) {
      return { title: language === 'es' ? 'Form Settings (Español)' : 'Form Settings' }
    },
  },
})
