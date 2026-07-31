import Sections from "@/components/sections"
import SanityImage from "@/components/sanity-image"
import { formatFullDate, parseSanityDate } from "@/lib/format-date"
import type { SanityImageSource } from "@/types/components/sanity-image-type"
import {
  authorDisplayName,
  type PostSingleProps,
} from "@/types/components/post-single-type"

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

  const { title, publishedAt, author, category, image, sections = [] } = post

  const metaLine = [
    publishedAt ? formatFullDate(parseSanityDate(publishedAt)) : null,
    authorDisplayName(author),
    category,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="reading-layout flex min-h-screen flex-col items-center pb-12">
      <header className="container flex flex-col items-center pt-16 pb-10 text-center md:pt-24">
        <div className="content">
          <h1 className="mb-4">{title || 'Untitled Post'}</h1>
          {metaLine ? <p className="text-muted-foreground">{metaLine}</p> : null}
        </div>
      </header>

      {image ? (
        <div className="w-full px-5 pb-4">
          <div className="relative mx-auto aspect-[16/7] w-full max-w-5xl overflow-hidden">
            <SanityImage
              image={image as SanityImageSource}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover object-center"
            />
          </div>
        </div>
      ) : null}

      <Sections body={sections as Array<{ _type?: string }>} />
    </article>
  )
}
