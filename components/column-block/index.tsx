'use client'

import { motion } from 'framer-motion'
import SimpleText from '@/components/simple-text'
import SanityImage from '@/components/sanity-image'
import Route from '@/components/route'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

type ColumnBlockProps = {
  active?: boolean
  componentIndex?: number
  anchor?: string
  title?: string
  columnsPerRow?: number
  columns?: Array<{
    _key?: string
    title?: string
    content?: unknown
    image?: {
      asset?: { metadata?: { dimensions?: { width?: number; height?: number } } }
      [key: string]: unknown
    } | null
    cta?: { active?: boolean; route?: { title?: string; [key: string]: unknown } } | null
  }>
}

export default function ColumnBlock({
  active = true,
  componentIndex = 0,
  anchor,
  title,
  columnsPerRow = 3,
  columns,
}: ColumnBlockProps) {
  if (!active) return null

  const columnsPerRowValue = columnsPerRow || 3
  const gridCols =
    columnsPerRowValue === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : columnsPerRowValue === 3
        ? 'grid-cols-1 md:grid-cols-3'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'

  return (
    <section
      id={anchor || `column-block-${componentIndex}`}
      className="column-block w-full overflow-x-hidden py-12"
    >
      <div className="relative z-10 mx-auto w-full max-w-none">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex w-full flex-col items-center justify-center"
        >
          {title && (
            <h2 className="mb-8 px-5 text-center text-3xl font-bold tracking-wider md:mb-12 md:text-4xl lg:text-5xl">
              {title}
            </h2>
          )}
          {columns && Array.isArray(columns) && columns.length > 0 && (
            <div
              className={`relative left-1/2 grid w-screen max-w-[100vw] -translate-x-1/2 gap-px bg-border md:border-t md:border-b md:border-border ${gridCols}`}
            >
              {columns.map((column, index) => (
                <Card
                  key={column._key || index}
                  className="flex h-full w-full min-w-0 max-w-none py-10 flex-col overflow-hidden rounded-none border-0 bg-background shadow-none max-md:first:border-t max-md:first:border-border max-md:last:border-b max-md:last:border-border"
                >
                  {column.image && (
                    <div className="w-full shrink-0 pt-3 px-5 py-5">
                      <div
                        className={`relative mx-auto w-full max-w-full overflow-hidden ${
                          column.title === 'TerraTrue' ? 'h-4' : 'h-6'
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
                  )}
                  {(column.content && Array.isArray(column.content)) ? (
                    <CardContent className="flex-1 px-3 text-center text-balance sm:px-6">
                      <div className="content">
                        <SimpleText content={column.content} />
                      </div>
                    </CardContent>
                  ) : null}
                  {column.cta && column.cta.active && column.cta.route && (
                    <CardFooter className="shrink-0 justify-center px-3 pb-3 pt-3 sm:px-6">
                      <Route data={column.cta.route as Parameters<typeof Route>[0]['data']}>
                        <Button variant="secondary">
                          {String((column.cta.route as { title?: string }).title || 'Learn More')}
                        </Button>
                      </Route>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
