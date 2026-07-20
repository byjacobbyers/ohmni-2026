import { defineType, defineField } from 'sanity'
import { ImageIcon } from '@sanity/icons/Image'
import ContentPositionInput from '../inputs/content-position-input'
import OpacitySliderInput from '../inputs/opacity-slider-input'
import { sectionActiveField, sectionAnchorField } from '../lib/section-chrome'

export default defineType({
  title: 'Hero',
  name: 'coverBlock',
  type: 'object',
  icon: ImageIcon,
  description: 'Full-bleed hero: image, video, or color background with overlay content.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'background', title: 'Background' },
    { name: 'layout', title: 'Layout' },
    { name: 'overlay', title: 'Overlay' },
    { name: 'video', title: 'Video' },
    { name: 'section', title: 'Section' },
  ],
  fields: [
    sectionActiveField('section'),
    sectionAnchorField('section'),

    defineField({
      title: 'Content',
      name: 'content',
      type: 'simpleText',
      group: 'content',
    }),
    defineField({
      title: 'CTA',
      name: 'cta',
      type: 'cta',
      group: 'content',
    }),

    defineField({
      title: 'Background Type',
      name: 'backgroundType',
      type: 'string',
      group: 'background',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
          { title: 'Color', value: 'color' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
    }),
    defineField({
      title: 'Background Image',
      name: 'image',
      type: 'defaultImage',
      group: 'background',
      hidden: ({ parent }) => parent?.backgroundType !== 'image',
    }),
    defineField({
      title: 'Background Image (Mobile)',
      name: 'imageMobile',
      type: 'defaultImage',
      group: 'background',
      description: 'Optional. Falls back to desktop image if empty.',
      hidden: ({ parent }) => parent?.backgroundType !== 'image',
    }),
    defineField({
      title: 'Video Provider',
      name: 'videoProvider',
      type: 'string',
      group: 'background',
      options: {
        list: [
          { title: 'Mux', value: 'mux' },
          { title: 'Vimeo', value: 'vimeo' },
        ],
        layout: 'radio',
      },
      initialValue: 'mux',
      hidden: ({ parent }) => parent?.backgroundType !== 'video',
    }),
    defineField({
      title: 'Mux Video',
      name: 'muxUrl',
      type: 'mux.video',
      group: 'background',
      hidden: ({ parent }) =>
        parent?.backgroundType !== 'video' || parent?.videoProvider !== 'mux',
    }),
    defineField({
      title: 'Mux Video (Mobile)',
      name: 'muxUrlMobile',
      type: 'mux.video',
      group: 'background',
      description: 'Optional. Falls back to desktop if empty.',
      hidden: ({ parent }) =>
        parent?.backgroundType !== 'video' || parent?.videoProvider !== 'mux',
    }),
    defineField({
      title: 'Vimeo URL',
      name: 'vimeoUrl',
      type: 'url',
      group: 'background',
      hidden: ({ parent }) =>
        parent?.backgroundType !== 'video' || parent?.videoProvider !== 'vimeo',
    }),
    defineField({
      title: 'Vimeo URL (Mobile)',
      name: 'vimeoUrlMobile',
      type: 'url',
      group: 'background',
      hidden: ({ parent }) =>
        parent?.backgroundType !== 'video' || parent?.videoProvider !== 'vimeo',
    }),
    defineField({
      title: 'Background Color',
      name: 'backgroundColor',
      type: 'string',
      group: 'background',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Texture', value: 'texture' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'primary',
      hidden: ({ parent }) => parent?.backgroundType !== 'color',
    }),

    defineField({
      title: 'Height',
      name: 'height',
      type: 'string',
      group: 'layout',
      description:
        'Full Viewport = at least 100% of the screen (min-h-screen). Defaults to full so heroes fill the viewport.',
      options: {
        list: [
          { title: 'Full Viewport (100%)', value: 'full' },
          { title: 'Three-Quarter Viewport (75%)', value: 'threeQuarter' },
          { title: 'Half Viewport (50%)', value: 'half' },
          { title: 'Auto', value: 'auto' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'full',
    }),
    defineField({
      title: 'Content Position',
      name: 'contentPosition',
      type: 'string',
      group: 'layout',
      description: 'Click a position in the grid to place your content',
      components: { input: ContentPositionInput },
      initialValue: 'center',
    }),
    defineField({
      title: 'Content Half Width (Desktop)',
      name: 'contentHalfWidth',
      type: 'boolean',
      group: 'layout',
      initialValue: false,
    }),

    defineField({
      title: 'Overlay Color',
      name: 'overlayColor',
      type: 'string',
      group: 'overlay',
      description: 'Color overlay on the background image or video',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Black', value: 'black' },
          { title: 'White', value: 'white' },
          { title: 'Primary', value: 'primary' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'none',
      hidden: ({ parent }) => parent?.backgroundType === 'color',
    }),
    defineField({
      title: 'Overlay Opacity',
      name: 'overlayOpacity',
      type: 'number',
      group: 'overlay',
      components: { input: OpacitySliderInput },
      validation: (Rule) => Rule.min(0).max(100),
      initialValue: 50,
      hidden: ({ parent }) =>
        parent?.backgroundType === 'color' || parent?.overlayColor === 'none',
    }),

    defineField({
      title: 'Autoplay',
      name: 'autoplay',
      type: 'boolean',
      group: 'video',
      initialValue: true,
      hidden: ({ parent }) => parent?.backgroundType !== 'video',
    }),
    defineField({
      title: 'Loop',
      name: 'loop',
      type: 'boolean',
      group: 'video',
      initialValue: true,
      hidden: ({ parent }) => parent?.backgroundType !== 'video',
    }),
    defineField({
      title: 'Muted',
      name: 'muted',
      type: 'boolean',
      group: 'video',
      initialValue: true,
      hidden: ({ parent }) => parent?.backgroundType !== 'video',
    }),
    defineField({
      title: 'Show Controls',
      name: 'controls',
      type: 'boolean',
      group: 'video',
      initialValue: false,
      hidden: ({ parent }) => parent?.backgroundType !== 'video',
    }),
  ],
  preview: {
    select: {
      active: 'active',
      height: 'height',
      backgroundType: 'backgroundType',
      media: 'image',
    },
    prepare({ active, height, backgroundType, media }) {
      const h =
        height === 'full'
          ? 'Full 100%'
          : height === 'threeQuarter'
            ? '¾'
            : height === 'half'
              ? 'Half'
              : 'Auto'
      return {
        title: 'Hero',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${backgroundType || 'image'} · ${h}`,
        media,
      }
    },
  },
})
