import { defineType, defineField } from 'sanity'
import { BlockElementIcon } from '@sanity/icons/BlockElement'

/** @deprecated Prefer dividerBlock (Spacing) with style="gap". Kept for dual-render. */
export default defineType({
  title: 'Spacer (legacy)',
  name: 'spacerBlock',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({ title: 'Active?', name: 'active', type: 'boolean', initialValue: true }),
    defineField({ title: 'Anchor', name: 'anchor', type: 'string' }),
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
    select: { size: 'size', active: 'active' },
    prepare({ size, active }) {
      return {
        title: 'Spacer (legacy)',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${size || 'medium'}`,
      }
    },
  },
})
