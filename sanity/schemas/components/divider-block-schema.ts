import { defineType, defineField } from 'sanity'
import { BlockElementIcon } from '@sanity/icons/BlockElement'

/** Spacing — gap (spacer) or horizontal rule. */
export default defineType({
  title: 'Spacing',
  name: 'dividerBlock',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({ title: 'Active?', name: 'active', type: 'boolean', initialValue: true }),
    defineField({ title: 'Anchor', name: 'anchor', type: 'string' }),
    defineField({
      title: 'Style',
      name: 'style',
      type: 'string',
      initialValue: 'rule',
      options: {
        list: [
          { title: 'Horizontal rule', value: 'rule' },
          { title: 'Gap only', value: 'gap' },
        ],
      },
    }),
    defineField({
      title: 'Size',
      name: 'size',
      type: 'string',
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
