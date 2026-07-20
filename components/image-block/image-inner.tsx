import AppearAnimation from '@/components/appear-animation'
import SanityImage from '@/components/sanity-image'
import type { ImageBlockProps } from '@/types/components/image-block-type'

export default function ImageBlockInner({
  active = true,
  componentIndex = 0,
  anchor,
  image,
  imageMobile,
  maxWidth = 'max-w-2xl',
}: ImageBlockProps) {
  if (active === false) return null

  const mobileImage = imageMobile ?? image

  return (
    <section
      id={anchor || `image-block-${componentIndex}`}
      className="image-block w-full flex justify-center px-5 py-16 md:py-24"
    >
      {image || mobileImage ? (
        <AppearAnimation
          className={`container flex flex-col items-center gap-6 relative w-full ${maxWidth} mx-auto`}
        >
          {image ? (
            <div className="hidden md:block relative w-full">
              <SanityImage
                image={image}
                fill={false}
                alt={image.alt || 'Image'}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : null}
          {mobileImage ? (
            <div className="md:hidden relative w-full">
              <SanityImage
                image={mobileImage}
                fill={false}
                alt={(mobileImage as { alt?: string }).alt || 'Image'}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ) : null}
        </AppearAnimation>
      ) : null}
    </section>
  )
}
