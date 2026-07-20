import { defineType, defineField } from 'sanity'
import { BlockElementIcon } from '@sanity/icons/BlockElement'
import {
  sectionActiveField,
  sectionAnchorField,
} from '../lib/section-chrome'

export default defineType({
  title: 'Banner (branded)',
  name: 'bannerBlock',
  type: 'object',
  icon: BlockElementIcon,
  description:
    'Signature aurora CTA strip. Prefer Form or CTA for standard conversion bands.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'section', title: 'Section' },
  ],
  fields: [
    sectionActiveField('section'),
    sectionAnchorField('section'),
    defineField({
      title: 'Content',
      name: 'content',
      type: 'simpleText',
      group: 'content',
      description:
        'Headline and supporting text (H1 uses display typography in this block)',
    }),
    defineField({
      title: 'CTA',
      name: 'cta',
      type: 'cta',
      group: 'content',
    }),
  ],
  preview: {
    select: { active: 'active', content: 'content' },
    prepare({ active, content }) {
      const excerpt =
        Array.isArray(content) && content[0]?.children?.[0]?.text
          ? content[0].children[0].text
          : 'Empty'
      return {
        title: 'Banner (branded)',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${excerpt}`,
      }
    },
  },
})
