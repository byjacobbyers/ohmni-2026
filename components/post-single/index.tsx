import SanityImage from "@/components/sanity-image"
import SimpleText from "@/components/simple-text"
import CtaRouteButton from "@/components/cta-route-button"
import { isActiveCta } from "@/lib/cta"
import { formatFullDate, parseSanityDate } from "@/lib/format-date"
import {
  authorDisplayName,
  authorObject,
  type PostSingleProps,
} from "@/types/components/post-single-type"
import type { SanityImageSource } from "@/types/components/sanity-image-type"
import type { BaseRouteType } from "@/types/objects/route-type"

/**
 * Article layout: centered masthead, byline, banner, then a single reading
 * column. Posts are long-form, so they deliberately do NOT use the page-builder
 * section shell, which is tuned for landing pages.
 */
export default function PostSingle({ post }: PostSingleProps) {
  if (!post) {
    return (
      <article className="flex min-h-screen flex-col items-center gap-y-24 pb-12">
        <div className="container text-center">
          <p className="text-lg text-muted-foreground">Post not found</p>
        </div>
      </article>
    )
  }

  const { title, publishedAt, author, category, excerpt, image, body, cta } = post
  const authorName = authorDisplayName(author)
  const person = authorObject(author)
  const dateLine = publishedAt ? formatFullDate(parseSanityDate(publishedAt)) : null
  const credit = [person?.primaryJobTitle, dateLine].filter(Boolean).join(' · ')

  return (
    <article className="post-article w-full pb-16">
      <header className="post-masthead">
        {category ? <p className="post-eyebrow">{category}</p> : null}
        <h1 className="post-title">{title || 'Untitled Post'}</h1>
        {excerpt ? <p className="post-lead">{excerpt}</p> : null}

        {authorName || dateLine ? (
          <div className="post-byline">
            {person?.image ? (
              <span className="post-avatar">
                <SanityImage
                  image={person.image as SanityImageSource}
                  fill
                  sizes="48px"
                  className="object-cover object-center"
                />
              </span>
            ) : null}
            <span className="post-byline-text">
              {authorName ? <strong>{authorName}</strong> : null}
              {credit ? <span className="post-credit">{credit}</span> : null}
            </span>
          </div>
        ) : null}
      </header>

      {image ? (
        <figure className="post-banner">
          <SanityImage
            image={image as SanityImageSource}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover object-center"
          />
        </figure>
      ) : null}

      <div className="post-body content">
        <SimpleText content={body} />
      </div>

      {isActiveCta(cta) ? (
        <div className="post-cta">
          <CtaRouteButton route={cta.route as BaseRouteType} />
        </div>
      ) : null}
    </article>
  )
}
