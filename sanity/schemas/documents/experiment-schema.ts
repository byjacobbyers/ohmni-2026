import { defineField, defineType } from 'sanity'
import { SplitVerticalIcon } from '@sanity/icons/SplitVertical'

/**
 * A page experiment. Assignment happens at the edge (proxy.ts) with a cookie;
 * each variant is an ordinary page document, so marketers build variants with
 * the tools they already have and start or stop a test without a deploy.
 *
 * Variant pages should set SEO → No index and a canonical back to the tested
 * pathname, otherwise search engines see two near-identical pages.
 */
export default defineType({
  name: 'experiment',
  title: 'Experiment',
  type: 'document',
  icon: SplitVerticalIcon,
  fields: [
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'key',
      title: 'Key',
      type: 'slug',
      description:
        'Cookie name and the PostHog property ($feature/<key>). Changing it after launch re-buckets everyone, so pick it once.',
      options: { source: 'title', maxLength: 40 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'pathname',
      title: 'Pathname',
      type: 'string',
      description: 'The URL being tested, e.g. / or /free-site-audit. Visitors never see the variant slug.',
      validation: (R) =>
        R.required().regex(/^\/[a-z0-9\-\/]*$/, { name: 'pathname' }).error('Start with / and use lowercase letters, numbers and hyphens.'),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'draft',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Running', value: 'running' },
          { title: 'Stopped', value: 'stopped' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      description: 'Running splits traffic within a minute. Stopped sends everyone to the original page.',
    }),
    defineField({
      name: 'variants',
      title: 'Variants',
      type: 'array',
      description: 'Variant "a" is normally the original page. Weights must add up to 100.',
      validation: (R) =>
        R.min(2).custom((variants) => {
          const list = (variants ?? []) as Array<{ weight?: number; key?: string }>
          const total = list.reduce((n, v) => n + (v.weight ?? 0), 0)
          if (total !== 100) return `Weights add up to ${total}; they need to add up to 100.`
          const keys = list.map((v) => v.key)
          if (new Set(keys).size !== keys.length) return 'Variant keys must be unique.'
          return true
        }),
      of: [
        defineField({
          name: 'variant',
          type: 'object',
          fields: [
            defineField({
              name: 'key', type: 'string', validation: (R) => R.required().regex(/^[a-z0-9]+$/, { name: 'key' }),
              description: 'Short: a, b, c.',
            }),
            defineField({ name: 'weight', type: 'number', initialValue: 50, validation: (R) => R.required().min(0).max(100) }),
            defineField({ name: 'page', type: 'reference', to: [{ type: 'page' }], validation: (R) => R.required() }),
          ],
          preview: {
            select: { key: 'key', weight: 'weight', page: 'page.title' },
            prepare: ({ key, weight, page }) => ({ title: `${key} · ${weight}%`, subtitle: page }),
          },
        }),
      ],
    }),
    defineField({
      name: 'winner',
      title: 'Winner',
      type: 'string',
      description: 'Record the winning variant key when you stop the test.',
    }),
  ],
  preview: {
    select: { title: 'title', status: 'status', pathname: 'pathname', key: 'key.current' },
    prepare: ({ title, status, pathname, key }) => ({
      title,
      subtitle: `${status ?? 'draft'} · ${pathname ?? ''} · ab_${key ?? ''}`,
    }),
  },
})
