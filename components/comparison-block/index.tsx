import AppearAnimation from '@/components/appear-animation'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import { cn } from '@/lib/utils'
import type { ComparisonBlockProps } from '@/types/components/comparison-block-type'

/**
 * Columns of line items, each with a total. One column can be highlighted.
 *
 * Grid columns are driven off the authored count rather than a fixed value, so
 * a two-way and a four-way comparison both read correctly.
 */
export default function ComparisonBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  heading,
  intro,
  columns = [],
  note,
}: ComparisonBlockProps) {
  if (active === false) return null
  if (!columns.length) return null

  // `heading` was portable text before it was a string. Documents authored
  // against the old shape would otherwise render an object as a React child
  // and take the whole page down with them.
  const headingText = typeof heading === 'string' ? heading : null

  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)

  // Stacking the columns on a phone destroys the only thing a comparison does,
  // so below md they stay in a row and the row scrolls sideways instead.
  const gridCols =
    columns.length >= 4
      ? 'md:grid-cols-2 xl:grid-cols-4'
      : columns.length === 3
        ? 'md:grid-cols-3'
        : 'md:grid-cols-2'

  return (
    <section
      id={anchor || `comparison-block-${componentIndex}`}
      className={cn(
        'comparison-block flex w-full justify-center px-5 py-16 md:py-24',
        sectionClass
      )}
    >
      {showTexture ? <TextureSectionBackdrop /> : null}
      <AppearAnimation className={cn('relative z-10 container', innerLiftClass)}>
        {headingText ? <h2 className="text-h2 mb-3">{headingText}</h2> : null}
        {intro ? (
          <p className="mb-6 max-w-3xl text-sm text-muted-foreground md:mb-10 md:text-body">
            {intro}
          </p>
        ) : null}

        <div
          className={cn(
            'grid snap-x snap-mandatory auto-cols-[15rem] grid-flow-col gap-4 overflow-x-auto pb-2',
            'md:snap-none',
            'md:auto-cols-auto md:grid-flow-row md:overflow-visible md:pb-0',
            gridCols
          )}
        >
          {columns.map((col, i) => (
            <div key={col._key || `col-${i}`} className="flex snap-start flex-col">
              <div
                className={cn(
                  'flex h-full flex-col border bg-card',
                  col.highlight ? 'border-primary' : 'border-border'
                )}
              >
                <div
                  className={cn(
                    'border-b px-5 py-4',
                    col.highlight ? 'border-primary/40' : 'border-border'
                  )}
                >
                  <p className="text-lg font-bold">{col.title}</p>
                  {col.subtitle ? (
                    <p className="text-sm text-muted-foreground">{col.subtitle}</p>
                  ) : null}
                </div>

                <dl className="flex-1">
                  {(col.rows ?? []).map((row, j) => (
                    <div
                      key={row._key || `row-${j}`}
                      className="flex items-baseline justify-between gap-4 border-b border-border/60 px-5 py-3"
                    >
                      <dt className="text-sm text-muted-foreground">{row.label}</dt>
                      <dd
                        className={cn(
                          'text-right text-sm font-semibold',
                          row.emphasis === 'bad' && 'text-destructive',
                          row.emphasis === 'good' && 'text-primary'
                        )}
                      >
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {col.total ? (
                  <div className="px-5 pt-4 pb-5">
                    <p className="text-xs tracking-[0.12em] uppercase text-muted-foreground">
                      {col.totalLabel || 'Total'}
                    </p>
                    <p
                      className={cn(
                        'text-2xl font-extrabold tracking-tight',
                        col.highlight ? 'text-primary' : 'text-foreground'
                      )}
                    >
                      {col.total}
                    </p>
                  </div>
                ) : null}
              </div>

              {col.footnote ? (
                <p
                  className={cn(
                    'mt-3 border-l-2 py-1 pl-4 text-sm leading-snug',
                    col.highlight
                      ? 'border-primary text-foreground'
                      : 'border-border text-muted-foreground'
                  )}
                >
                  {col.footnote}
                </p>
              ) : null}
            </div>
          ))}
        </div>

        {note ? (
          <p className="mt-6 border-l-2 border-primary py-1 pl-5 text-sm text-muted-foreground md:mt-10 md:text-body">
            {note}
          </p>
        ) : null}
      </AppearAnimation>
    </section>
  )
}
