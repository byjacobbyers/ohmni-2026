import { defineType, defineField } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons/DocumentText'

const postsBlock = defineType({
  title: 'Posts (add-on)',
  name: 'postsBlock',
  type: 'object',
  icon: DocumentTextIcon,
  description: 'Blog listing. Enable when the client has posts.',
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
      title: 'Initial posts shown',
      name: 'count',
      type: 'number',
      description:
        'How many posts to show before “Load more”. Remaining posts are revealed on click (all posts are still server-rendered for SEO).',
      validation: (Rule) => Rule.min(1).max(24),
      initialValue: 6,
    }),
  ],
  preview: {
    select: { title: 'title', active: 'active', count: 'count' },
    prepare({ title, active, count }) {
      return {
        title: 'Posts Block',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · show ${count ?? 6} then load more · ${title || 'No title'}`,
      }
    },
  },
})

export default postsBlock
