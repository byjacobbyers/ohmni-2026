import AppearAnimation from '@/components/appear-animation'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import VideoPlayer from '@/components/video-block/player'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import { cn } from '@/lib/utils'
import type { VideoBlockProps } from '@/types/components/video-block-type'

export default function VideoBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  videoProvider = 'mux',
  muxUrl,
  muxUrlMobile,
  vimeoUrl,
  vimeoUrlMobile,
  maxWidth = 'max-w-2xl',
  autoplay = false,
  loop = false,
  muted = false,
  controls = true,
}: VideoBlockProps) {
  if (active === false) return null

  const hasMux =
    videoProvider === 'mux' &&
    Boolean(muxUrl?.asset?.playbackId || muxUrlMobile?.asset?.playbackId)
  const hasVimeo = videoProvider === 'vimeo' && Boolean(vimeoUrl || vimeoUrlMobile)
  if (!hasMux && !hasVimeo) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)

  return (
    <section
      id={anchor || `video-block-${componentIndex}`}
      className={cn(
        'video-block relative w-full flex justify-center px-5 py-16 md:py-24',
        sectionClass
      )}
    >
      {showTexture ? <TextureSectionBackdrop /> : null}
      <AppearAnimation
        className={cn('relative z-10 w-full mx-auto', maxWidth, innerLiftClass)}
      >
        <VideoPlayer
          videoProvider={videoProvider}
          muxUrl={muxUrl}
          muxUrlMobile={muxUrlMobile}
          vimeoUrl={vimeoUrl}
          vimeoUrlMobile={vimeoUrlMobile}
          autoplay={autoplay}
          loop={loop}
          muted={muted}
          controls={controls}
        />
      </AppearAnimation>
    </section>
  )
}
