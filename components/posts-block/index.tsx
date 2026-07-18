'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import SanityImage from '@/components/sanity-image'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import { Card, CardContent } from '@/components/ui/card'
import { cleanStega } from '@/lib/stega'
import { formatShortDate, parseSanityDate } from '@/lib/format-date'
import type { PostsBlockProps } from '@/types/components/posts-block-type'
import type { SanityImageSource } from '@/types/components/sanity-image-type'

function normalizeBackgroundColor(raw?: string): 'primary' | 'secondary' | 'texture' {
  const v = cleanStega(typeof raw === 'string' ? raw : '').toLowerCase()
  if (v === 'secondary' || v === 'texture') return v
  return 'primary'
}

export default function PostsBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  title,
  count = 3,
  columnsPerRow = 3,
  posts,
}: PostsBlockProps) {
  if (!active) return null

  const visiblePosts = (posts || []).filter((p) => p?.slug).slice(0, count || 3)
  if (visiblePosts.length === 0) return null

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
      id={anchor || `posts-block-${componentIndex}`}
      className={`posts-block w-full overflow-x-hidden px-5 py-16 md:py-24 flex justify-center ${bgClass}`}
    >
      {bg === 'texture' ? <TextureSectionBackdrop /> : null}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className={`relative z-10 container flex w-full flex-col items-center justify-center content ${innerLiftClass}`}
      >
        {title ? (
          <h2 className="mb-8 w-full text-center md:mb-12">{title}</h2>
        ) : null}
        <div className={`grid w-full gap-x-6 gap-y-5 lg:mx-auto lg:max-w-[75vw] ${gridCols}`}>
          {visiblePosts.map((post) => (
            <Link
              key={post._id}
              href={`/posts/${post.slug}`}
              className="group block h-full"
            >
              <Card className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-md border-0 bg-card text-card-foreground">
                {post.image ? (
                  <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-foreground">
                    <SanityImage
                      image={post.image as SanityImageSource}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <CardContent className="w-full px-3 pt-6 sm:px-6">
                  <p className="text-sm text-muted-foreground">
                    {[
                      post.category,
                      post.publishedAt
                        ? formatShortDate(parseSanityDate(post.publishedAt))
                        : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                  <h3 className="mt-2 text-h4 group-hover:underline">{post.title}</h3>
                  {post.excerpt ? (
                    <p className="mt-2 text-base text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
