'use client'

import { useState } from 'react'
import AppearAnimation from '@/components/appear-animation'
import BannerBlock from '@/components/banner-block'
import ColumnBlock from '@/components/column-block'
import CoverBlock from '@/components/cover-block'
import CtaBlock from '@/components/cta-block'
import DividerBlock from '@/components/divider-block'
import EmbedBlock from '@/components/embed-block'
import EventsBlock from '@/components/events-block'
import FaqBlock from '@/components/faq-block'
import LeadForm from '@/components/form-block/lead-form'
import GalleryBlock from '@/components/gallery-block'
import HeroBlock from '@/components/hero-block'
import ImageBlock from '@/components/image-block'
import LogoBarBlock from '@/components/logo-bar-block'
import PostsBlock from '@/components/posts-block'
import QuoteBlock from '@/components/quote-block'
import SimpleText from '@/components/simple-text'
import SplitScrollBlock from '@/components/split-scroll-block'
import StatsBlock from '@/components/stats-block'
import TeamMemberBlock from '@/components/team-member-block'
import TextBlock from '@/components/text-block'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import { CtaLocationProvider } from '@/context'
import { resolveFormConfig } from '@/lib/form-config'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import { cn } from '@/lib/utils'
import {
  BG_GROUP,
  SectionChrome,
  SectionControls,
  type ControlGroup,
} from './section-controls'
import {
  fixtureCta,
  fixtureEmbedHtml,
  fixtureEvents,
  fixtureForm,
  fixturePosts,
  pt,
  ptBlocks,
} from './fixtures'

function useVariantState<T extends Record<string, string>>(defaults: T) {
  const [values, setValues] = useState(defaults)
  const onChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }
  return [values, onChange] as const
}

const LOGO_COLUMNS = [
  {
    _key: 'c1',
    icon: 'LuClock',
    content: ptBlocks([
      { text: 'Time', style: 'h3' },
      { text: 'Landing pages take too long to ship.' },
    ]),
    cta: { ...fixtureCta, route: { ...fixtureCta.route, title: 'Learn more' } },
  },
  {
    _key: 'c2',
    icon: 'LuCode',
    content: ptBlocks([
      { text: 'Process', style: 'h3' },
      { text: 'Simple updates still need engineering.' },
    ]),
    cta: { ...fixtureCta, route: { ...fixtureCta.route, title: 'Learn more' } },
  },
  {
    _key: 'c3',
    icon: 'LuLayers',
    content: ptBlocks([
      { text: 'Stack', style: 'h3' },
      { text: 'Performance and SEO debt piles up.' },
    ]),
    cta: { ...fixtureCta, route: { ...fixtureCta.route, title: 'Learn more' } },
  },
  {
    _key: 'c4',
    icon: 'LuClock',
    content: ptBlocks([
      { text: 'Support', style: 'h3' },
      { text: 'No dedicated partner for the web layer.' },
    ]),
    cta: { ...fixtureCta, route: { ...fixtureCta.route, title: 'Learn more' } },
  },
]

const PROJECT_COLUMNS = [
  {
    _key: 'p1',
    title: 'TerraTrue',
    content: ptBlocks([
      { text: 'TerraTrue', style: 'h3' },
      { text: 'Campaign site infrastructure for a fast-moving B2B team.' },
    ]),
    cta: { ...fixtureCta, route: { ...fixtureCta.route, title: 'View' } },
  },
  {
    _key: 'p2',
    title: 'Unified',
    content: ptBlocks([
      { text: 'Unified', style: 'h3' },
      { text: 'Modern marketing architecture delivered in under a month.' },
    ]),
    cta: { ...fixtureCta, route: { ...fixtureCta.route, title: 'View' } },
  },
  {
    _key: 'p3',
    title: 'Parcion',
    content: ptBlocks([
      { text: 'Parcion', style: 'h3' },
      { text: 'High-performance site supporting content growth.' },
    ]),
    cta: { ...fixtureCta, route: { ...fixtureCta.route, title: 'View' } },
  },
  {
    _key: 'p4',
    title: 'Northwind',
    content: ptBlocks([
      { text: 'Northwind', style: 'h3' },
      { text: 'Composable pages for ongoing campaign launches.' },
    ]),
    cta: { ...fixtureCta, route: { ...fixtureCta.route, title: 'View' } },
  },
]

