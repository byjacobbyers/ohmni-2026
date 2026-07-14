import { defineType, defineField } from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import ImagesPerRowInput from '../inputs/images-per-row-input'

const postsBlock = defineType({
  title: 'Posts Block',
  name: 'postsBlock',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      title: 'Active?',
      name: 'active',
      type: 'boolean',
      description: 'Set to false if you need to remove from page but not delete',
      initialValue: true,
    }),
    defineField({
      title: 'Anchor',
      name: 'anchor',
      type: 'string',
      description: 'The anchor for the section. No hash symbols. Optional.',
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
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Optional heading for the posts section',
    }),
    defineField({
      title: 'Number of Posts',
      name: 'count',
      type: 'number',
      description: 'How many of the latest posts to show (1-12)',
      validation: (Rule) => Rule.min(1).max(12),
      initialValue: 3,
    }),
    defineField({
      title: 'Columns Per Row',
      name: 'columnsPerRow',
      type: 'number',
      description: 'Number of columns to display per row (2-4)',
      components: {
        input: ImagesPerRowInput,
      },
      validation: (Rule) => Rule.min(2).max(4),
      initialValue: 3,
    }),
  ],
  preview: {
    select: { title: 'title', active: 'active', count: 'count', columnsPerRow: 'columnsPerRow' },
    prepare({ title, active, count, columnsPerRow }) {
      return {
        title: 'Posts Block',
        subtitle: `${active ? 'Active' : 'Not Active'} - latest ${count ?? 3} - ${columnsPerRow ?? 3} per row - ${title || 'No Title'}`,
      }
    },
  },
})

export default postsBlock
