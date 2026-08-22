import {
  BannerPlayground,
  CardsPlayground,
  ComparisonPlayground,
  PanelsPlayground,
  CoverPlayground,
  CtaPlayground,
  DividerPlayground,
  EmbedPlayground,
  EventsPlayground,
  FaqPlayground,
  FormPlayground,
  GalleryPlayground,
  HeroPlayground,
  ImagePlayground,
  LogoBarPlayground,
  PostsPlayground,
  QuotePlayground,
  SplitScrollPlayground,
  StatsPlayground,
  TeamPlayground,
  TextPlayground,
} from './playgrounds'

const NAV = [
  { href: '#cover', label: 'Cover' },
  { href: '#banner', label: 'Banner' },
  { href: '#hero', label: 'Hero' },
  { href: '#text', label: 'Text' },
  { href: '#image', label: 'Image' },
  { href: '#cards', label: 'Cards' },
  { href: '#logo-bar', label: 'Logo bar' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#split-scroll', label: 'Split scroll' },
  { href: '#faq', label: 'FAQ' },
  { href: '#cta', label: 'CTA' },
  { href: '#form', label: 'Form' },
  { href: '#embed', label: 'Embed' },
  { href: '#quote', label: 'Quote' },
  { href: '#team', label: 'Team' },
  { href: '#comparison', label: 'Comparison' },
  { href: '#panels', label: 'Panels' },
  { href: '#stats', label: 'Stats' },
  { href: '#posts', label: 'Posts' },
  { href: '#events', label: 'Events' },
  { href: '#divider', label: 'Divider' },
] as const

export default function DesignSectionsPage() {
  return (
    <div className="pb-20">
      <header className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-2 text-h2 font-bold">Sections</h1>
        <p className="mb-6 max-w-2xl text-body text-muted-foreground">
          Live page-builder blocks with fixture props. Use the control strips to toggle high-value
          variants (background, layout, height, card style, and more). Media slots use wireframe
          placeholders.
        </p>
        <nav aria-label="Section anchors" className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-muted-foreground no-underline hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <CoverPlayground />
      <BannerPlayground />
      <HeroPlayground />
      <TextPlayground />
      <ImagePlayground />
      <CardsPlayground />
      <LogoBarPlayground />
      <GalleryPlayground />
      <SplitScrollPlayground />
      <FaqPlayground />
      <CtaPlayground />
      <FormPlayground />
      <EmbedPlayground />
      <QuotePlayground />
      <TeamPlayground />
      <ComparisonPlayground />
      <PanelsPlayground />
      <StatsPlayground />
      <PostsPlayground />
      <EventsPlayground />
      <DividerPlayground />
    </div>
  )
}
