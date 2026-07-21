import type { PortableTextBlock } from 'next-sanity'
import type { BaseRouteType } from '@/types/objects/route-type'
import type { SanityFormDocument } from '@/types/components/form-config-type'

/** Minimal portable text block for design fixtures. */
export function pt(
  text: string,
  style: PortableTextBlock['style'] = 'normal',
  key = 'a'
): PortableTextBlock[] {
  return [
    {
      _type: 'block',
      _key: key,
      style,
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `${key}-span`,
          text,
          marks: [],
        },
      ],
    } as PortableTextBlock,
  ]
}

export function ptBlocks(
  parts: Array<{ text: string; style?: PortableTextBlock['style'] }>
): PortableTextBlock[] {
  return parts.flatMap((part, i) => pt(part.text, part.style ?? 'normal', `b${i}`))
}

export const fixtureCta = {
  active: true,
  route: {
    _type: 'route',
    title: 'Book a call',
    linkType: 'external',
    link: 'https://calendly.com/ohmni/lets-talk',
    blank: true,
  } satisfies BaseRouteType,
}

export const fixtureForm: SanityFormDocument = {
  _id: 'design-fixture-form',
  title: 'Design fixture form',
  slug: 'design-fixture',
  active: true,
  submitLabel: 'Send message',
  showOptIn: 'hide',
  fields: [
    {
      _key: 'company',
      fieldType: 'input',
      label: 'Company',
      name: 'company',
      placeholder: 'Acme Inc.',
      required: false,
      inputType: 'text',
    },
    {
      _key: 'message',
      fieldType: 'textarea',
      label: 'Message',
      name: 'message',
      placeholder: 'Tell us a bit about the project…',
      required: true,
    },
  ],
}

export const fixtureEmbedHtml = `<iframe title="Embed fixture" srcdoc="<body style='margin:0;display:flex;align-items:center;justify-content:center;min-height:280px;font-family:ui-monospace,monospace;background:#f4f4f5;color:#737373;letter-spacing:0.15em'>EMBED SLOT</body>" style="width:100%;min-height:300px;border:0"></iframe>`

export const fixturePosts = [
  {
    _id: 'post-1',
    title: 'Why marketing sites stall',
    slug: 'why-marketing-sites-stall',
    publishedAt: '2026-03-12',
    author: { title: 'Ohmni' },
    category: 'Insights',
    excerpt: 'Common bottlenecks between campaign ideas and live pages.',
  },
  {
    _id: 'post-2',
    title: 'Composable web for CMOs',
    slug: 'composable-web-for-cmos',
    publishedAt: '2026-04-02',
    author: { title: 'Ohmni' },
    category: 'Playbook',
    excerpt: 'How Next.js + Sanity keep experiments shipping without a rebuild.',
  },
  {
    _id: 'post-3',
    title: 'A 60-day launch window',
    slug: '60-day-launch-window',
    publishedAt: '2026-05-18',
    author: { title: 'Ohmni' },
    category: 'Case notes',
    excerpt: 'What a focused foundation engagement usually covers.',
  },
  {
    _id: 'post-4',
    title: 'Performance as a marketing KPI',
    slug: 'performance-as-a-marketing-kpi',
    publishedAt: '2026-06-01',
    author: { title: 'Ohmni' },
    category: 'Insights',
    excerpt: 'Why Core Web Vitals belong in the same room as campaign metrics.',
  },
  {
    _id: 'post-5',
    title: 'CMS choices that age well',
    slug: 'cms-choices-that-age-well',
    publishedAt: '2026-06-20',
    author: { title: 'Ohmni' },
    category: 'Playbook',
    excerpt: 'Picking a content model that won’t fight next quarter’s landing pages.',
  },
  {
    _id: 'post-6',
    title: 'When to rebuild vs refactor',
    slug: 'when-to-rebuild-vs-refactor',
    publishedAt: '2026-07-08',
    author: { title: 'Ohmni' },
    category: 'Case notes',
    excerpt: 'A practical rubric for marketing teams evaluating the web stack.',
  },
]

export const fixtureEvents = [
  {
    _id: 'event-1',
    title: 'Office hours: site velocity',
    slug: 'office-hours-site-velocity',
    startDate: '2026-08-12',
    timeString: '10:00 AM PT',
    category: 'Virtual',
    location: 'Zoom',
  },
  {
    _id: 'event-2',
    title: 'Workshop: landing page systems',
    slug: 'workshop-landing-page-systems',
    startDate: '2026-09-04',
    endDate: '2026-09-04',
    timeString: '1:00 PM PT',
    category: 'Workshop',
    location: 'Online',
  },
  {
    _id: 'event-3',
    title: 'AMA: analytics & consent',
    slug: 'ama-analytics-consent',
    startDate: '2026-09-18',
    timeString: '11:00 AM PT',
    category: 'Virtual',
    location: 'Zoom',
  },
  {
    _id: 'event-4',
    title: 'Workshop: CMS content models',
    slug: 'workshop-cms-content-models',
    startDate: '2026-10-02',
    timeString: '1:00 PM PT',
    category: 'Workshop',
    location: 'Online',
  },
  {
    _id: 'event-5',
    title: 'Office hours: performance',
    slug: 'office-hours-performance',
    startDate: '2026-10-16',
    timeString: '10:00 AM PT',
    category: 'Virtual',
    location: 'Zoom',
    soldOut: true,
  },
  {
    _id: 'event-6',
    title: 'Roundtable: agency partnerships',
    slug: 'roundtable-agency-partnerships',
    startDate: '2026-11-06',
    timeString: '2:00 PM PT',
    category: 'Series',
    location: 'Online',
  },
]
