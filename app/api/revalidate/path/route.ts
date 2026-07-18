import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

type WebhookPayload = {
  _type: string
  _id?: string
  slug?: { current?: string }
}

type RevalidateTarget = {
  path: string
  /** `layout` busts the shared site chrome (header/footer/brand) on all routes under the path */
  type?: 'page' | 'layout'
}

function getTargetsForDocument(body: WebhookPayload): RevalidateTarget[] {
  const { _type, slug } = body

  switch (_type) {
    case 'page': {
      const pageSlug = slug?.current
      if (pageSlug === 'home') return [{ path: '/' }]
      if (pageSlug === 'posts') return [{ path: '/posts' }]
      if (pageSlug === 'events') return [{ path: '/events' }]
      if (pageSlug) return [{ path: `/${pageSlug}` }]
      return [{ path: '/', type: 'layout' }]
    }
    case 'event': {
      const targets: RevalidateTarget[] = [{ path: '/events' }, { path: '/' }]
      const eventSlug = slug?.current
      if (eventSlug) targets.unshift({ path: `/events/${eventSlug}` })
      return targets
    }
    case 'post': {
      const targets: RevalidateTarget[] = [{ path: '/posts' }, { path: '/' }]
      const postSlug = slug?.current
      if (postSlug) targets.unshift({ path: `/posts/${postSlug}` })
      return targets
    }
    case 'navigation':
    case 'site':
    case 'announcement':
      // Shared chrome lives in the site layout — bust all routes under it.
      return [{ path: '/', type: 'layout' }]
    case 'redirect':
      // Redirects can affect any URL; layout revalidate is the safe sweep.
      return [{ path: '/', type: 'layout' }]
    default:
      return [{ path: '/', type: 'layout' }]
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Path revalidation endpoint. Use POST to revalidate.',
    endpoint: '/api/revalidate/path',
  })
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return new Response('Missing SANITY_REVALIDATE_SECRET', { status: 500 })
  }

  const { isValidSignature, body } = await parseBody<WebhookPayload>(req, secret)

  if (!isValidSignature) {
    return new Response(JSON.stringify({ message: 'Invalid signature' }), { status: 401 })
  }

  if (!body?._type) {
    return new Response(JSON.stringify({ message: 'Missing _type' }), { status: 400 })
  }

  const targets = getTargetsForDocument(body)
  for (const { path, type } of targets) {
    if (type === 'layout') {
      revalidatePath(path, 'layout')
    } else {
      revalidatePath(path)
    }
  }

  return NextResponse.json({ body, targets })
}
