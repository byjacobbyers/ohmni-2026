import { defineType, defineField } from 'sanity'
import { ImageIcon } from '@sanity/icons/Image'
import {
  sectionActiveField,
  sectionAnchorField,
  sectionBackgroundField,
  simpleMaxWidthOptions,
} from '../lib/section-chrome'

/** Media — image or video single asset. */
export default defineType({
  title: 'Media',
  name: 'imageBlock',
  type: 'object',
  icon: ImageIcon,
  description: 'Single image or video with optional max width.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'display', title: 'Display' },
    { name: 'section', title: 'Section' },
  ],
  fields: [
    sectionActiveField('section'),
    sectionAnchorField('section'),
    sectionBackgroundField('section'),

    defineField({
      title: 'Media type',
      name: 'mediaType',
      type: 'string',
      group: 'content',
      initialValue: 'image',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      title: 'Image',
      name: 'image',
      type: 'defaultImage',
      group: 'content',
      hidden: ({ parent }) => parent?.mediaType === 'video',
    }),
    defineField({
      title: 'Image (Mobile)',
      name: 'imageMobile',
      type: 'defaultImage',
      group: 'content',
      description: 'Optional. Shown on small screens; falls back to main image if empty.',
      hidden: ({ parent }) => parent?.mediaType === 'video',
    }),
    defineField({
      title: 'Video Provider',
      name: 'videoProvider',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Mux', value: 'mux' },
          { title: 'Vimeo', value: 'vimeo' },
        ],
        layout: 'radio',
      },
      initialValue: 'mux',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      title: 'Mux Video',
      name: 'muxUrl',
      type: 'mux.video',
      group: 'content',
      hidden: ({ parent }) =>
        parent?.mediaType !== 'video' || parent?.videoProvider !== 'mux',
    }),
    defineField({
      title: 'Mux Video (Mobile)',
      name: 'muxUrlMobile',
      type: 'mux.video',
      group: 'content',
      hidden: ({ parent }) =>
        parent?.mediaType !== 'video' || parent?.videoProvider !== 'mux',
    }),
    defineField({
      title: 'Vimeo URL',
      name: 'vimeoUrl',
      type: 'url',
      group: 'content',
      hidden: ({ parent }) =>
        parent?.mediaType !== 'video' || parent?.videoProvider !== 'vimeo',
    }),
    defineField({
      title: 'Vimeo URL (Mobile)',
      name: 'vimeoUrlMobile',
      type: 'url',
      group: 'content',
      hidden: ({ parent }) =>
        parent?.mediaType !== 'video' || parent?.videoProvider !== 'vimeo',
    }),

    defineField({
      title: 'Max Width',
      name: 'maxWidth',
      type: 'string',
      group: 'display',
      initialValue: 'max-w-2xl',
      options: {
        list: simpleMaxWidthOptions,
        layout: 'dropdown',
      },
    }),
    defineField({
      title: 'Autoplay',
      name: 'autoplay',
      type: 'boolean',
      group: 'display',
      initialValue: true,
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      title: 'Loop',
      name: 'loop',
      type: 'boolean',
      group: 'display',
      initialValue: true,
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      title: 'Muted',
      name: 'muted',
      type: 'boolean',
      group: 'display',
      initialValue: true,
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      title: 'Show Controls',
      name: 'controls',
      type: 'boolean',
      group: 'display',
      initialValue: true,
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
  ],
  preview: {
    select: { active: 'active', mediaType: 'mediaType', media: 'image' },
    prepare({ active, mediaType, media }) {
      return {
        title: 'Media',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${mediaType || 'image'}`,
        media: mediaType === 'video' ? undefined : media,
      }
    },
  },
})
