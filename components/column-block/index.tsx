'use client'

import { motion } from 'framer-motion'
import SimpleText from '@/components/simple-text'
import SanityImage from '@/components/sanity-image'
import Route from '@/components/route'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

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
      className="column-block w-full flex justify-center px-5 py-12"
    >
      <div className="container relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="w-full flex flex-col items-center justify-center"
        >
          {title && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider text-center mb-8 md:mb-12">
              {title}
            </h2>
          )}
          {columns && Array.isArray(columns) && columns.length > 0 && (
            <div className={`grid ${gridCols} gap-4 md:gap-6 w-full`}>
              {columns.map((column, index) => (
                <Card
                  key={column._key || index}
                  className="flex flex-col h-full overflow-hidden w-full max-w-xl mx-auto"
                >
                  {column.image && (
                    <div className="relative w-full aspect-4/3 overflow-hidden shrink-0">
                      <SanityImage
                        image={column.image}
                        width={column.image?.asset?.metadata?.dimensions?.width || 400}
                        height={column.image?.asset?.metadata?.dimensions?.height || 300}
                        fill={false}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {column.title && (
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-xl md:text-2xl font-bold uppercase tracking-wider text-balance">
                        {column.title}
                      </CardTitle>
                    </CardHeader>
                  )}
                  {(column.content && Array.isArray(column.content)) ? (
                    <CardContent className="flex-1 text-center text-balance">
                      <SimpleText content={column.content} />
                    </CardContent>
                  ) : null}
                  {column.cta && column.cta.active && column.cta.route && (
                    <CardFooter className="justify-center pt-2">
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
