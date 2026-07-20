import { defineField } from 'sanity'

/** Shared Section group for page-builder blocks. */
export const sectionChromeGroup = {
  name: 'section',
  title: 'Section',
} as const

export function sectionActiveField(group = 'section') {
  return defineField({
    title: 'Active?',
    name: 'active',
    type: 'boolean',
    group,
    initialValue: true,
    description: 'Turn off to hide this section without deleting it.',
  })
}

export function sectionAnchorField(group = 'section') {
  return defineField({
    title: 'Anchor',
    name: 'anchor',
    type: 'string',
    group,
    description: 'Section id for in-page links. Lowercase letters, numbers, hyphens only — no #.',
    validation: (Rule) =>
      Rule.regex(/^[a-z0-9-]+$/).warning(
        'Use only lowercase letters, numbers, and hyphens'
      ),
  })
}

export function sectionBackgroundField(group = 'section') {
  return defineField({
    title: 'Background Color',
    name: 'backgroundColor',
    type: 'string',
    group,
    options: {
      list: [
        { title: 'Primary', value: 'primary' },
        { title: 'Secondary', value: 'secondary' },
        { title: 'Texture', value: 'texture' },
      ],
    },
    initialValue: 'primary',
  })
}

/** Simplified max-width choices for Media / Embed (existing Tailwind tokens). */
export const simpleMaxWidthOptions = [
  { title: 'Narrow', value: 'max-w-md' },
  { title: 'Medium', value: 'max-w-2xl' },
  { title: 'Wide', value: 'max-w-4xl' },
  { title: 'Full', value: 'max-w-full' },
]
