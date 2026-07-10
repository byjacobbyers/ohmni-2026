import { defineType, defineField } from 'sanity'
import {InlineIcon} from '@sanity/icons/Inline'

const project = defineType({
  title: 'Project',
  type: 'object',
  name: 'project',
  icon: InlineIcon,
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Optional title for this project',
    }),
    defineField({
      title: 'Content',
      name: 'content',
      type: 'simpleText',
      description: 'Main content for the project',
    }),
    defineField({
      title: 'Image',
      name: 'image',
      type: 'defaultImage',
      description: 'Optional image for this project',
    }),
    defineField({
      title: 'CTA',
      name: 'cta',
      type: 'cta',
      description: 'Optional call to action button',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      content: 'content',
    },
    prepare(selection) {
      const { title, content } = selection
      return {
        title: title || 'Project',
        subtitle: content ? content[0]?.children[0]?.text || 'No Content' : 'No Content',
      }
    },
  },
})

export default project
