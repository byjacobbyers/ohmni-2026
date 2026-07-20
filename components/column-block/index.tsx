import AppearAnimation from '@/components/appear-animation'
import SimpleText from '@/components/simple-text'
import SanityImage from '@/components/sanity-image'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import CtaRouteButton from '@/components/cta-route-button'
import { isActiveCta } from '@/lib/cta'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import type { ColumnBlockProps } from '@/types/components/column-block-type'

export default function ColumnBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  cardStyle = 'logo',
  title,
  columnsPerRow = 3,
  columns,
  projects,
}: ColumnBlockProps) {
  if (active === false) return null

  const items = (columns?.length ? columns : projects) || []
  const style = cardStyle === 'project' || (!columns?.length && projects?.length)
    ? 'project'
    : 'logo'

  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)

  const columnsPerRowValue = columnsPerRow || 3
  const gridCols =
    columnsPerRowValue === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : columnsPerRowValue === 3
        ? 'grid-cols-1 md:grid-cols-3'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'

  return (
    <section
      id={anchor || `cards-block-${componentIndex}`}
      className={cn(
        'column-block cards-block w-full overflow-x-hidden px-5 py-16 md:py-24 flex justify-center',
        sectionClass
      )}
    >
      {showTexture ? <TextureSectionBackdrop /> : null}
      <AppearAnimation
        className={cn(
          'relative z-10 container flex w-full flex-col items-center justify-center content',
          innerLiftClass
        )}
      >
        {title ? (
          <h2 className="mb-8 w-full text-center md:mb-12">{title}</h2>
        ) : null}
        {items.length > 0 ? (
          <div
            className={`grid w-full gap-x-6 gap-y-5 lg:mx-auto 2xl:max-w-[75vw] ${gridCols}`}
          >
            {items.map((column, index) => {
              const isEmphasized =
                style === 'logo' &&
                ((columnsPerRowValue === 3 && items.length === 3 && index === 1) ||
                  (columnsPerRowValue === 4 &&
                    items.length === 4 &&
                    (index === 1 || index === 2)))

              return (
                <Card
                  key={column._key || index}
                  className={cn(
                    'flex w-full min-h-0 min-w-0 max-w-none flex-col items-center justify-center overflow-hidden rounded-md border-0',
                    style === 'project'
                      ? 'bg-card text-card-foreground'
                      : isEmphasized
                        ? 'relative z-10 bg-muted/52 py-6 md:scale-[1.04] md:py-10'
                        : 'bg-muted/40 py-6 md:py-8'
                  )}
                >
                  {column.image ? (
                    style === 'project' ? (
                      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-foreground">
                        <SanityImage
                          image={column.image}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover object-center"
                        />
                      </div>
                    ) : (
                      <div className="w-full shrink-0 px-5 pt-3 pb-3">
                        <div
                          className={`relative mx-auto w-full max-w-full overflow-hidden ${
                            column.title === 'TerraTrue' ? 'h-6' : 'h-8'
                          }`}
                        >
                          <SanityImage
                            image={column.image}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-contain object-center"
                          />
                        </div>
                      </div>
                    )
                  ) : null}
                  {column.content && Array.isArray(column.content) ? (
                    <CardContent
                      className={cn(
                        'min-h-0 w-full overflow-y-auto px-3 text-center text-balance sm:px-6',
                        style === 'project' ? 'pt-6' : ''
                      )}
                    >
                      <div className="content">
                        <SimpleText content={column.content} />
                      </div>
                    </CardContent>
                  ) : null}
                  {isActiveCta(column.cta) ? (
                    <CardFooter
                      className={cn(
                        'mt-auto w-full shrink-0 justify-center px-3 sm:px-6',
                        style === 'project' ? 'pb-6 pt-2' : 'pb-3 pt-2'
                      )}
                    >
                      <CtaRouteButton route={column.cta.route} variant="secondary" />
                    </CardFooter>
                  ) : null}
                </Card>
              )
            })}
          </div>
        ) : null}
      </AppearAnimation>
    </section>
  )
}
