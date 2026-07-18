'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import SanityImage from '@/components/sanity-image'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatShortDate, parseSanityDate } from '@/lib/format-date'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import type { PostCard, PostsBlockProps } from '@/types/components/posts-block-type'
import type { SanityImageSource } from '@/types/components/sanity-image-type'

const DEFAULT_PAGE_SIZE = 6

export default function PostsBlock({
  active = true,
  componentIndex = 0,
  anchor,
  backgroundColor = 'primary',
  title,
  count = DEFAULT_PAGE_SIZE,
  initialPosts,
  posts,
}: PostsBlockProps) {
  if (active === false) return null

  const allPosts: PostCard[] = (initialPosts ?? posts ?? []).filter((p) => p?.slug)
  const pageSize = Math.max(1, count || DEFAULT_PAGE_SIZE)

  const [visibleCount, setVisibleCount] = useState(pageSize)

  if (allPosts.length === 0) {
    return (
      <section
        id={anchor || `posts-block-${componentIndex}`}
        className="posts-block w-full px-5 py-16 md:py-24 flex justify-center"
      >
        <p className="container text-center text-muted-foreground">No posts published yet.</p>
      </section>
    )
  }

  const displayedPosts = allPosts.slice(0, visibleCount)
  const hasMore = visibleCount < allPosts.length

  const bg = normalizeSectionBackground(backgroundColor)
  const { sectionClass, innerLiftClass, showTexture } = sectionBackgroundClasses(bg)
  const buttonVariant = bg === 'secondary' ? 'secondary' : 'default'

  return (
    <section
      id={anchor || `posts-block-${componentIndex}`}
      className={`posts-block w-full overflow-x-hidden px-5 py-16 md:py-24 flex justify-center ${sectionClass}`}
    >
      {showTexture ? <TextureSectionBackdrop /> : null}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className={`relative z-10 container flex w-full max-w-3xl flex-col items-stretch content ${innerLiftClass}`}
      >
        {title ? (
          <h2 className="mb-8 w-full text-center md:mb-12">{title}</h2>
        ) : null}

        <ul className="flex w-full flex-col gap-6">
          {displayedPosts.map((post) => {
            const authorName =
              typeof post.author === 'string'
                ? post.author
                : post.author?.title
            const meta = [
              post.category,
              post.publishedAt ? formatShortDate(parseSanityDate(post.publishedAt)) : null,
              authorName,
            ]
              .filter(Boolean)
              .join(' · ')

            return (
              <li key={post._id}>
                <Link href={`/posts/${post.slug}`} className="group block">
                  <Card className="flex w-full flex-col overflow-hidden rounded-md border border-border bg-card text-card-foreground transition-colors group-hover:border-primary sm:flex-row">
                    {post.image ? (
                      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-foreground sm:aspect-square sm:w-40 md:w-48">
                        <SanityImage
                          image={post.image as SanityImageSource}
                          fill
                          sizes="(max-width: 640px) 100vw, 192px"
                          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : null}
                    <CardContent className="flex w-full flex-col justify-center gap-2 px-4 py-5 sm:px-6">
                      {meta ? (
                        <p className="text-sm text-muted-foreground uppercase tracking-wide">
                          {meta}
                        </p>
                      ) : null}
                      <h3 className="text-h4 group-hover:underline">{post.title}</h3>
                      {post.excerpt ? (
                        <p className="text-base text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                      ) : null}
                      <span className="mt-1 text-sm font-medium uppercase tracking-wider text-primary">
                        Read more
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            )
          })}
        </ul>

        {hasMore ? (
          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              variant={buttonVariant}
              onClick={() => setVisibleCount((n) => Math.min(n + pageSize, allPosts.length))}
            >
              Load more
            </Button>
          </div>
        ) : null}
      </motion.div>
    </section>
  )
}
