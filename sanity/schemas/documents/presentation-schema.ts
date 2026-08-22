import { defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons/Play'

/**
 * A deck presented one screen at a time at /present/{slug}.
 *
 * Screens reuse the page-builder `sections` type outright, so the insert menu,
 * the grid thumbnails and every block component are the same ones the site
 * uses. A new deck is a new document, not a pull request.
 *
 * Screen identity comes from section chrome `anchor` when set, otherwise the
 * block `_key`. Set an anchor to get a readable URL.
 */
export default defineType({
  name: 'presentation',
  title: 'Presentation',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      description: 'Presented at /present/{slug}. Not indexed by search engines.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Who this is for',
      name: 'audience',
      type: 'string',
      description: 'Internal note. Never rendered.',
    }),
    defineField({
      title: 'Corner mark',
      name: 'cornerMark',
      type: 'string',
      description:
        'Replaces the Ohmni lockup in the top left. Use your own name for a deck that is a work sample rather than a company pitch. Leave empty for the lockup.',
    }),
    defineField({
      name: 'sections',
      type: 'sections',
      title: 'Screens',
      description:
        'One screen per section, shown full height. Keep each to a single idea: anything taller than the viewport will scroll, which breaks the pacing.',
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', audience: 'audience', sections: 'sections' },
    prepare({ title, slug, audience, sections }) {
      const count = Array.isArray(sections) ? sections.length : 0
      return {
        title: title || 'Presentation',
        subtitle: `/present/${slug ?? ''} · ${count} screen${count === 1 ? '' : 's'}${audience ? ` · ${audience}` : ''}`,
      }
    },
  },
})
