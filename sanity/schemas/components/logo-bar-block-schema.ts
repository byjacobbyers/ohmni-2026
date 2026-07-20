import { defineType, defineField } from 'sanity'
import { ImagesIcon } from '@sanity/icons/Images'

export default defineType({
  title: 'Logo Bar',
  name: 'logoBarBlock',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      title: 'Active?',
      name: 'active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ title: 'Anchor', name: 'anchor', type: 'string' }),
    defineField({
      title: 'Background Color',
      name: 'backgroundColor',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Texture', value: 'texture' },
        ],
      },
      initialValue: 'primary',
    }),
    defineField({
      title: 'Eyebrow',
      name: 'eyebrow',
      type: 'string',
      description: 'Short line above the logos, e.g. “Trusted by teams who ship.”',
    }),
    defineField({
      title: 'Logos',
      name: 'logos',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'logoEntry',
          fields: [
            defineField({ title: 'Logo', name: 'logo', type: 'defaultImage' }),
            defineField({ title: 'Company name', name: 'name', type: 'string' }),
          ],
          preview: { select: { title: 'name', media: 'logo' } },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { active: 'active', logos: 'logos', eyebrow: 'eyebrow' },
    prepare({ active, logos, eyebrow }) {
      const count = Array.isArray(logos) ? logos.length : 0
      return {
        title: 'Logo Bar',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${count} logo${count === 1 ? '' : 's'}${eyebrow ? ` · ${eyebrow}` : ''}`,
      }
    },
  },
})
