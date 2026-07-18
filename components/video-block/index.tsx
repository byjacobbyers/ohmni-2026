import AppearAnimation from '@/components/appear-animation'
import VideoPlayer from '@/components/video-block/player'
import type { VideoBlockProps } from '@/types/components/video-block-type'

export default function VideoBlock({
  active = true,
  componentIndex = 0,
  anchor,
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
  if (!active) return null

  const hasMux = videoProvider === 'mux' && Boolean(muxUrl?.asset?.playbackId || muxUrlMobile?.asset?.playbackId)
  const hasVimeo = videoProvider === 'vimeo' && Boolean(vimeoUrl || vimeoUrlMobile)
  if (!hasMux && !hasVimeo) return null

  return (
    <section
      id={anchor || `video-block-${componentIndex}`}
      className="video-block w-full flex justify-center px-5 py-16 md:py-24"
    >
      <AppearAnimation className={`w-full ${maxWidth} mx-auto`}>
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
