'use client'

import { useEffect } from 'react'
import SimpleText from '@/components/simple-text'
import { Button } from '@/components/ui/button'
import Route from '@/components/route'
import { urlFor } from '@/sanity/lib/image'

type CoverBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  backgroundType?: 'image' | 'color'
  image?: { asset?: { url?: string }; alt?: string; crop?: unknown; hotspot?: { x?: number; y?: number } }
  imageMobile?: { asset?: { url?: string }; hotspot?: { x?: number; y?: number } } | null
  backgroundColor?: 'black' | 'white' | 'primary'
  height?: 'auto' | 'full' | 'half'
  overlayColor?: 'none' | 'black' | 'white' | 'primary'
  overlayOpacity?: number
  contentPosition?: string
  contentHalfWidth?: boolean
  content?: unknown
  cta?: { active?: boolean; route?: unknown } | null
}

export default function CoverBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundType = 'image',
  image,
  imageMobile,
  backgroundColor = 'black',
  height = 'half',
  overlayColor = 'none',
  overlayOpacity = 50,
  contentPosition = 'center',
  contentHalfWidth = false,
  content,
  cta,
}: CoverBlockProps) {
  if (!active) return null

  const heightClass =
    height === 'full' ? 'min-h-screen' : height === 'half' ? 'min-h-[50vh]' : 'min-h-[500px]'

  const bgClass =
    backgroundColor === 'black'
      ? 'bg-foreground text-background'
      : backgroundColor === 'primary'
        ? 'bg-primary text-primary-foreground'
        : 'bg-background text-foreground'

  const overlayColorValue =
    overlayColor === 'black'
      ? 'var(--foreground)'
      : overlayColor === 'primary'
        ? 'var(--primary)'
        : overlayColor === 'white'
          ? 'var(--background)'
          : undefined

  const effectiveColor =
    backgroundType === 'image' ? overlayColor : backgroundColor
  const contentTextClass =
    effectiveColor === 'black'
      ? 'text-background'
      : effectiveColor === 'primary'
        ? 'text-primary-foreground'
        : 'text-foreground'
  const buttonVariant = effectiveColor === 'primary' ? 'secondary' : 'default'

  const positionClasses: Record<string, string> = {
    'top-left': 'items-start justify-start text-left',
    'top-center': 'items-start justify-center text-center',
    'top-right': 'items-start justify-end text-right',
    'center-left': 'items-center justify-start text-left',
    center: 'items-center justify-center text-center',
    'center-right': 'items-center justify-end text-right',
    'bottom-left': 'items-end justify-start text-left',
    'bottom-center': 'items-end justify-center text-center',
    'bottom-right': 'items-end justify-end text-right',
  }
  const positionClass = positionClasses[contentPosition] || 'items-center justify-center text-center'

  const getBackgroundImageUrl = (
    img: CoverBlockProps['image'],
    mobile = false
  ): string | undefined => {
    if (!img?.asset?.url) return undefined
    const w = mobile ? 768 : 1920
    const h = mobile ? 432 : 1080
    return urlFor(img).width(w).height(h).quality(82).auto('format').fit('scale').url()
  }

  const getBackgroundPosition = (img: CoverBlockProps['image'] | CoverBlockProps['imageMobile']) => {
    if (!img?.hotspot || img.hotspot.x == null || img.hotspot.y == null) return 'center'
    const x = img.hotspot.x * 100
    const y = img.hotspot.y * 100
    return `${x}% ${y}%`
  }

  const backgroundImageUrl =
    backgroundType === 'image' ? getBackgroundImageUrl(image, false) : undefined

  // #region agent log
  fetch('http://127.0.0.1:7630/ingest/b9616c32-2ae3-4cbd-ae57-3dce0e61bed2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '14be99' },
    body: JSON.stringify({
      sessionId: '14be99',
      location: 'cover-block/index.tsx:urls',
      message: 'Derived image URLs and overlay render decision',
      data: {
        backgroundImageUrl: backgroundImageUrl ? 'SET' : 'MISSING',
        overlayColorValue,
        willRenderOverlay:
          backgroundType === 'image' &&
          !!overlayColor &&
          overlayColor !== 'none' &&
          !!overlayColorValue,
      },
      timestamp: Date.now(),
      hypothesisId: 'H2',
    }),
  }).catch(() => {})
  // #endregion
  const mobileBackgroundImageUrl =
    backgroundType === 'image'
      ? getBackgroundImageUrl(imageMobile ?? image ?? undefined, true)
      : undefined
  const backgroundPosition =
    backgroundType === 'image' ? getBackgroundPosition(image) : 'center'
  const mobileBackgroundPosition =
    backgroundType === 'image' ? getBackgroundPosition(imageMobile ?? image) : 'center'

  const isFirstBlock = componentIndex === 0

  useEffect(() => {
    if (backgroundType !== 'image' || !isFirstBlock || !backgroundImageUrl) return
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = backgroundImageUrl
    document.head.appendChild(link)
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link)
    }
  }, [backgroundType, isFirstBlock, backgroundImageUrl])

  return (
    <section
      id={anchor || `cover-block-${componentIndex}`}
      className={`cover-block w-full relative px-5 py-24 ${heightClass} flex ${positionClass} ${backgroundType === 'color' ? bgClass : ''}`}
      style={{
        backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition,
        backgroundRepeat: 'no-repeat',
      }}
    >
      {backgroundType === 'image' && mobileBackgroundImageUrl && (
        <div
          className="md:hidden absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${mobileBackgroundImageUrl})`,
            backgroundPosition: mobileBackgroundPosition,
          }}
        />
      )}

      {backgroundType === 'image' && overlayColor && overlayColor !== 'none' && overlayColorValue && (
        <div
          className="absolute inset-0 z-10"
          style={{
            backgroundColor: overlayColorValue,
            opacity: (overlayOpacity ?? 50) / 100,
          }}
        />
      )}

      <div className="relative z-20 w-full container mx-auto">
        <div
          className={`transition-all duration-300 ${contentHalfWidth ? 'md:max-w-[50%]' : ''}`}
        >
          {content && Array.isArray(content) && content.length > 0 ? (
            <div className={`rich-text ${contentTextClass}`}>
              <SimpleText content={content} />
            </div>
          ) : null}
          {cta?.active && cta?.route ? (
            <div className="mt-6">
              <Button asChild variant={buttonVariant}>
                <Route data={cta.route as Parameters<typeof Route>[0]['data']}>
                  {(cta.route as { title?: string }).title || 'Learn More'}
                </Route>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
