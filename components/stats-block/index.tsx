import AppearAnimation from '@/components/appear-animation'
import SanityImage from '@/components/sanity-image'
import SimpleText from '@/components/simple-text'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import { cn } from '@/lib/utils'
import type { StatsBlockProps } from '@/types/components/stats-block-type'

export default function StatsBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  heading,
  image,
  layout = 'image-left',
  stats = [],
}: StatsBlockProps) {
  if (active === false) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)
  const rowDirectionClass =
    layout === 'image-right' ? 'xl:flex-row-reverse' : 'xl:flex-row'
  const imageColumnGutterClass =
    layout === 'image-right' ? 'xl:pl-4' : 'xl:pr-4'
  const hasImage = Boolean(
    image && typeof image === 'object' && 'asset' in image && image.asset
  )

  return (
    <section
      id={anchor || `stats-block-${componentIndex}`}
      className={cn(
        'stats-block flex w-full max-w-full justify-center overflow-x-hidden px-5 py-16 md:py-24',
        sectionClass
      )}
    >
      {showTexture ? <TextureSectionBackdrop /> : null}
      <AppearAnimation
        className={cn('container flex w-full min-w-0 flex-col gap-8', innerLiftClass)}
      >
        {heading ? (
          <div className="content max-w-5xl">
            <SimpleText content={heading} />
          </div>
        ) : null}

        <div
          className={cn(
            'flex w-full min-w-0 flex-col gap-4 xl:items-stretch',
            rowDirectionClass
          )}
        >
          {hasImage ? (
            <div
              className={cn(
                'relative w-full min-w-0 overflow-hidden rounded-md aspect-square md:aspect-auto xl:min-h-[420px] xl:w-1/3 xl:self-stretch',
                imageColumnGutterClass
              )}
            >
              <div className="absolute inset-0 md:hidden">
                <SanityImage
                  image={image!}
                  fill
                  className="object-cover object-top"
                  sizes="100vw"
                />
              </div>
              <div className="relative hidden aspect-4/5 w-full md:block xl:absolute xl:inset-0 xl:aspect-auto">
                <SanityImage
                  image={image!}
                  fill
                  className="rounded-md object-cover object-top"
                  sizes="(max-width: 1279px) 100vw, 33vw"
                />
              </div>
            </div>
          ) : null}

          <div
            className={cn(
              'flex w-full min-w-0 max-w-full flex-wrap gap-4',
              hasImage ? 'xl:w-2/3' : 'xl:w-full'
            )}
          >
            {stats.map((stat, i) => (
              <div
                key={stat._key || `stat-${i}`}
                className="flex min-w-0 w-full max-w-full flex-col gap-2 rounded-md bg-muted/50 px-6 pb-6 pt-10 xl:w-[calc(50%-0.5rem)] xl:max-w-[calc(50%-0.5rem)]"
              >
                {stat.statValue ? (
                  <div className="text-5xl font-bold text-primary">{stat.statValue}</div>
                ) : null}
                {stat.content ? (
                  <div className="min-w-0 wrap-break-word text-sm leading-relaxed text-muted-foreground">
                    <SimpleText content={stat.content} />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </AppearAnimation>
    </section>
  )
}
