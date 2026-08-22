import BannerBlock from '@/components/banner-block'
import HeroBlock from '@/components/hero-block'
import CoverBlock from '@/components/cover-block'
import CtaBlock from '@/components/cta-block'
import TextBlock from '@/components/text-block'
import ImageBlock from '@/components/image-block'
import FaqBlock from '@/components/faq-block'
import EmbedBlock from '@/components/embed-block'
import FormBlock from '@/components/form-block'
import ColumnBlock from '@/components/column-block'
import ComparisonBlock from '@/components/comparison-block'
import PanelsBlock from '@/components/panels-block'
import PostsBlockServer from '@/components/posts-block/server'
import EventsBlockServer from '@/components/events-block/server'
import GalleryBlock from '@/components/gallery-block'
import DividerBlock from '@/components/divider-block'
import SplitScrollBlock from '@/components/split-scroll-block'
import TeamMemberBlock from '@/components/team-member-block'
import LogoBarBlock from '@/components/logo-bar-block'
import QuoteBlock from '@/components/quote-block'
import StatsBlock from '@/components/stats-block'
import { CtaLocationProvider } from '@/context'
import type { Locale } from '@/lib/i18n'

// Server Component so blocks like PostsBlockServer can fetch for SEO.
const blockMap: Record<string, React.ComponentType<Record<string, unknown>>> = {
  bannerBlock: BannerBlock as React.ComponentType<Record<string, unknown>>,
  heroBlock: HeroBlock as React.ComponentType<Record<string, unknown>>,
  coverBlock: CoverBlock as React.ComponentType<Record<string, unknown>>,
  ctaBlock: CtaBlock as React.ComponentType<Record<string, unknown>>,
  textBlock: TextBlock as React.ComponentType<Record<string, unknown>>,
  imageBlock: ImageBlock as React.ComponentType<Record<string, unknown>>,
  faqBlock: FaqBlock as React.ComponentType<Record<string, unknown>>,
  splitScrollBlock: SplitScrollBlock as React.ComponentType<Record<string, unknown>>,
  embedBlock: EmbedBlock as React.ComponentType<Record<string, unknown>>,
  formBlock: FormBlock as React.ComponentType<Record<string, unknown>>,
  columnBlock: ColumnBlock as React.ComponentType<Record<string, unknown>>,
  comparisonBlock: ComparisonBlock as React.ComponentType<Record<string, unknown>>,
  panelsBlock: PanelsBlock as React.ComponentType<Record<string, unknown>>,
  postsBlock: PostsBlockServer as React.ComponentType<Record<string, unknown>>,
  eventsBlock: EventsBlockServer as React.ComponentType<Record<string, unknown>>,
  teamMemberBlock: TeamMemberBlock as React.ComponentType<Record<string, unknown>>,
  logoBarBlock: LogoBarBlock as React.ComponentType<Record<string, unknown>>,
  quoteBlock: QuoteBlock as React.ComponentType<Record<string, unknown>>,
  statsBlock: StatsBlock as React.ComponentType<Record<string, unknown>>,
  galleryBlock: GalleryBlock as React.ComponentType<Record<string, unknown>>,
  dividerBlock: DividerBlock as React.ComponentType<Record<string, unknown>>,
}

export default function Sections({
  body,
  lang = 'en',
}: {
  body?: Array<{ _type?: string; _key?: string } & Record<string, unknown>>
  /** Page language, for the few blocks with UI strings or their own fetches. */
  lang?: Locale
}) {
  if (!body?.length) return null

  return (
    <>
      {body.map((block, i) => {
        const key = block._key || `block-${i}`
        const Component = block._type ? blockMap[block._type] : null
        if (!Component) return null
        const location = block._type || 'section'
        return (
          <CtaLocationProvider key={key} value={location}>
            <Component componentIndex={i} lang={lang} {...block} />
          </CtaLocationProvider>
        )
      })}
    </>
  )
}
