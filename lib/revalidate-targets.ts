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

export function getTargetsForDocument(body: WebhookPayload): RevalidateTarget[] {
  const { _type, slug } = body

  switch (_type) {
    case 'page': {
      const pageSlug = slug?.current
      if (pageSlug === 'home') return [{ path: '/' }, SITEMAP]
      if (pageSlug === 'posts') return [{ path: '/posts' }, SITEMAP]
      if (pageSlug === 'events') return [{ path: '/events' }, SITEMAP]
      if (pageSlug) return [{ path: `/${pageSlug}` }, SITEMAP]
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
      const targets: RevalidateTarget[] = [{ path: '/posts' }, { path: '/' }]
      const postSlug = slug?.current
      if (postSlug) targets.unshift({ path: `/posts/${postSlug}` })
      targets.push(SITEMAP)
      return targets
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
