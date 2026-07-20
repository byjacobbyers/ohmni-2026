import { defineType, defineField } from 'sanity'
import { BlockElementIcon } from '@sanity/icons/BlockElement'
import {
  sectionActiveField,
  sectionAnchorField,
} from '../lib/section-chrome'

/** Spacing — gap (spacer) or horizontal rule. */
export default defineType({
  title: 'Spacing',
  name: 'dividerBlock',
  type: 'object',
  icon: BlockElementIcon,
  description: 'Vertical gap or a horizontal rule between sections.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'section', title: 'Section' },
  ],
  fields: [
    sectionActiveField('section'),
    sectionAnchorField('section'),
    defineField({
      title: 'Style',
      name: 'style',
      type: 'string',
      group: 'content',
      initialValue: 'rule',
      options: {
        list: [
          { title: 'Horizontal rule', value: 'rule' },
          { title: 'Gap only', value: 'gap' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      title: 'Size',
      name: 'size',
      type: 'string',
      group: 'content',
      initialValue: 'medium',
      options: {
        list: [
          { title: 'Zero', value: 'zero' },
          { title: 'Small', value: 'small' },
          { title: 'Medium', value: 'medium' },
          { title: 'Large', value: 'large' },
        ],
      },
    }),
  ],
  preview: {
    select: { size: 'size', active: 'active', style: 'style' },
    prepare({ size, active, style }) {
      return {
        title: 'Spacing',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${style || 'rule'} · ${size || 'medium'}`,
      }
    },
  },
})
