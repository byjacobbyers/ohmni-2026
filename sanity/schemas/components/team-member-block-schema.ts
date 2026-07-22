import { defineType, defineField } from 'sanity'
import { UsersIcon } from '@sanity/icons/Users'
import {
  sectionActiveField,
  sectionAnchorField,
  sectionBackgroundField,
} from '../lib/section-chrome'

/** Page builder block that references a single team member (bio / About). */
export default defineType({
  title: 'Team Member (add-on)',
  name: 'teamMemberBlock',
  type: 'object',
  icon: UsersIcon,
  description: 'Single-person embed for About / founder bios.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'section', title: 'Section' },
  ],
  fields: [
    sectionActiveField('section'),
    sectionAnchorField('section'),
    sectionBackgroundField('section'),
    defineField({
      title: 'Team Member',
      name: 'member',
      type: 'reference',
      to: [{ type: 'team' }],
      group: 'content',
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
