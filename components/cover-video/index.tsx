'use client'

import type { CSSProperties } from 'react'
import MuxPlayer from '@mux/mux-player-react'
import { useIsMobile } from '@/lib/use-is-mobile'
import SimpleText from '@/components/simple-text'
import CtaRouteButton from '@/components/cta-route-button'
import { isActiveCta } from '@/lib/cta'
import {
  coverHeightClass,
  coverOverlayButtonVariant,
  coverOverlayCssColor,
  coverOverlayTextClass,
  coverPositionClass,
} from '@/lib/cover-layout'
import type { CoverVideoProps } from '@/types/components/cover-video-type'

function aspectRatioToCss(ratio?: string | null): string | undefined {
  if (!ratio || typeof ratio !== 'string') return undefined
  const parts = ratio.split(':').map((s) => parseFloat(s.trim()))
  if (
    parts.length !== 2 ||
    !Number.isFinite(parts[0]) ||
    !Number.isFinite(parts[1]) ||
    parts[0] <= 0 ||
    parts[1] <= 0
  ) {
    return undefined
  }
  return `${parts[0]} / ${parts[1]}`
}

const DEFAULT_AUTO_ASPECT = '16 / 9'

export default function CoverVideo({
  active = true,
  componentIndex = 0,
  anchor,
  videoProvider = 'mux',
  muxUrl,
  muxUrlMobile,
  vimeoUrl,
  vimeoUrlMobile,
  height = 'full',
  overlayColor = 'none',
  overlayOpacity = 50,
  contentPosition = 'center',
  contentHalfWidth = false,
  content,
  cta,
  autoplay = true,
  loop = true,
  muted = true,
  controls = false,
}: CoverVideoProps) {
  const isMobile = useIsMobile()

  if (active === false) return null

  const isAutoHeight = height === 'auto'
  const heightClass = coverHeightClass(height)

  const overlayColorValue = coverOverlayCssColor(overlayColor)
  const contentTextClass = coverOverlayTextClass(overlayColor)
  const buttonVariant = coverOverlayButtonVariant(overlayColor)
  const positionClass = coverPositionClass(contentPosition)

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

  let sectionAspectStyle: CSSProperties | undefined
  if (isAutoHeight) {
    if (videoProvider === 'mux' && muxPlaybackId) {
      const asset =
        isMobile && muxUrlMobile?.asset?.playbackId ? muxUrlMobile.asset : muxUrl?.asset
      sectionAspectStyle = {
        aspectRatio: aspectRatioToCss(asset?.data?.aspect_ratio) ?? DEFAULT_AUTO_ASPECT,
      }
    } else {
      sectionAspectStyle = { aspectRatio: DEFAULT_AUTO_ASPECT }
    }
  }

  const getVimeoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/)
    return match ? match[1] : null
  }

  return (
    <section
      id={anchor || `cover-video-${componentIndex}`}
      className={`cover-video w-full relative px-5 py-24 ${heightClass} flex ${positionClass} overflow-hidden`}
      style={sectionAspectStyle}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        {videoProvider === 'mux' && muxPlaybackId ? (
          <MuxPlayer
            playbackId={muxPlaybackId}
            streamType="on-demand"
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            className={`h-full w-full object-cover ${controls ? '' : '[&::part(controls)]:hidden'}`}
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
              background: '1',
            })
            return (
              <iframe
                src={`https://player.vimeo.com/video/${videoId}?${params}`}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '100vw',
                  height: '100vh',
                  transform: 'translate(-50%, -50%)',
                }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Vimeo video background"
              />
            )
          })()
        ) : null}
      </div>

      {overlayColor && overlayColor !== 'none' && overlayColorValue && (
        <div
          className="absolute inset-0 z-10"
          style={{
            backgroundColor: overlayColorValue,
            opacity: (overlayOpacity ?? 50) / 100,
          }}
        />
      )}

      <div className="relative z-20 w-full container mx-auto">
        <div className={`transition-all duration-300 ${contentHalfWidth ? 'md:max-w-[50%]' : ''}`}>
          {content && Array.isArray(content) && content.length > 0 ? (
            <div className={`content ${contentTextClass}`}>
              <SimpleText content={content} />
            </div>
          ) : null}
          {isActiveCta(cta) ? (
            <div className="mt-6">
              <CtaRouteButton route={cta.route} variant={buttonVariant} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
