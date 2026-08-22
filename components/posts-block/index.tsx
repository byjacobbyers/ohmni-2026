'use client'

import { useState } from 'react'
import Link from 'next/link'
import SanityImage from '@/components/sanity-image'
import AppearAnimation from '@/components/appear-animation'
import TextureSectionBackdrop from '@/components/texture-section-backdrop'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'
import { formatShortDate, parseSanityDate } from '@/lib/format-date'
import {
  normalizeSectionBackground,
  sectionBackgroundClasses,
} from '@/lib/section-background'
import type { PostCard, PostsBlockProps } from '@/types/components/posts-block-type'
import type { SanityImageSource } from '@/types/components/sanity-image-type'
import { localizePath, t } from '@/lib/i18n'

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
  showImagePlaceholder = false,
  lang = 'en',
}: PostsBlockProps) {
  const allPosts: PostCard[] = (initialPosts ?? posts ?? []).filter((p) => p?.slug)
  const pageSize = Math.max(1, count || DEFAULT_PAGE_SIZE)

  // Hooks first: an early return above a hook breaks the rules of hooks.
  const [visibleCount, setVisibleCount] = useState(pageSize)

  if (active === false) return null

  if (allPosts.length === 0) {
    return (
      <section
        id={anchor || `posts-block-${componentIndex}`}
        className="posts-block w-full px-5 py-16 md:py-24 flex justify-center"
      >
        <p className="container text-center text-muted-foreground">{t(lang, 'noPosts')}</p>
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
      <AppearAnimation
        className={`relative z-10 container flex w-full max-w-3xl flex-col items-stretch ${innerLiftClass}`}
      >
        {title ? (
          <h2 className="mb-8 w-full text-center md:mb-12">{title}</h2>
        ) : null}

        <ul className="flex w-full list-none flex-col gap-6 p-0">
          {displayedPosts.map((post) => {
            const authorName =
              typeof post.author === 'string'
                ? post.author
                : post.author?.title
            const meta = [
              post.category,
              post.publishedAt ? formatShortDate(parseSanityDate(post.publishedAt), lang) : null,
              authorName,
            ]
              .filter(Boolean)
              .join(' · ')

            return (
              <li key={post._id} className="list-none">
                <Link href={localizePath(`/posts/${post.slug}`, lang)} className="group block no-underline">
                  <Card className="flex w-full flex-col overflow-hidden rounded-md border border-border bg-card text-card-foreground transition-colors group-hover:border-primary">
                    {post.image || showImagePlaceholder ? (
                      <div className="relative w-full overflow-hidden border-b border-border">
                        {post.image ? (
                          <SanityImage
                            image={post.image as SanityImageSource}
                            fill={false}
                            sizes="(max-width: 768px) 100vw, 768px"
                            className="block h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <ImagePlaceholder
                            aspect="video"
                            marks={false}
                            label="IMG"
                            className="rounded-none border-0"
                          />
                        )}
                      </div>
                    ) : null}
                    <CardContent className="flex w-full flex-col gap-2 px-4 py-5 sm:px-6">
                      {meta ? (
                        <p className="text-sm tracking-wide text-muted-foreground uppercase no-underline">
                          {meta}
                        </p>
                      ) : null}
                      <h3 className="text-h4 no-underline">{post.title}</h3>
                      {post.excerpt ? (
                        <p className="line-clamp-2 text-base text-muted-foreground no-underline">
                          {post.excerpt}
                        </p>
                      ) : null}
                      <span className="mt-1 text-sm font-medium tracking-wider text-primary uppercase no-underline">
                        {t(lang, 'readMore')}
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
              {t(lang, 'loadMore')}
            </Button>
          </div>
        ) : null}
      </AppearAnimation>
    </section>
  )
}
