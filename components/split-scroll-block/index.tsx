import AppearAnimation from '@/components/appear-animation'
import SimpleText from '@/components/simple-text'
import SanityImage from '@/components/sanity-image'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import type { SplitScrollBlockProps } from '@/types/components/split-scroll-block-type'

export default function SplitScrollBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  title,
  items = [],
}: SplitScrollBlockProps) {
  if (active === false || !items?.length) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)

  return (
    <section
      id={anchor || `split-scroll-block-${componentIndex}`}
      className={`split-scroll-block w-full flex justify-center px-5 py-16 md:py-24 ${sectionClass}`}
    >
      {showTexture ? <TextureSectionBackdrop /> : null}
      <AppearAnimation
        className={`container ${innerLiftClass} grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start`}
      >
        <div className="lg:sticky lg:top-24 lg:self-start">
          {title && Array.isArray(title) && title.length > 0 ? (
            <div className="content">
              <SimpleText content={title} />
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-12 pt-0 md:gap-16 lg:pt-[25vh]">
          {items.map((item, i) => (
            <article
              key={item._key ?? `split-scroll-item-${i}`}
              className="flex min-h-[12.5vh] md:min-h-[50vh] flex-col gap-4 md:gap-6"
            >
              {item.image ? (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <SanityImage
                    image={item.image}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              ) : null}
              {item.content && Array.isArray(item.content) ? (
                <div className="content">
                  <SimpleText content={item.content} />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </AppearAnimation>
    </section>
  )
}
