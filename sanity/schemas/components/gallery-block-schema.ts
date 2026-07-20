import { defineType, defineField } from 'sanity'
import { ImagesIcon } from '@sanity/icons/Images'
import ImagesPerRowInput from '../inputs/images-per-row-input'
import {
  sectionActiveField,
  sectionAnchorField,
  sectionBackgroundField,
} from '../lib/section-chrome'

const galleryBlock = defineType({
  title: 'Gallery',
  name: 'galleryBlock',
  type: 'object',
  icon: ImagesIcon,
  description: 'Multi-image grid with optional lightbox.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'section', title: 'Section' },
  ],
  fields: [
    sectionActiveField('section'),
    sectionAnchorField('section'),
    sectionBackgroundField('section'),
    defineField({
      title: 'Images',
      name: 'images',
      type: 'array',
      group: 'content',
      of: [{ type: 'defaultImage' }],
      description: 'Add images to the gallery',
      validation: (Rule) =>
        Rule.min(1).required().error('At least one image is required'),
    }),
    defineField({
      title: 'Images Per Row',
      name: 'imagesPerRow',
      type: 'number',
      group: 'content',
      description: 'Number of images to display per row (2-4)',
      components: { input: ImagesPerRowInput },
      validation: (Rule) => Rule.min(2).max(4),
      initialValue: 3,
    }),
    defineField({
      title: 'Enable Lightbox',
      name: 'enableLightbox',
      type: 'boolean',
      group: 'content',
      description: 'Allow users to click images to view full size',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      active: 'active',
      imagesPerRow: 'imagesPerRow',
      media: 'images.0',
      images: 'images',
    },
    prepare({ active, imagesPerRow, media, images }) {
      const perRow = imagesPerRow ?? 3
      const count = Array.isArray(images) ? images.length : 0
      return {
        title: 'Gallery',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${count} · ${perRow}/row`,
        media: media || ImagesIcon,
      }
    },
  },
})

export default galleryBlock
