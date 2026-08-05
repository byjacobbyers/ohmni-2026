import type { DocumentLocationResolver } from 'sanity/presentation'
import { map } from 'rxjs'

type PostDoc = {
  title?: string | null
  slug?: string | null
} | null

/**
 * Post locations via listenQuery — bypasses documentPreviewStore.observeForPreview,
 * which hung forever (“Resolving locations…”) for posts in this Studio.
 */
export const resolvePostLocations: DocumentLocationResolver = (params, context) => {
  if (params.type !== 'post') return null

  const publishedId = params.id.replace(/^drafts\./, '')
  const draftId = `drafts.${publishedId}`

  const doc$ = context.documentStore.listenQuery(
    {
      fetch: `*[_id == $publishedId || _id == $draftId] | order(_updatedAt desc)[0]{ title, "slug": slug.current }`,
      listen: `*[_id in [$publishedId, $draftId]]`,
    },
    { publishedId, draftId },
    { perspective: 'previewDrafts' }
  )

  return doc$.pipe(
    map((doc: PostDoc) => {
      if (!doc?.slug) {
        return { message: 'Add a slug to preview this post', tone: 'caution' as const }
      }

      return {
        locations: [
          { title: doc.title || 'Untitled', href: `/posts/${doc.slug}` },
          { title: 'Posts', href: '/posts' },
        ],
      }
    })
  )
}
