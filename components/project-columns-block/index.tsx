'use client'

import { motion } from 'framer-motion'
import SimpleText from '@/components/simple-text'
import SanityImage from '@/components/sanity-image'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import Route from '@/components/route'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { cleanStega } from '@/lib/stega'
import type { ProjectColumnsBlockProps } from '@/types/components/project-columns-block-type'

function normalizeBackgroundColor(raw?: string): 'primary' | 'secondary' | 'texture' {
  const v = cleanStega(typeof raw === 'string' ? raw : '').toLowerCase()
  if (v === 'secondary' || v === 'texture') return v
  return 'primary'
}

export default function ProjectColumnsBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  title,
  columnsPerRow = 3,
  projects,
}: ProjectColumnsBlockProps) {
  if (!active) return null

  const bg = normalizeBackgroundColor(backgroundColor)
  const bgClass =
    bg === 'secondary'
      ? 'bg-primary text-primary-foreground'
      : bg === 'texture'
        ? 'relative bg-black'
        : ''
  const innerLiftClass = bg === 'texture' ? 'relative z-10 text-foreground' : ''

  const columnsPerRowValue = columnsPerRow || 3
  const gridCols =
    columnsPerRowValue === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : columnsPerRowValue === 3
        ? 'grid-cols-1 md:grid-cols-3'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'

  return (
    <section
      id={anchor || `project-columns-block-${componentIndex}`}
      className={`project-columns-block w-full overflow-x-hidden px-5 py-16 md:py-24 flex justify-center ${bgClass}`}
    >
      {bg === 'texture' ? <TextureSectionBackdrop /> : null}
      <div className={`relative z-10 container flex justify-center ${innerLiftClass}`}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex w-full flex-col items-center justify-center content"
        >
          {title ? (
            <h2 className="mb-8 w-full text-center md:mb-12">
              {title}
            </h2>
          ) : null}
          {projects && Array.isArray(projects) && projects.length > 0 ? (
            <div
              className={`grid w-full gap-x-6 gap-y-5 lg:mx-auto lg:max-w-[75vw] ${gridCols}`}
            >
              {projects.map((project, index) => (
                <Card
                  key={project._key || index}
                  className="flex w-full min-h-0 min-w-0 max-w-none flex-col items-center justify-center overflow-hidden rounded-md border-0 bg-card text-card-foreground"
                >
                  {project.image ? (
                    <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-foreground">
                      <SanityImage
                        image={project.image}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center"
                      />
                    </div>
                  ) : null}
                  {project.content && Array.isArray(project.content) ? (
                    <CardContent className="min-h-0 w-full overflow-y-auto px-3 pt-6 text-center text-balance sm:px-6">
                      <div className="content">
                        <SimpleText content={project.content} />
                      </div>
                    </CardContent>
                  ) : null}
                  {project.cta?.active && project.cta.route ? (
                    <CardFooter className="mt-auto w-full shrink-0 justify-center px-3 pb-6 pt-2 sm:px-6">
                      <Route data={project.cta.route as Parameters<typeof Route>[0]['data']}>
                        <Button variant="secondary">
                          {String((project.cta.route as { title?: string }).title || 'Learn More')}
                        </Button>
                      </Route>
                    </CardFooter>
                  ) : null}
                </Card>
              ))}
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  )
}
