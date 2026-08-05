import type {
  DocumentLocationResolver,
  DocumentLocationsState,
} from 'sanity/presentation'
import { map, type Observable } from 'rxjs'

type SlugDoc = {
  title?: string | null
  slug?: string | null
} | null

type LocationContext = Parameters<DocumentLocationResolver>[1]
type LocationParams = Parameters<DocumentLocationResolver>[0]

function listenSlugDoc(
  params: LocationParams,
  context: LocationContext
): Observable<SlugDoc> {
  const publishedId = params.id.replace(/^drafts\./, '')
  const draftId = `drafts.${publishedId}`

  return context.documentStore.listenQuery(
    {
      fetch: `*[_id == $publishedId || _id == $draftId] | order(_updatedAt desc)[0]{ title, "slug": slug.current }`,
      listen: `*[_id in [$publishedId, $draftId]]`,
    },
    { publishedId, draftId },
    { perspective: 'previewDrafts' }
  ) as Observable<SlugDoc>
}

/**
 * Single Presentation locations resolver (typed as DocumentLocationResolver).
 * Posts use listenQuery because observeForPreview hung forever for that type.
 */
export const resolveLocations: DocumentLocationResolver = (params, context) => {
  if (params.type === 'postCtaSettings') {
    return {
      message: 'Default closing CTA for posts that do not set their own',
      tone: 'caution',
    } satisfies DocumentLocationsState
  }

  if (params.type === 'post') {
    return listenSlugDoc(params, context).pipe(
      map((doc) => {
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

  if (params.type === 'page') {
    return listenSlugDoc(params, context).pipe(
      map((doc) => {
        if (!doc?.slug) {
          return { message: 'Add a slug to preview this page', tone: 'caution' as const }
        }
        return {
          locations: [
            {
              title: doc.title || 'Untitled',
              href: doc.slug === 'home' ? '/' : `/${doc.slug}`,
            },
          ],
        }
      })
    )
  }

  if (params.type === 'event') {
    return listenSlugDoc(params, context).pipe(
      map((doc) => {
        if (!doc?.slug) {
          return { message: 'Add a slug to preview this event', tone: 'caution' as const }
        }
        return {
          locations: [
            { title: doc.title || 'Untitled', href: `/events/${doc.slug}` },
            { title: 'Events', href: '/events' },
          ],
        }
      })
    )
  }

  return null
}
