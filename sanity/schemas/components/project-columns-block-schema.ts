import { defineType, defineField } from 'sanity'
import {InlineElementIcon} from '@sanity/icons/InlineElement'
import ImagesPerRowInput from '../inputs/images-per-row-input'

const projectColumnsBlock = defineType({
  title: 'Project Columns Block',
  name: 'projectColumnsBlock',
  type: 'object',
  icon: InlineElementIcon,
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
      description: 'Optional title for the project section',
    }),
    defineField({
      title: 'Projects',
      name: 'projects',
      type: 'array',
      of: [{ type: 'project' }],
      description: 'Add individual projects with their own content',
      validation: (Rule) => Rule.min(1).max(4),
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
    select: {
      title: 'title',
      active: 'active',
      projects: 'projects',
      columnsPerRow: 'columnsPerRow',
    },
    prepare({ title, active, projects, columnsPerRow }) {
      const count = projects?.length || 0
      const perRow = columnsPerRow ?? 3
      return {
        title: 'Project Columns Block',
        subtitle: `${active ? 'Active' : 'Not Active'} - ${count} project${count !== 1 ? 's' : ''} - ${perRow} per row - ${title || 'No Title'}`,
      }
    },
  },
})

export default projectColumnsBlock