export function CoverPlayground() {
  const [values, onChange] = useVariantState({
    backgroundType: 'image',
    height: 'half',
    backgroundColor: 'primary',
    contentPosition: 'center',
  })

  const groups: ControlGroup[] = [
    {
      key: 'backgroundType',
      label: 'Media',
      options: [
        { value: 'image', label: 'Image' },
        { value: 'color', label: 'Color' },
      ],
    },
    {
      key: 'height',
      label: 'Height',
      options: [
        { value: 'full', label: 'Full' },
        { value: 'threeQuarter', label: '¾' },
        { value: 'half', label: 'Half' },
        { value: 'auto', label: 'Auto' },
      ],
    },
    {
      key: 'contentPosition',
      label: 'Position',
      options: [
        { value: 'top-left', label: 'Top left' },
        { value: 'top-center', label: 'Top center' },
        { value: 'top-right', label: 'Top right' },
        { value: 'center-left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'center-right', label: 'Right' },
        { value: 'bottom-left', label: 'Bottom left' },
        { value: 'bottom-center', label: 'Bottom' },
        { value: 'bottom-right', label: 'Bottom right' },
      ],
    },
    ...(values.backgroundType === 'color' ? [BG_GROUP] : []),
  ]

  const note = `${values.backgroundType} · ${values.height} · ${values.contentPosition}`

  return (
    <SectionChrome id="cover" type="coverBlock" note={note}>
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="coverBlock">
        <CoverBlock
          componentIndex={0}
          backgroundType={values.backgroundType}
          height={values.height}
          backgroundColor={values.backgroundColor}
          contentPosition={values.contentPosition}
          showImagePlaceholder={values.backgroundType === 'image'}
          content={ptBlocks([
            { text: 'Cover block', style: 'h1' },
            { text: 'Full-bleed media with overlay content. Toggle media, height, and position.' },
          ])}
          cta={fixtureCta}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function HeroPlayground() {
  const [values, onChange] = useVariantState({
    backgroundColor: 'primary',
    layout: 'image-right',
  })

  const groups: ControlGroup[] = [
    BG_GROUP,
    {
      key: 'layout',
      label: 'Layout',
      options: [
        { value: 'image-right', label: 'Image right' },
        { value: 'image-left', label: 'Image left' },
      ],
    },
  ]

  return (
    <SectionChrome
      id="hero"
      type="heroBlock"
      note={`${values.layout} · ${values.backgroundColor}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="heroBlock">
        <HeroBlock
          componentIndex={1}
          layout={values.layout}
          backgroundColor={values.backgroundColor}
          showImagePlaceholder
          content={ptBlocks([
            { text: 'Hero section', style: 'h1' },
            {
              text: 'Split layout with optional media. Fixture uses a wireframe image slot.',
            },
          ])}
          cta={fixtureCta}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function TextPlayground() {
  const [values, onChange] = useVariantState({
    backgroundColor: 'secondary',
    contentAlignment: 'left',
  })

  const groups: ControlGroup[] = [
    BG_GROUP,
    {
      key: 'contentAlignment',
      label: 'Align',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
    },
  ]

  return (
    <SectionChrome
      id="text"
      type="textBlock"
      note={`${values.backgroundColor} · ${values.contentAlignment}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="textBlock">
        <TextBlock
          componentIndex={2}
          backgroundColor={values.backgroundColor as 'primary' | 'secondary' | 'texture'}
          contentAlignment={values.contentAlignment}
          content={ptBlocks([
            { text: 'Text block', style: 'h2' },
            {
              text: 'Long-form content uses the same .content typography hooks as Portable Text on the site.',
            },
            {
              text: 'Use this section for narrative copy, lists, and inline emphasis.',
            },
          ])}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function CardsPlayground() {
  const [values, onChange] = useVariantState({
    backgroundColor: 'primary',
    cardStyle: 'logo',
    columnsPerRow: '3',
  })

  const groups: ControlGroup[] = [
    BG_GROUP,
    {
      key: 'cardStyle',
      label: 'Style',
      options: [
        { value: 'logo', label: 'Logo' },
        { value: 'project', label: 'Project' },
      ],
    },
    {
      key: 'columnsPerRow',
      label: 'Columns',
      options: [
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
      ],
    },
  ]

  const columnsPerRow = Number(values.columnsPerRow) || 3
  const source = values.cardStyle === 'project' ? PROJECT_COLUMNS : LOGO_COLUMNS
  const columns = source.slice(0, columnsPerRow)

  return (
    <SectionChrome
      id="cards"
      type="columnBlock"
      note={`${values.cardStyle} · ${columnsPerRow} col · ${values.backgroundColor}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="columnBlock">
        <ColumnBlock
          componentIndex={3}
          backgroundColor={values.backgroundColor}
          cardStyle={values.cardStyle}
          columnsPerRow={columnsPerRow}
          showImagePlaceholder={values.cardStyle === 'project'}
          intro={pt(
            values.cardStyle === 'project' ? 'Selected work' : 'What slows teams down',
            'h2'
          )}
          columns={columns}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function FormPlayground() {
  const [values, onChange] = useVariantState({
    layout: 'stacked',
    backgroundColor: 'primary',
  })

  const groups: ControlGroup[] = [
    {
      key: 'layout',
      label: 'Layout',
      options: [
        { value: 'stacked', label: 'Stacked' },
        { value: 'split', label: 'Split' },
      ],
    },
    BG_GROUP,
  ]

  const config = resolveFormConfig(fixtureForm, null)
  const isSplit = values.layout === 'split'
  const bg = normalizeSectionBackground(values.backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)

  const content = ptBlocks([
    { text: 'Form block', style: 'h2' },
    {
      text: 'Uses a fixture form document. Toggle stacked vs split and background on either layout.',
    },
  ])

  return (
    <SectionChrome
      id="form"
      type="formBlock"
      note={`${values.layout} · ${values.backgroundColor}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="formBlock">
        {isSplit ? (
          <section
            className={cn(
              'form-block form-block--split flex w-full justify-center px-5 py-16 md:py-24',
              sectionClass
            )}
          >
            {showTexture ? <TextureSectionBackdrop /> : null}
            <AppearAnimation
              className={cn(
                'relative z-10 container flex w-full flex-col gap-10 md:flex-row md:items-start md:gap-12 lg:gap-16',
                innerLiftClass
              )}
            >
              <div className="w-full md:w-1/2">
                <div className="content">
                  <SimpleText content={content} />
                </div>
              </div>
              <div className="w-full md:w-1/2 md:sticky md:top-24 md:self-start">
                {config ? (
                  <div className="bg-background text-foreground shadow-lg">
                    <LeadForm config={config} />
                  </div>
                ) : null}
              </div>
            </AppearAnimation>
          </section>
        ) : (
          <section
            className={cn(
              'form-block form-block--stacked flex w-full justify-center px-5 py-16 lg:py-24',
              sectionClass
            )}
          >
            {showTexture ? <TextureSectionBackdrop /> : null}
            <AppearAnimation
              className={cn(
                'relative z-10 container mx-auto flex w-full max-w-2xl flex-col justify-center',
                innerLiftClass
              )}
              scale
            >
              <div className="content">
                <SimpleText content={content} />
              </div>
              {config ? (
                <div className="mt-8 bg-background text-foreground shadow-lg">
                  <LeadForm config={config} />
                </div>
              ) : null}
            </AppearAnimation>
          </section>
        )}
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function CtaPlayground() {
  const [values, onChange] = useVariantState({
    backgroundColor: 'secondary',
    alignment: 'text-center',
  })

  const groups: ControlGroup[] = [
    {
      key: 'backgroundColor',
      label: 'Background',
      options: [
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
      ],
    },
    {
      key: 'alignment',
      label: 'Align',
      options: [
        { value: 'text-left', label: 'Left' },
        { value: 'text-center', label: 'Center' },
        { value: 'text-right', label: 'Right' },
      ],
    },
  ]

  return (
    <SectionChrome
      id="cta"
      type="ctaBlock"
      note={`${values.backgroundColor} · ${values.alignment}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="ctaBlock">
        <CtaBlock
          componentIndex={5}
          backgroundColor={values.backgroundColor as 'primary' | 'secondary'}
          alignment={values.alignment}
          content={ptBlocks([
            { text: 'Ready to move faster?', style: 'h2' },
            { text: 'CTA block — toggle background and alignment.' },
          ])}
          cta={fixtureCta}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function FaqPlayground() {
  const [values, onChange] = useVariantState({ backgroundColor: 'primary' })

  return (
    <SectionChrome id="faq" type="faqBlock" note={values.backgroundColor}>
      <SectionControls groups={[BG_GROUP]} values={values} onChange={onChange} />
      <CtaLocationProvider value="faqBlock">
        <FaqBlock
          componentIndex={4}
          backgroundColor={values.backgroundColor}
          faqs={[
            {
              question: 'What is this design gallery for?',
              answer: pt(
                'A noindex reference for reviewing live section components with fixture props.'
              ),
            },
            {
              question: 'Does this hit Sanity?',
              answer: pt(
                'Most fixtures are local. Form still loads site form settings if configured; the form document itself is a fixture.'
              ),
            },
            {
              question: 'Where do UI primitives live?',
              answer: pt('See /design/components for Button, Card, Input, Accordion, and more.'),
            },
          ]}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function StatsPlayground() {
  const [values, onChange] = useVariantState({
    backgroundColor: 'primary',
    layout: 'image-left',
    variant: 'proof',
  })

  const isProof = values.variant === 'proof'

  const groups: ControlGroup[] = [
    BG_GROUP,
    {
      key: 'variant',
      label: 'Style',
      options: [
        { value: 'cards', label: 'Stat cards' },
        { value: 'proof', label: 'Proof strip' },
      ],
    },
    ...(isProof
      ? []
      : [
          {
            key: 'layout',
            label: 'Layout',
            options: [
              { value: 'image-left', label: 'Image left' },
              { value: 'image-right', label: 'Image right' },
            ],
          } satisfies ControlGroup,
        ]),
  ]

  return (
    <SectionChrome
      id="stats"
      type="statsBlock"
      note={`${values.variant}${isProof ? '' : ` · ${values.layout}`} · ${values.backgroundColor}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="statsBlock">
        <StatsBlock
          key={values.variant}
          componentIndex={8}
          backgroundColor={values.backgroundColor}
          layout={values.layout}
          variant={values.variant}
          showImagePlaceholder={!isProof}
          heading={pt(isProof ? "Here's what fast looks like." : 'Stats block', 'h2')}
          stats={
            isProof
              ? [
                  {
                    _key: 's1',
                    statValue: 'Minutes',
                    content: pt('Landing pages publish in minutes. No deploy, no ticket.'),
                  },
                  {
                    _key: 's2',
                    statValue: '60 sec',
                    content: pt(
                      'Every form submission lands in your CRM with follow-up sent inside 60 seconds.'
                    ),
                  },
                  {
                    _key: 's3',
                    statValue: '1st-party',
                    content: pt('Analytics that ad blockers cannot erase.'),
                  },
                  {
                    _key: 's4',
                    statValue: 'AI-ready',
                    content: pt(
                      'Content structured for AI search: readable by ChatGPT, Perplexity, and Google AI results.'
                    ),
                  },
                ]
              : [
                  {
                    _key: 's1',
                    statValue: '3×',
                    content: pt('Faster campaign launches with a composable web stack.'),
                  },
                  {
                    _key: 's2',
                    statValue: '60d',
                    content: pt(
                      'Typical window to ship a modern marketing site foundation.'
                    ),
                  },
                  {
                    _key: 's3',
                    statValue: '1',
                    content: pt('Partner instead of a full-time web engineering hire.'),
                  },
                ]
          }
          footnote={
            isProof
              ? pt(
                  'Email templates, journey steps, and new page sections count too. Scope conversations happen in the open, not in surprise invoices.',
                  'small',
                  'fn'
                )
              : undefined
          }
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function QuotePlayground() {
  const [values, onChange] = useVariantState({ backgroundColor: 'primary' })

  return (
    <SectionChrome id="quote" type="quoteBlock" note={values.backgroundColor}>
      <SectionControls groups={[BG_GROUP]} values={values} onChange={onChange} />
      <CtaLocationProvider value="quoteBlock">
        <QuoteBlock
          componentIndex={7}
          backgroundColor={values.backgroundColor}
          title="Alex Founder"
          quote={pt(
            'The website should never slow marketing down. That’s the principle we design around.'
          )}
          cta={fixtureCta}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function GalleryPlayground() {
  const [values, onChange] = useVariantState({
    backgroundColor: 'primary',
    imagesPerRow: '3',
  })

  const groups: ControlGroup[] = [
    BG_GROUP,
    {
      key: 'imagesPerRow',
      label: 'Per row',
      options: [
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
      ],
    },
  ]

  return (
    <SectionChrome
      id="gallery"
      type="galleryBlock"
      note={`${values.imagesPerRow}/row · ${values.backgroundColor}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="galleryBlock">
        <GalleryBlock
          componentIndex={5}
          backgroundColor={values.backgroundColor}
          imagesPerRow={Number(values.imagesPerRow) || 3}
          showImagePlaceholder
          placeholderCount={6}
          enableLightbox={false}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function LogoBarPlayground() {
  const [values, onChange] = useVariantState({ backgroundColor: 'primary' })

  return (
    <SectionChrome id="logo-bar" type="logoBarBlock" note={values.backgroundColor}>
      <SectionControls groups={[BG_GROUP]} values={values} onChange={onChange} />
      <CtaLocationProvider value="logoBarBlock">
        <LogoBarBlock
          componentIndex={4}
          backgroundColor={values.backgroundColor}
          showImagePlaceholder
          eyebrow="Trusted by marketing teams"
          logos={[
            { _key: 'l1', name: 'Acme' },
            { _key: 'l2', name: 'North' },
            { _key: 'l3', name: 'Pulse' },
            { _key: 'l4', name: 'Orbit' },
            { _key: 'l5', name: 'Lattice' },
            { _key: 'l6', name: 'Harbor' },
          ]}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function SplitScrollPlayground() {
  const [values, onChange] = useVariantState({ backgroundColor: 'primary' })

  return (
    <SectionChrome id="split-scroll" type="splitScrollBlock" note={values.backgroundColor}>
      <SectionControls groups={[BG_GROUP]} values={values} onChange={onChange} />
      <CtaLocationProvider value="splitScrollBlock">
        <SplitScrollBlock
          componentIndex={6}
          backgroundColor={values.backgroundColor as 'primary' | 'secondary' | 'texture'}
          showImagePlaceholder
          title={pt('Split scroll', 'h2')}
          items={[
            {
              _key: 'ss1',
              content: ptBlocks([
                { text: 'Discover', style: 'h3' },
                { text: 'Map the bottlenecks between campaign ideas and live pages.' },
              ]),
            },
            {
              _key: 'ss2',
              content: ptBlocks([
                { text: 'Build', style: 'h3' },
                { text: 'Ship a composable foundation without a full rewrite.' },
              ]),
            },
            {
              _key: 'ss3',
              content: ptBlocks([
                { text: 'Partner', style: 'h3' },
                { text: 'Keep velocity high as marketing needs evolve.' },
              ]),
            },
          ]}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function TeamPlayground() {
  const [values, onChange] = useVariantState({ backgroundColor: 'primary' })

  return (
    <SectionChrome id="team" type="teamMemberBlock" note={values.backgroundColor}>
      <SectionControls groups={[BG_GROUP]} values={values} onChange={onChange} />
      <CtaLocationProvider value="teamMemberBlock">
        <TeamMemberBlock
          componentIndex={10}
          backgroundColor={values.backgroundColor}
          showImagePlaceholder
          member={{
            title: 'Alex Founder',
            slug: 'alex-founder',
            primaryJobTitle: 'Founder',
            secondaryJobTitle: 'Technical partner',
            email: 'hello@ohmni.tech',
            socials: { linkedin: 'https://www.linkedin.com/' },
            content: pt(
              'Senior technical partnership for marketing teams that need to ship without hiring a full web org.'
            ),
          }}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function BannerPlayground() {
  const [values, onChange] = useVariantState({ cta: 'on' })

  const groups: ControlGroup[] = [
    {
      key: 'cta',
      label: 'CTA',
      options: [
        { value: 'on', label: 'On' },
        { value: 'off', label: 'Off' },
      ],
    },
  ]

  return (
    <SectionChrome id="banner" type="bannerBlock" note={`cta ${values.cta}`}>
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="bannerBlock">
        <BannerBlock
          componentIndex={0}
          content={ptBlocks([
            { text: 'Marketing Moves Fast.', style: 'h2' },
            { text: 'Your website should too — fixture banner copy for design review.' },
          ])}
          cta={values.cta === 'on' ? fixtureCta : { active: false, route: fixtureCta.route }}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function ImagePlayground() {
  const [values, onChange] = useVariantState({ maxWidth: 'max-w-2xl' })

  const groups: ControlGroup[] = [
    {
      key: 'maxWidth',
      label: 'Max width',
      options: [
        { value: 'max-w-md', label: 'Narrow' },
        { value: 'max-w-2xl', label: 'Medium' },
        { value: 'max-w-4xl', label: 'Wide' },
        { value: 'max-w-full', label: 'Full' },
      ],
    },
  ]

  return (
    <SectionChrome id="image" type="imageBlock" note={values.maxWidth}>
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="imageBlock">
        <ImageBlock
          componentIndex={2}
          showImagePlaceholder
          maxWidth={values.maxWidth}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function EmbedPlayground() {
  const [values, onChange] = useVariantState({
    backgroundColor: 'primary',
    maxWidth: 'max-w-2xl',
    title: 'on',
  })

  const groups: ControlGroup[] = [
    BG_GROUP,
    {
      key: 'maxWidth',
      label: 'Max width',
      options: [
        { value: 'max-w-md', label: 'Narrow' },
        { value: 'max-w-2xl', label: 'Medium' },
        { value: 'max-w-4xl', label: 'Wide' },
        { value: 'max-w-full', label: 'Full' },
      ],
    },
    {
      key: 'title',
      label: 'Title',
      options: [
        { value: 'on', label: 'On' },
        { value: 'off', label: 'Off' },
      ],
    },
  ]

  return (
    <SectionChrome
      id="embed"
      type="embedBlock"
      note={`${values.maxWidth} · ${values.backgroundColor}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="embedBlock">
        <EmbedBlock
          componentIndex={9}
          backgroundColor={values.backgroundColor}
          title={values.title === 'on' ? 'Embed block' : null}
          maxWidth={values.maxWidth}
          embedCode={fixtureEmbedHtml}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function PostsPlayground() {
  const [values, onChange] = useVariantState({
    backgroundColor: 'primary',
    count: '2',
  })

  const groups: ControlGroup[] = [
    BG_GROUP,
    {
      key: 'count',
      label: 'Show',
      options: [
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '6', label: '6' },
      ],
    },
  ]

  const count = Number(values.count) || 2

  return (
    <SectionChrome
      id="posts"
      type="postsBlock"
      note={`show ${count} · ${values.backgroundColor}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="postsBlock">
        <PostsBlock
          key={`posts-${count}-${values.backgroundColor}`}
          componentIndex={11}
          backgroundColor={values.backgroundColor}
          title="Posts"
          count={count}
          showImagePlaceholder
          initialPosts={fixturePosts}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function EventsPlayground() {
  const [values, onChange] = useVariantState({
    backgroundColor: 'primary',
    count: '2',
  })

  const groups: ControlGroup[] = [
    BG_GROUP,
    {
      key: 'count',
      label: 'Show',
      options: [
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '6', label: '6' },
      ],
    },
  ]

  const count = Number(values.count) || 2

  return (
    <SectionChrome
      id="events"
      type="eventsBlock"
      note={`show ${count} · ${values.backgroundColor}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="eventsBlock">
        <EventsBlock
          key={`events-${count}-${values.backgroundColor}`}
          componentIndex={12}
          backgroundColor={values.backgroundColor}
          title="Events"
          count={count}
          showImagePlaceholder
          initialEvents={fixtureEvents}
        />
      </CtaLocationProvider>
    </SectionChrome>
  )
}

export function DividerPlayground() {
  const [values, onChange] = useVariantState({
    style: 'rule',
    size: 'medium',
  })

  const groups: ControlGroup[] = [
    {
      key: 'style',
      label: 'Style',
      options: [
        { value: 'rule', label: 'Rule' },
        { value: 'gap', label: 'Gap' },
      ],
    },
    {
      key: 'size',
      label: 'Size',
      options: [
        { value: 'zero', label: 'Zero' },
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ],
    },
  ]

  return (
    <SectionChrome
      id="divider"
      type="dividerBlock"
      note={`${values.style} · ${values.size}`}
    >
      <SectionControls groups={groups} values={values} onChange={onChange} />
      <CtaLocationProvider value="dividerBlock">
        <div className="bg-muted/20">
          <DividerBlock size={values.size} style={values.style} />
        </div>
      </CtaLocationProvider>
    </SectionChrome>
  )
}
