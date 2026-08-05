import { defineField, defineType } from 'sanity'

/**
 * Where a post was republished. Record-keeping, and a place to confirm the
 * canonical tag actually landed on the copy.
 */
export default defineType({
  name: 'syndication',
  title: 'Syndication',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'mediumUrl',
      title: 'Medium URL',
      type: 'url',
      description:
        'Paste after importing. Then view source on the Medium post and confirm rel=canonical points back here.',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn post URL',
      type: 'url',
      description: 'The feed post that links to this article.',
    }),
    defineField({
      name: 'substackUrl',
      title: 'Substack URL',
      type: 'url',
    }),
    defineField({
      name: 'syndicatedAt',
      title: 'First syndicated',
      type: 'date',
      description: 'Publish here first and let the original get indexed before republishing.',
    }),
  ],
})
