import AppearAnimation from '@/components/appear-animation'
import SimpleText from '@/components/simple-text'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import { normalizeSectionBackground, sectionBackgroundClasses } from '@/lib/section-background'
import { cn } from '@/lib/utils'
import type { PanelsBlockProps } from '@/types/components/panels-block-type'

/**
 * Dense left-aligned panels. The highlighted panel gets a primary top bar and
 * border; everything else is the card surface. Tags render as chips.
 */
export default function PanelsBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  kicker,
  heading,
  intro,
  columnsPerRow = 3,
  panels = [],
  note,
}: PanelsBlockProps) {
  if (active === false) return null
  if (!panels.length) return null

  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)
  const gridCols =
    columnsPerRow === 4 ? 'md:grid-cols-2 xl:grid-cols-4' : columnsPerRow === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'

  return (
    <section
      id={anchor || `panels-block-${componentIndex}`}
      className={cn('panels-block flex w-full justify-center px-5 py-16 md:py-24', sectionClass)}
    >
      {showTexture ? <TextureSectionBackdrop /> : null}
      <AppearAnimation className={cn('relative z-10 container', innerLiftClass)}>
        {kicker || heading || intro ? (
          <div className="mb-8 md:mb-10">
            {kicker ? (
              <p className="mb-2 text-sm font-bold tracking-[0.14em] uppercase text-primary">{kicker}</p>
            ) : null}
            {heading ? <h2 className="text-h3 md:text-h2">{heading}</h2> : null}
            {intro ? (
              <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">{intro}</p>
            ) : null}
          </div>
        ) : null}

        <div className={cn('grid grid-cols-1 gap-4', gridCols)}>
          {panels.map((p, i) => (
            <div
              key={p._key || `panel-${i}`}
              className={cn(
                'flex flex-col border bg-card',
                p.highlight ? 'border-primary' : 'border-border'
              )}
            >
              <div className={cn('h-1', p.highlight ? 'bg-primary' : 'bg-border/60')} />
              <div className="flex flex-1 flex-col gap-2 p-5">
                {p.eyebrow ? (
                  <p className={cn('text-xs tracking-[0.12em] uppercase', p.highlight ? 'text-primary' : 'text-muted-foreground')}>
                    {p.eyebrow}
                  </p>
                ) : null}
                {p.title ? <p className="text-lg leading-tight font-bold">{p.title}</p> : null}
                {p.tags?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className={cn('px-2 py-0.5 text-xs font-semibold', p.highlight ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground')}>
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
                {/* Not `.content`: its unlayered type scale beats utility
                    classes, and a dense panel needs small type. */}
                {p.body ? (
                  <div className="text-sm leading-snug text-muted-foreground [&_li]:mb-1 [&_p+p]:mt-2 [&_strong]:text-foreground [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-4">
                    <SimpleText content={p.body} />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {note ? (
          <div className="mt-8 border-l-2 border-primary py-1 pl-5 text-sm leading-snug text-muted-foreground md:text-base [&_p+p]:mt-1 [&_strong]:text-foreground">
            <SimpleText content={note} />
          </div>
        ) : null}
      </AppearAnimation>
    </section>
  )
}
