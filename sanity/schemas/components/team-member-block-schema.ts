import { defineType, defineField } from 'sanity'
import { UsersIcon } from '@sanity/icons/Users'

/** Page builder block that references a single team member (bio / About). */
export default defineType({
  title: 'Team Member (add-on)',
  name: 'teamMemberBlock',
  type: 'object',
  icon: UsersIcon,
  description: 'Single-person embed for About / founder bios.',
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
        ],
      },
      initialValue: 'primary',
    }),
    defineField({
      title: 'Team Member',
      name: 'member',
      type: 'reference',
      to: [{ type: 'team' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      active: 'active',
      title: 'member.title',
      media: 'member.image',
    },
    prepare({ active, title, media }) {
      return {
        title: title || 'Team Member',
        subtitle: active === false ? 'Inactive' : 'Active',
        media,
      }
    },
  },
})
