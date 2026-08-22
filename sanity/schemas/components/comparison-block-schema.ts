import { defineField, defineType } from 'sanity'
import { ThLargeIcon } from '@sanity/icons/ThLarge'
import {
  sectionActiveField,
  sectionAnchorField,
  sectionBackgroundField,
  sectionChromeGroup,
} from '../lib/section-chrome'

/**
 * Side-by-side comparison with line items and a total per column.
 *
 * Built for cost comparisons, but deliberately generic: any set of options
 * with itemised rows, a headline figure and a closing caveat fits.
 */
export default defineType({
  name: 'comparisonBlock',
  title: 'Comparison',
  type: 'object',
  icon: ThLargeIcon,
  description: 'Columns of line items with a total each, one optionally highlighted.',
  groups: [
    { name: 'content', title: 'Content', default: true },
    sectionChromeGroup,
  ],
  fields: [
    sectionActiveField(),
    sectionAnchorField(),
    sectionBackgroundField(),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 2,
      group: 'content',
      description: 'Assumptions behind the numbers. Shown under the heading.',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      group: 'content',
      validation: (Rule) => Rule.min(2).max(4).error('Between two and four columns.'),
      of: [
        defineField({
          name: 'option',
          title: 'Option',
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'subtitle', type: 'string' }),
            defineField({
              name: 'rows',
              title: 'Line items',
              type: 'array',
              of: [
                defineField({
                  name: 'row',
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', type: 'string' }),
                    defineField({ name: 'value', type: 'string' }),
                    defineField({
                      name: 'emphasis', title: 'Emphasis', type: 'string',
                      description: 'Colour the value to read as a win or a miss.',
                      options: { list: [
                        { title: 'None', value: 'none' },
                        { title: 'Good', value: 'good' },
                        { title: 'Bad', value: 'bad' },
                      ], layout: 'radio', direction: 'horizontal' },
                      initialValue: 'none',
                    }),
                  ],
                  preview: {
                    select: { title: 'label', subtitle: 'value' },
                  },
                }),
              ],
            }),
            defineField({ name: 'totalLabel', title: 'Total label', type: 'string', initialValue: 'Total' }),
            defineField({ name: 'total', title: 'Total value', type: 'string' }),
            defineField({
              name: 'footnote',
              type: 'text',
              rows: 2,
              description: 'One line under the column. What you get, or what is missing.',
            }),
            defineField({
              name: 'highlight',
              title: 'Highlight this column',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'total', highlight: 'highlight' },
            prepare: ({ title, subtitle, highlight }) => ({
              title: highlight ? `${title} ★` : title,
              subtitle,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'note',
      title: 'Closing note',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'The honest caveat. Sits under the columns with a rule.',
    }),
  ],
  preview: {
    select: { heading: 'heading', columns: 'columns' },
    prepare({ heading, columns }) {
      const n = Array.isArray(columns) ? columns.length : 0
      return {
        title: heading || 'Comparison',
        subtitle: `${n} column${n === 1 ? '' : 's'}`,
      }
    },
  },
})
