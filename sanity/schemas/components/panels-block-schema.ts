import { defineField, defineType } from 'sanity'
import { BlockElementIcon } from '@sanity/icons/BlockElement'
import {
  sectionActiveField,
  sectionAnchorField,
  sectionBackgroundField,
  sectionChromeGroup,
} from '../lib/section-chrome'

/**
 * A grid of panels: eyebrow, title, optional tags, body, one optionally
 * highlighted, with a kicker above and a note below.
 *
 * One shape for phases of a plan, roles in a system, areas of a job, or
 * properties of a stack. Left-aligned and dense, where columnBlock cards are
 * centred and airy.
 */
export default defineType({
  name: 'panelsBlock',
  title: 'Panels',
  type: 'object',
  icon: BlockElementIcon,
  description: 'Dense left-aligned panels with an eyebrow, title, tags and body.',
  groups: [{ name: 'content', title: 'Content', default: true }, sectionChromeGroup],
  fields: [
    sectionActiveField(),
    sectionAnchorField(),
    sectionBackgroundField(),
    defineField({ name: 'kicker', title: 'Kicker', type: 'string', group: 'content',
      description: 'Small uppercase line above the heading.' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', group: 'content' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 2, group: 'content' }),
    defineField({
      name: 'columnsPerRow', title: 'Panels per row', type: 'number', group: 'content',
      initialValue: 3, options: { list: [2, 3, 4] },
    }),
    defineField({
      name: 'panels', title: 'Panels', type: 'array', group: 'content',
      validation: (Rule) => Rule.min(1),
      of: [
        defineField({
          name: 'panel', title: 'Panel', type: 'object',
          fields: [
            defineField({ name: 'eyebrow', type: 'string', description: 'Weeks 1 to 2, Front desk, Platform…' }),
            defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }],
              description: 'Short chips under the title, such as tool names.' }),
            defineField({ name: 'body', title: 'Body', type: 'simpleText' }),
            defineField({ name: 'highlight', title: 'Highlight this panel', type: 'boolean', initialValue: false }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'eyebrow', highlight: 'highlight' },
            prepare: ({ title, subtitle, highlight }) => ({ title: highlight ? `${title} ★` : title, subtitle }),
          },
        }),
      ],
    }),
    defineField({ name: 'note', title: 'Closing note', type: 'simpleText', group: 'content',
      description: 'Sits under the panels with a rule. Can carry a bold lead-in.' }),
  ],
  preview: {
    select: { heading: 'heading', kicker: 'kicker', panels: 'panels' },
    prepare({ heading, kicker, panels }) {
      const n = Array.isArray(panels) ? panels.length : 0
      return { title: heading || kicker || 'Panels', subtitle: `${n} panel${n === 1 ? '' : 's'}` }
    },
  },
})
