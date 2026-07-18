import Sections from "@/components/sections"
import { formatFullDate, parseSanityDate } from "@/lib/format-date"
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

  const { title, publishedAt, author, category, sections = [] } = post

  const metaLine = [
    publishedAt ? formatFullDate(parseSanityDate(publishedAt)) : null,
    authorDisplayName(author),
    category,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="flex min-h-screen flex-col items-center gap-y-24 pb-12">
      <section className="container flex flex-col items-center text-center content">
        <h1 className="mb-6">{title || 'Untitled Post'}</h1>
        {metaLine ? (
          <div className="flex flex-col gap-2 text-xl text-muted-foreground content">
            <p>{metaLine}</p>
          </div>
        ) : null}
      </section>
      <Sections body={sections as Array<{ _type?: string }>} />
    </article>
  )
}
