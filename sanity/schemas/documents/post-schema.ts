import { defineField, defineType } from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { title: 'Post Details', name: 'post', default: true },
    { title: 'SEO & Settings', name: 'seo' },
  ],
  fields: [
    defineField({
      title: 'Post Image',
      name: 'image',
      type: 'defaultImage',
      group: 'post',
    }),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      group: 'post',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      group: 'post',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Publish Date',
      name: 'publishedAt',
      type: 'date',
      group: 'post',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Author',
      name: 'author',
      type: 'string',
      group: 'post',
    }),
    defineField({
      title: 'Category',
      name: 'category',
      type: 'string',
      group: 'post',
    }),
    defineField({
      title: 'Excerpt',
      name: 'excerpt',
      type: 'text',
      rows: 3,
      group: 'post',
      description: 'Short summary shown in post collections and share previews.',
    }),
    defineField({
      name: 'sections',
      type: 'sections',
      group: 'post',
      title: 'Page sections',
    }),
    defineField({
      title: 'SEO / Share Settings',
      name: 'seo',
      type: 'seo',
      group: 'seo',
      options: { collapsible: true, collapsed: false },
    }),
  ],
  preview: {
    select: { title: 'title', publishedAt: 'publishedAt', category: 'category' },
    prepare({ title, publishedAt, category }) {
      const date = publishedAt
        ? new Date(publishedAt + 'T12:00:00').toLocaleDateString()
        : 'No date'
      return {
        title,
        subtitle: category ? `${date} - ${category}` : date,
      }
    },
  },
})
