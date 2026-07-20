import { defineType, defineField } from 'sanity'
import { ImageIcon } from '@sanity/icons/Image'

const maxWidthOptions = [
  { title: 'Small (24rem)', value: 'max-w-sm' },
  { title: 'Medium (28rem)', value: 'max-w-md' },
  { title: 'Large (32rem)', value: 'max-w-lg' },
  { title: 'XL (36rem)', value: 'max-w-xl' },
  { title: '2XL (42rem)', value: 'max-w-2xl' },
  { title: '3XL (48rem)', value: 'max-w-3xl' },
  { title: '4XL (56rem)', value: 'max-w-4xl' },
  { title: '5XL (64rem)', value: 'max-w-5xl' },
  { title: '6XL (72rem)', value: 'max-w-6xl' },
  { title: '7XL (80rem)', value: 'max-w-7xl' },
  { title: 'Full width', value: 'max-w-full' },
]

/** Media — image or video single asset. */
export default defineType({
  title: 'Media',
  name: 'imageBlock',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      title: 'Active?',
      name: 'active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ title: 'Anchor', name: 'anchor', type: 'string' }),
    defineField({
      title: 'Media type',
      name: 'mediaType',
      type: 'string',
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
      hidden: ({ parent }) => parent?.mediaType === 'video',
    }),
    defineField({
      title: 'Image (Mobile)',
      name: 'imageMobile',
      type: 'defaultImage',
      description: 'Optional. Shown on small screens; falls back to main image if empty.',
      hidden: ({ parent }) => parent?.mediaType === 'video',
    }),
    defineField({
      title: 'Video Provider',
      name: 'videoProvider',
      type: 'string',
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
      hidden: ({ parent }) =>
        parent?.mediaType !== 'video' || parent?.videoProvider !== 'mux',
    }),
    defineField({
      title: 'Mux Video (Mobile)',
      name: 'muxUrlMobile',
      type: 'mux.video',
      hidden: ({ parent }) =>
        parent?.mediaType !== 'video' || parent?.videoProvider !== 'mux',
    }),
    defineField({
      title: 'Vimeo URL',
      name: 'vimeoUrl',
      type: 'url',
      hidden: ({ parent }) =>
        parent?.mediaType !== 'video' || parent?.videoProvider !== 'vimeo',
    }),
    defineField({
      title: 'Vimeo URL (Mobile)',
      name: 'vimeoUrlMobile',
      type: 'url',
      hidden: ({ parent }) =>
        parent?.mediaType !== 'video' || parent?.videoProvider !== 'vimeo',
    }),
    defineField({
      title: 'Autoplay',
      name: 'autoplay',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      title: 'Loop',
      name: 'loop',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      title: 'Muted',
      name: 'muted',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      title: 'Show Controls',
      name: 'controls',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      title: 'Max Width',
      name: 'maxWidth',
      type: 'string',
      initialValue: 'max-w-2xl',
      options: {
        list: maxWidthOptions,
        layout: 'dropdown',
      },
    }),
  ],
  preview: {
    select: { active: 'active', mediaType: 'mediaType' },
    prepare({ active, mediaType }) {
      return {
        title: 'Media',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${mediaType || 'image'}`,
      }
    },
  },
})
