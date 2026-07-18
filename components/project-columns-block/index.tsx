import AppearAnimation from '@/components/appear-animation'
import SimpleText from '@/components/simple-text'
import SanityImage from '@/components/sanity-image'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import CtaRouteButton from '@/components/cta-route-button'
import { isActiveCta } from '@/lib/cta'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import type { ProjectColumnsBlockProps } from '@/types/components/project-columns-block-type'

export default function ProjectColumnsBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  title,
  columnsPerRow = 3,
  projects,
}: ProjectColumnsBlockProps) {
  if (active === false) return null

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
      id={anchor || `project-columns-block-${componentIndex}`}
      className={`project-columns-block w-full overflow-x-hidden px-5 py-16 md:py-24 flex justify-center ${sectionClass}`}
    >
      {showTexture ? <TextureSectionBackdrop /> : null}
      <AppearAnimation
        className={`relative z-10 container flex w-full flex-col items-center justify-center content ${innerLiftClass}`}
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
                {isActiveCta(project.cta) ? (
                  <CardFooter className="mt-auto w-full shrink-0 justify-center px-3 pb-6 pt-2 sm:px-6">
                    <CtaRouteButton route={project.cta.route} variant="secondary" />
                  </CardFooter>
                ) : null}
              </Card>
            ))}
          </div>
        ) : null}
      </AppearAnimation>
    </section>
  )
}
