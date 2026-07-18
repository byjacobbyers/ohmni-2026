import { defineField, defineType } from 'sanity'

const RESERVED_FIELD_NAMES = new Set([
  'name',
  'email',
  'website',
  'path',
  'formName',
  'formTitle',
  'marketingOptIn',
  'fields',
  'submittedAt',
])

export default defineType({
  name: 'formField',
  title: 'Form Field',
  type: 'object',
  fields: [
    defineField({
      name: 'fieldType',
      title: 'Field Type',
      type: 'string',
      options: {
        list: [
          { title: 'Input', value: 'input' },
          { title: 'Textarea', value: 'textarea' },
        ],
        layout: 'radio',
      },
      initialValue: 'input',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Field Name',
      type: 'string',
      description:
        'Machine key for submissions (Customer.io fields, emails). Lowercase letters, numbers, underscores.',
      validation: (Rule) =>
        Rule.required()
          .regex(/^[a-z][a-z0-9_]*$/, {
            name: 'field name',
            invert: false,
          })
          .custom((value) => {
            if (!value) return true
            if (RESERVED_FIELD_NAMES.has(value)) {
              return `“${value}” is reserved. Choose another name.`
            }
            return true
          }),
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder',
      type: 'string',
    }),
    defineField({
      name: 'required',
      title: 'Required',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'inputType',
      title: 'Input Type',
      type: 'string',
      options: {
        list: [
          { title: 'Text', value: 'text' },
          { title: 'Telephone', value: 'tel' },
          { title: 'URL', value: 'url' },
        ],
      },
      initialValue: 'text',
      hidden: ({ parent }) => parent?.fieldType !== 'input',
    }),
  ],
  preview: {
    select: { title: 'label', fieldType: 'fieldType', name: 'name', required: 'required' },
    prepare({ title, fieldType, name, required }) {
      return {
        title: title || 'Untitled field',
        subtitle: `${fieldType || 'input'} · ${name || '—'}${required ? ' · required' : ''}`,
      }
    },
  },
})
