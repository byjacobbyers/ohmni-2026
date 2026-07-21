import AppearAnimation from '@/components/appear-animation'
import SanityImage from '@/components/sanity-image'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'
import type { ImageBlockProps } from '@/types/components/image-block-type'

export default function ImageBlockInner({
  active = true,
  componentIndex = 0,
  anchor,
  image,
  imageMobile,
  maxWidth = 'max-w-2xl',
  showImagePlaceholder = false,
}: ImageBlockProps) {
  if (active === false) return null

  const mobileImage = imageMobile ?? image
  const hasMedia = Boolean(image || mobileImage)
  if (!hasMedia && !showImagePlaceholder) return null

  return (
    <section
      id={anchor || `image-block-${componentIndex}`}
      className="image-block flex w-full justify-center px-5 py-16 md:py-24"
    >
      <AppearAnimation
        className={`container relative mx-auto flex w-full flex-col items-center gap-6 ${maxWidth}`}
      >
        {hasMedia ? (
          <>
            {image ? (
              <div className="relative hidden w-full md:block">
                <SanityImage
                  image={image}
                  fill={false}
                  alt={image.alt || 'Image'}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : null}
            {mobileImage ? (
              <div className="relative w-full md:hidden">
                <SanityImage
                  image={mobileImage}
                  fill={false}
                  alt={(mobileImage as { alt?: string }).alt || 'Image'}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : null}
          </>
        ) : (
          <ImagePlaceholder aspect="video" caption="Media block" className="w-full" />
        )}
      </AppearAnimation>
    </section>
  )
}
