'use client'

import SanityImage from '@/components/sanity-image'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import type { GalleryBlockProps } from '@/types/components/gallery-block-type'

export default function GalleryBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  images,
  imagesPerRow = 3,
  enableLightbox = true,
  showImagePlaceholder = false,
  placeholderCount = 6,
}: GalleryBlockProps) {
  const [lightboxImage, setLightboxImage] = useState<number | null>(null)

  if (active === false) return null

  const imagesPerRowValue = imagesPerRow || 3
  const gridCols =
    imagesPerRowValue === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : imagesPerRowValue === 3
        ? 'grid-cols-1 md:grid-cols-3'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'

  const usePlaceholders = showImagePlaceholder && (!images || images.length === 0)
  if ((!images || images.length === 0) && !usePlaceholders) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)
  const placeholderSlots = Array.from({ length: Math.max(1, placeholderCount) }, (_, i) => i)
  const imageList = images ?? []

  return (
    <>
      <section
        id={anchor || `gallery-block-${componentIndex}`}
        className={cn(
          'gallery-block w-full py-20 flex justify-center px-5',
          sectionClass
        )}
      >
        {showTexture ? <TextureSectionBackdrop /> : null}
        <div className={cn('container', innerLiftClass)}>
          <div className="flex flex-wrap -mx-[15px]">
            <div className="flex-[0_0_100%] max-w-full px-[15px]">
              <div className={`grid ${gridCols} gap-4`}>
                {usePlaceholders
                  ? placeholderSlots.map((i) => (
                      <ImagePlaceholder
                        key={`ph-${i}`}
                        aspect="square"
                        label="IMG"
                        caption={`${i + 1}`}
                        className="rounded-none"
                      />
                    ))
                  : imageList.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden bg-muted"
                  >
                    {enableLightbox !== false ? (
                      <button
                        onClick={() => setLightboxImage(index)}
                        className="w-full h-full hover:opacity-90 transition-opacity"
                      >
                        <SanityImage
                          image={image}
                          width={image?.asset?.metadata?.dimensions?.width || 400}
                          height={image?.asset?.metadata?.dimensions?.height || 400}
                          fill={false}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ) : (
                      <SanityImage
                        image={image}
                        width={image?.asset?.metadata?.dimensions?.width || 400}
                        height={image?.asset?.metadata?.dimensions?.height || 400}
                        fill={false}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage !== null && enableLightbox !== false && !usePlaceholders && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:opacity-70"
            onClick={() => setLightboxImage(null)}
            aria-label="Close lightbox"
          >
            ×
          </button>
          {lightboxImage > 0 && (
            <button
              className="absolute left-4 text-white text-2xl hover:opacity-70"
              onClick={(e) => {
                e.stopPropagation()
                setLightboxImage(lightboxImage - 1)
              }}
              aria-label="Previous image"
            >
              ←
            </button>
          )}
          {lightboxImage < imageList.length - 1 && (
            <button
              className="absolute right-4 text-white text-2xl hover:opacity-70"
              onClick={(e) => {
                e.stopPropagation()
                setLightboxImage(lightboxImage + 1)
              }}
              aria-label="Next image"
            >
              →
            </button>
          )}
          <div className="max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
            {imageList[lightboxImage] && (
              <SanityImage
                image={imageList[lightboxImage]}
                width={imageList[lightboxImage]?.asset?.metadata?.dimensions?.width || 1200}
                height={imageList[lightboxImage]?.asset?.metadata?.dimensions?.height || 800}
                fill={false}
                className="max-w-full max-h-[90vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}
