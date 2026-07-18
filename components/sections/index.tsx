import BannerBlock from '@/components/banner-block'
import HeroBlock from '@/components/hero-block'
import CoverBlock from '@/components/cover-block'
import CoverVideo from '@/components/cover-video'
import CtaBlock from '@/components/cta-block'
import TextBlock from '@/components/text-block'
import ImageBlock from '@/components/image-block'
import FaqBlock from '@/components/faq-block'
import EmbedBlock from '@/components/embed-block'
import FormBlock from '@/components/form-block'
import SplitFormBlock from '@/components/split-form-block'
import ColumnBlock from '@/components/column-block'
import ProjectColumnsBlock from '@/components/project-columns-block'
import PostsBlockServer from '@/components/posts-block/server'
import EventsBlockServer from '@/components/events-block/server'
import GalleryBlock from '@/components/gallery-block'
import VideoBlock from '@/components/video-block'
import SpacerBlock from '@/components/spacer-block'
import DividerBlock from '@/components/divider-block'
import SplitScrollBlock from '@/components/split-scroll-block'
import ProblemBlock from '@/components/problem-block'
import { CtaLocationProvider } from '@/context'

// Server Component so blocks like PostsBlockServer can fetch for SEO.
const blockMap: Record<string, React.ComponentType<Record<string, unknown>>> = {
  bannerBlock: BannerBlock as React.ComponentType<Record<string, unknown>>,
  heroBlock: HeroBlock as React.ComponentType<Record<string, unknown>>,
  coverBlock: CoverBlock as React.ComponentType<Record<string, unknown>>,
  coverVideo: CoverVideo as React.ComponentType<Record<string, unknown>>,
  ctaBlock: CtaBlock as React.ComponentType<Record<string, unknown>>,
  textBlock: TextBlock as React.ComponentType<Record<string, unknown>>,
  imageBlock: ImageBlock as React.ComponentType<Record<string, unknown>>,
  faqBlock: FaqBlock as React.ComponentType<Record<string, unknown>>,
  splitScrollBlock: SplitScrollBlock as React.ComponentType<Record<string, unknown>>,
  problemBlock: ProblemBlock as React.ComponentType<Record<string, unknown>>,
  embedBlock: EmbedBlock as React.ComponentType<Record<string, unknown>>,
  formBlock: FormBlock as React.ComponentType<Record<string, unknown>>,
  splitFormBlock: SplitFormBlock as React.ComponentType<Record<string, unknown>>,
  columnBlock: ColumnBlock as React.ComponentType<Record<string, unknown>>,
  projectColumnsBlock: ProjectColumnsBlock as React.ComponentType<Record<string, unknown>>,
  postsBlock: PostsBlockServer as React.ComponentType<Record<string, unknown>>,
  eventsBlock: EventsBlockServer as React.ComponentType<Record<string, unknown>>,
  galleryBlock: GalleryBlock as React.ComponentType<Record<string, unknown>>,
  videoBlock: VideoBlock as React.ComponentType<Record<string, unknown>>,
  spacerBlock: SpacerBlock as React.ComponentType<Record<string, unknown>>,
  dividerBlock: DividerBlock as React.ComponentType<Record<string, unknown>>,
}

export default function Sections({
  body,
}: {
  body?: Array<{ _type?: string; _key?: string } & Record<string, unknown>>
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
            <Component componentIndex={i} {...block} />
          </CtaLocationProvider>
        )
      })}
    </>
  )
}
