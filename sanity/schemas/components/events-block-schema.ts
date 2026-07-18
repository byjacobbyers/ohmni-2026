import { defineType, defineField } from 'sanity'
import { CalendarIcon } from '@sanity/icons/Calendar'

const eventsBlock = defineType({
  title: 'Events Block',
  name: 'eventsBlock',
  type: 'object',
  icon: CalendarIcon,
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
      description: 'Optional heading for the events section',
    }),
    defineField({
      title: 'Initial events shown',
      name: 'count',
      type: 'number',
      description:
        'How many events to show before “Load more”. Remaining events are revealed on click (list is still server-fetched for SEO).',
      validation: (Rule) => Rule.min(1).max(24),
      initialValue: 6,
    }),
  ],
  preview: {
    select: { title: 'title', active: 'active', count: 'count' },
    prepare({ title, active, count }) {
      return {
        title: 'Events Block',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · show ${count ?? 6} then load more · ${title || 'No title'}`,
      }
    },
  },
})

export default eventsBlock
