import { defineType, defineField } from 'sanity'
import { InlineElementIcon } from '@sanity/icons/InlineElement'
import ImagesPerRowInput from '../inputs/images-per-row-input'

/** Cards grid — absorbs column + project column layouts. */
export default defineType({
  title: 'Cards',
  name: 'columnBlock',
  type: 'object',
  icon: InlineElementIcon,
  fields: [
    defineField({
      title: 'Active?',
      name: 'active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      title: 'Anchor',
      name: 'anchor',
      type: 'string',
    }),
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
      title: 'Card style',
      name: 'cardStyle',
      type: 'string',
      initialValue: 'logo',
      options: {
        list: [
          { title: 'Logo / icon cards', value: 'logo' },
          { title: 'Project / media cards', value: 'project' },
        ],
      },
    }),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
    }),
    defineField({
      title: 'Cards',
      name: 'columns',
      type: 'array',
      of: [{ type: 'column' }],
      validation: (Rule) => Rule.min(1).max(4),
    }),
    defineField({
      title: 'Columns Per Row',
      name: 'columnsPerRow',
      type: 'number',
      components: { input: ImagesPerRowInput },
      validation: (Rule) => Rule.min(2).max(4),
      initialValue: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      active: 'active',
      columns: 'columns',
      columnsPerRow: 'columnsPerRow',
      cardStyle: 'cardStyle',
    },
    prepare({ title, active, columns, columnsPerRow, cardStyle }) {
      const columnCount = columns?.length || 0
      const perRow = columnsPerRow ?? 3
      return {
        title: 'Cards',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${cardStyle || 'logo'} · ${columnCount} · ${perRow}/row · ${title || 'Untitled'}`,
      }
    },
  },
})
