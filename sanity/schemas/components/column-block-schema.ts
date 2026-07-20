import { defineType, defineField } from 'sanity'
import { InlineElementIcon } from '@sanity/icons/InlineElement'
import ImagesPerRowInput from '../inputs/images-per-row-input'
import {
  sectionActiveField,
  sectionAnchorField,
} from '../lib/section-chrome'

/** Cards grid — absorbs column + project column layouts. */
export default defineType({
  title: 'Cards',
  name: 'columnBlock',
  type: 'object',
  icon: InlineElementIcon,
  description:
    '2–4 card grid. Logo style = muted contain cards; Project style = full-bleed media cards.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'section', title: 'Section' },
  ],
  fields: [
    sectionActiveField('section'),
    sectionAnchorField('section'),
    defineField({
      title: 'Background Color',
      name: 'backgroundColor',
      type: 'string',
      group: 'section',
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
      title: 'Card style',
      name: 'cardStyle',
      type: 'string',
      group: 'content',
      initialValue: 'logo',
      description:
        'Logo / icon: centered logo or icon on muted cards. Project / media: image on top with cover crop.',
      options: {
        list: [
          { title: 'Logo / icon cards', value: 'logo' },
          { title: 'Project / media cards', value: 'project' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      group: 'content',
      description: 'Optional plain heading above the cards. Prefer Intro for rich text.',
    }),
    defineField({
      title: 'Intro',
      name: 'intro',
      type: 'simpleText',
      group: 'content',
      description: 'Optional rich heading/copy above the card grid.',
    }),
    defineField({
      title: 'Intro (legacy)',
      name: 'content',
      type: 'simpleText',
      group: 'content',
      hidden: ({ parent }) =>
        Array.isArray(parent?.intro) && parent.intro.length > 0,
      description: 'Legacy field from Problem sections. Prefer Intro above.',
    }),
    defineField({
      title: 'Cards',
      name: 'columns',
      type: 'array',
      group: 'content',
      of: [{ type: 'column' }],
      validation: (Rule) => Rule.min(1).max(4),
    }),
    defineField({
      title: 'Footer / excerpt',
      name: 'excerpt',
      type: 'simpleText',
      group: 'content',
      description: 'Optional copy below the card grid.',
    }),
    defineField({
      title: 'Columns Per Row',
      name: 'columnsPerRow',
      type: 'number',
      group: 'content',
      components: { input: ImagesPerRowInput },
      validation: (Rule) => Rule.min(2).max(4),
      initialValue: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      active: 'active',
      columns: 'columns',
      columnsPerRow: 'columnsPerRow',
      cardStyle: 'cardStyle',
      media: 'columns.0.image',
    },
    prepare({ title, active, columns, columnsPerRow, cardStyle, media }) {
      const columnCount = columns?.length || 0
      const perRow = columnsPerRow ?? 3
      const styleLabel =
        cardStyle === 'project' ? 'Project cards' : 'Logo cards'
      return {
        title: 'Cards',
        subtitle: `${active === false ? 'Inactive' : 'Active'} · ${styleLabel} · ${columnCount} · ${perRow}/row · ${title || 'Untitled'}`,
        media,
      }
    },
  },
})
