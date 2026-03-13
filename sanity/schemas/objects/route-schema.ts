import { defineType, defineField } from 'sanity'
import { LinkIcon } from '@sanity/icons'

export default defineType({
  title: 'Route',
  name: 'route',
  icon: LinkIcon,
  type: 'object',
  options: { collapsible: true },
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'attributes', title: 'Attributes' },
  ],
  fields: [
    defineField({ title: 'Title', name: 'title', type: 'string', group: 'general' }),
    defineField({
      title: 'Link Type',
      name: 'linkType',
      type: 'string',
      group: 'general',
      options: {
        list: [
          { title: 'Page', value: 'page' },
          { title: 'Event', value: 'event' },
          { title: 'Path', value: 'path' },
          { title: 'Anchor', value: 'anchor' },
          { title: 'File Download', value: 'file' },
          { title: 'External URL', value: 'external' },
          { title: 'Email', value: 'email' },
          { title: 'Telephone', value: 'telephone' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'page',
    }),
    defineField({
      title: 'Page',
      name: 'pageRoute',
      type: 'reference',
      group: 'general',
      to: [{ type: 'page' }],
      hidden: ({ parent }) => parent?.linkType !== 'page',
    }),
    defineField({
      title: 'Event',
      name: 'eventRoute',
      type: 'reference',
      group: 'general',
      to: [{ type: 'event' }],
      hidden: ({ parent }) => parent?.linkType !== 'event',
    }),
    defineField({
      title: 'File',
      name: 'fileRoute',
      type: 'file',
      group: 'general',
      hidden: ({ parent }) => parent?.linkType !== 'file',
    }),
    defineField({
      title: 'Path',
      name: 'route',
      type: 'string',
      group: 'general',
      description: 'Example: about or about/#section',
      hidden: ({ parent }) => parent?.linkType !== 'path',
    }),
    defineField({
      title: 'Anchor',
      name: 'anchor',
      type: 'string',
      group: 'general',
      description: 'For same page only. Example: content',
      hidden: ({ parent }) => parent?.linkType !== 'anchor',
    }),
    defineField({
      title: 'External URL',
      name: 'link',
      type: 'url',
      group: 'general',
      hidden: ({ parent }) => parent?.linkType !== 'external',
    }),
    defineField({
      title: 'Email',
      name: 'email',
      type: 'email',
      group: 'general',
      hidden: ({ parent }) => parent?.linkType !== 'email',
    }),
    defineField({
      title: 'Telephone',
      name: 'telephone',
      type: 'string',
      group: 'general',
      hidden: ({ parent }) => parent?.linkType !== 'telephone',
    }),
    defineField({
      title: 'Open in new tab',
      name: 'blank',
      type: 'boolean',
      initialValue: false,
      group: 'general',
    }),
    defineField({
      title: 'Aria Label',
      name: 'ariaLabel',
      type: 'string',
      group: 'attributes',
    }),
    defineField({
      title: 'Title Attribute',
      name: 'titleAttr',
      type: 'string',
      group: 'attributes',
      description: 'Tooltip text on hover',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      linkType: 'linkType',
      pageRoute: 'pageRoute.slug.current',
      eventRoute: 'eventRoute.slug.current',
      route: 'route',
      anchor: 'anchor',
      link: 'link',
      email: 'email',
      telephone: 'telephone',
    },
    prepare({ title, linkType, pageRoute, eventRoute, route, anchor, link, email, telephone }) {
      let subtitle = 'Not set'
      if (linkType === 'page') subtitle = pageRoute ? `Page: /${pageRoute}` : 'Page (not set)'
      else if (linkType === 'event') subtitle = eventRoute ? `Event: /events/${eventRoute}` : 'Event (not set)'
      else if (linkType === 'path') subtitle = route ? `Path: /${route}` : 'Path (not set)'
      else if (linkType === 'anchor') subtitle = anchor ? `#${anchor}` : 'Anchor (not set)'
      else if (linkType === 'external') subtitle = link ? `External: ${link}` : 'External (not set)'
      else if (linkType === 'email') subtitle = email ? `Email: ${email}` : 'Email (not set)'
      else if (linkType === 'telephone') subtitle = telephone ? `Tel: ${telephone}` : 'Telephone (not set)'
      return { title: title || 'Untitled', subtitle }
    },
  },
})
