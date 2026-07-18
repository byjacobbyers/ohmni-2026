'use client'

import MuxPlayer from '@mux/mux-player-react'
import { useIsMobile } from '@/lib/use-is-mobile'
import type { VideoBlockProps } from '@/types/components/video-block-type'

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

type VideoPlayerProps = Pick<
  VideoBlockProps,
  | 'videoProvider'
  | 'muxUrl'
  | 'muxUrlMobile'
  | 'vimeoUrl'
  | 'vimeoUrlMobile'
  | 'autoplay'
  | 'loop'
  | 'muted'
  | 'controls'
>

/** Client island: Mux/Vimeo + mobile asset swap. */
export default function VideoPlayer({
  videoProvider = 'mux',
  muxUrl,
  muxUrlMobile,
  vimeoUrl,
  vimeoUrlMobile,
  autoplay = false,
  loop = false,
  muted = false,
  controls = true,
}: VideoPlayerProps) {
  const isMobile = useIsMobile()

  const muxPlaybackId =
    videoProvider === 'mux'
      ? isMobile && muxUrlMobile?.asset?.playbackId
        ? muxUrlMobile.asset.playbackId
        : muxUrl?.asset?.playbackId
      : null

  const vimeoUrlValue =
    videoProvider === 'vimeo'
      ? isMobile && vimeoUrlMobile
        ? vimeoUrlMobile
        : vimeoUrl ?? null
      : null

  if (!muxPlaybackId && !vimeoUrlValue) return null

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-muted">
      {videoProvider === 'mux' && muxPlaybackId ? (
        <MuxPlayer
          playbackId={muxPlaybackId}
          streamType="on-demand"
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          className={`h-full w-full object-contain ${controls ? '' : '[&::part(controls)]:hidden'}`}
        />
      ) : videoProvider === 'vimeo' && vimeoUrlValue ? (
        (() => {
          const videoId = getVimeoId(vimeoUrlValue)
          if (!videoId) return null
          const params = new URLSearchParams({
            autoplay: autoplay ? '1' : '0',
            loop: loop ? '1' : '0',
            muted: muted ? '1' : '0',
            controls: controls ? '1' : '0',
          })
          return (
            <iframe
              src={`https://player.vimeo.com/video/${videoId}?${params}`}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Vimeo video"
            />
          )
        })()
      ) : null}
    </div>
  )
}
