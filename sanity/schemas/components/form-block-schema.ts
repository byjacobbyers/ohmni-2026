import { defineType, defineField } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons/Envelope'
import {
  sectionActiveField,
  sectionAnchorField,
} from '../lib/section-chrome'

export default defineType({
  title: 'Form',
  name: 'formBlock',
  icon: EnvelopeIcon,
  type: 'object',
  description:
    'Lead capture. Stacked = intro above form; Split = intro left / form right. Edit fields on the Form document under Forms.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'section', title: 'Section' },
  ],
  fields: [
    sectionActiveField('section'),
    sectionAnchorField('section'),
    defineField({
      title: 'Layout',
      name: 'layout',
      type: 'string',
      group: 'content',
      initialValue: 'stacked',
      description: 'Stacked puts intro above the form. Split puts intro beside the form.',
      options: {
        list: [
          { title: 'Stacked (intro above form)', value: 'stacked' },
          { title: 'Split (intro left, form right)', value: 'split' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      title: 'Background Color',
      name: 'backgroundColor',
      type: 'string',
      group: 'section',
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
      name: 'content',
      title: 'Intro Content',
      type: 'normalText',
      group: 'content',
      description: 'Copy above the form (stacked) or beside it (split).',
    }),
    defineField({
      name: 'form',
      title: 'Form',
      type: 'reference',
      group: 'content',
      to: [{ type: 'form' }],
      description: 'Choose a Form document. Field definitions live on that document.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { formTitle: 'form.title', active: 'active', layout: 'layout' },
    prepare({ formTitle, active, layout }) {
      return {
        title: formTitle || 'Form',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${layout === 'split' ? 'Split' : 'Stacked'}`,
      }
    },
  },
})
