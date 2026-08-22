/**
 * Path targets for Sanity publish webhooks → Next revalidatePath.
 * Kept pure so unit tests can cover mapping without hitting Next APIs.
 */

export type RevalidateTarget = {
  path: string
  /** `layout` busts shared site chrome (header/footer/brand) under the path */
  type?: 'page' | 'layout'
}

export type WebhookPayload = {
  _type: string
  _id?: string
  slug?: { current?: string }
}

/** Publishing content changes the sitemap, which is its own static route. */
const SITEMAP: RevalidateTarget = { path: '/sitemap.xml' }

/**
 * English and Spanish share a slug, and the webhook projection may not carry
 * `language`, so both URLs are busted. The spare call is cheaper than a stale
 * page in the other language.
 */
const both = (path: string): RevalidateTarget[] => [{ path }, { path: path === '/' ? '/es' : `/es${path}` }]

export function getTargetsForDocument(body: WebhookPayload): RevalidateTarget[] {
  const { _type, slug } = body

  switch (_type) {
    case 'page': {
      const pageSlug = slug?.current
      if (pageSlug === 'home') return [...both('/'), SITEMAP]
      if (pageSlug === 'posts') return [...both('/posts'), SITEMAP]
      if (pageSlug === 'events') return [{ path: '/events' }, SITEMAP]
      if (pageSlug) return [...both(`/${pageSlug}`), SITEMAP]
      return [{ path: '/', type: 'layout' }]
    }
    case 'event': {
      const targets: RevalidateTarget[] = [
        { path: '/events' },
        { path: '/past-events' },
        { path: '/' },
      ]
      const eventSlug = slug?.current
      if (eventSlug) targets.unshift({ path: `/events/${eventSlug}` })
      targets.push(SITEMAP)
      return targets
    }
    case 'post': {
      const targets: RevalidateTarget[] = [...both('/posts'), ...both('/')]
      const postSlug = slug?.current
      if (postSlug) targets.unshift(...both(`/posts/${postSlug}`))
      targets.push(SITEMAP)
      return targets
    }
    case 'presentation': {
      // Screens are children of the deck path, so a layout bust covers all of
      // them. Decks are noindex, so the sitemap is deliberately untouched.
      const deckSlug = slug?.current
      return [{ path: deckSlug ? `/present/${deckSlug}` : '/present', type: 'layout' }]
    }
    case 'experiment': {
      // Assignment is read at the edge with its own 60s cache; what Next
      // caches is the variant page metadata (noindex, canonical), so bust
      // the tested path as a layout to cover the variant underneath it.
      const path = (body as { pathname?: string }).pathname
      return [{ path: path && path.startsWith('/') ? path : '/', type: 'layout' }]
    }
    case 'navigation':
    case 'site':
    case 'announcement':
    case 'redirect':
    case 'form':
    case 'formSettings':
    case 'postCtaSettings':
      return [{ path: '/', type: 'layout' }]
    default:
      return [{ path: '/', type: 'layout' }]
  }
}
