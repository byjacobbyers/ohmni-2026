import { defineField, defineType } from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

export default defineType({
  name: 'form',
  title: 'Form',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Human label for Studio, emails, and Slack (e.g. “Contact Form”).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Form ID',
      type: 'slug',
      description:
        'Machine id for data-form-name and Customer.io form_name (e.g. contact, free-audit).',
      options: { source: 'title', maxLength: 64 },
      validation: (Rule) =>
        Rule.required().custom(async (slug, context) => {
          const current = slug?.current
          if (!current) return 'Required'
          if (!/^[a-z0-9-]+$/.test(current)) {
            return 'Use only lowercase letters, numbers, and hyphens'
          }
          const { document, getClient } = context
          const client = getClient({ apiVersion: '2025-02-19' })
          const id = document?._id?.replace(/^drafts\./, '')
          const existing = await client.fetch<number>(
            `count(*[_type == "form" && slug.current == $slug && !(_id in [$id, "drafts." + $id])])`,
            { slug: current, id: id || '' }
          )
          return existing === 0 ? true : 'Form ID must be unique'
        }),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'fields',
      title: 'Extra Fields',
      type: 'array',
      description: 'Name and email are always included. Add optional inputs and textareas here.',
      of: [{ type: 'formField' }],
      validation: (Rule) =>
        Rule.custom((fields) => {
          if (!Array.isArray(fields)) return true
          const names = fields
            .map((f) => (f && typeof f === 'object' && 'name' in f ? String((f as { name?: string }).name) : ''))
            .filter(Boolean)
          const dupes = names.filter((n, i) => names.indexOf(n) !== i)
          if (dupes.length) return `Duplicate field names: ${[...new Set(dupes)].join(', ')}`
          return true
        }),
    }),
    defineField({
      name: 'submitLabel',
      title: 'Submit Button Label',
      type: 'string',
      description: 'Leave empty to use Form Settings default.',
    }),
    defineField({
      name: 'disclaimer',
      title: 'Disclaimer Override',
      type: 'simpleText',
      description: 'Leave empty to use Form Settings default disclaimer.',
    }),
    defineField({
      name: 'showOptIn',
      title: 'Show Opt-in',
      type: 'string',
      options: {
        list: [
          { title: 'Use Form Settings default', value: 'inherit' },
          { title: 'Show', value: 'show' },
          { title: 'Hide', value: 'hide' },
        ],
      },
      initialValue: 'inherit',
    }),
    defineField({
      name: 'optInLabel',
      title: 'Opt-in Label Override',
      type: 'string',
      description: 'Leave empty to use Form Settings default.',
      hidden: ({ parent }) => parent?.showOptIn === 'hide',
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', active: 'active' },
    prepare({ title, slug, active }) {
      return {
        title: title || 'Untitled form',
        subtitle: `${slug || 'no-id'}${active === false ? ' · Inactive' : ''}`,
      }
    },
  },
})
