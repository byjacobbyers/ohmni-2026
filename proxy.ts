import { NextResponse, type NextRequest } from 'next/server'
import {
  COOKIE_MAX_AGE,
  COOKIE_PREFIX,
  findExperiment,
  isBot,
  parseOverride,
  pickVariant,
  type Experiment,
} from '@/lib/experiments'

type Redirect = { source: string; destination: string; permanent?: boolean }

// ponytail: per-instance in-memory cache with 60s TTL; a CMS redirect takes
// effect within a minute without a deploy. Move to Vercel Edge Config if
// per-request latency or instance fan-out ever matters.
let cache: { map: Map<string, Redirect>; fetchedAt: number } | null = null
let experimentCache: { list: Experiment[]; fetchedAt: number } | null = null
const TTL_MS = 60_000

const sanityCdn = () => {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  return projectId && dataset
    ? `https://${projectId}.apicdn.sanity.io/v2025-02-19/data/query/${dataset}`
    : null
}

// Same shape as the redirects: one small fetch, cached per instance for a
// minute, so flipping an experiment to "running" in Studio takes effect
// without a deploy.
async function getExperiments(): Promise<Experiment[]> {
  if (experimentCache && Date.now() - experimentCache.fetchedAt < TTL_MS) return experimentCache.list
  let list: Experiment[] = []
  const base = sanityCdn()
  if (base) {
    try {
      const query = encodeURIComponent(
        '*[_type == "experiment" && status == "running"]{"key": key.current, pathname, variants[]{key, weight, "slug": page->slug.current}}'
      )
      const res = await fetch(`${base}?query=${query}`)
      if (res.ok) {
        const { result } = (await res.json()) as { result?: Experiment[] }
        list = (result || []).filter((e) => e?.key && e?.pathname && Array.isArray(e.variants))
      }
    } catch {
      // Sanity unreachable: serve the original page rather than failing
    }
  }
  experimentCache = { list, fetchedAt: Date.now() }
  return list
}

/**
 * Sticky, cookie-based assignment. The URL never changes; a variant is a
 * rewrite to its page slug. Draft mode and crawlers are left alone.
 */
async function applyExperiment(request: NextRequest): Promise<NextResponse | null> {
  if (request.cookies.has('__prerender_bypass') || isBot(request.headers.get('user-agent'))) return null
  const experiments = await getExperiments()
  if (experiments.length === 0) return null

  const experiment = findExperiment(experiments, request.nextUrl.pathname)
  if (!experiment) return null

  const cookieName = `${COOKIE_PREFIX}${experiment.key}`
  const override = parseOverride(request.nextUrl.searchParams)
  const existing = request.cookies.get(cookieName)?.value
  const known = (k?: string) => experiment.variants.find((v) => v.key === k)

  let chosen = override.reset ? undefined : known(override.variant) ?? known(existing)
  const fresh = !chosen
  if (!chosen) chosen = pickVariant(experiment, Math.random())

  const original = experiment.variants[0]
  const url = request.nextUrl.clone()
  url.searchParams.delete('ab')
  let response: NextResponse
  if (override.variant || override.reset) {
    // Set the cookie, then bounce to the clean URL. The follow-up request is
    // assigned from the cookie like any other, so the bar never shows ?ab=.
    response = NextResponse.redirect(url, 307)
  } else if (chosen.slug && chosen.key !== original.key) {
    url.pathname = `/${chosen.slug}`
    response = NextResponse.rewrite(url)
  } else {
    response = NextResponse.next()
  }
  if (fresh || override.variant || override.reset) {
    response.cookies.set(cookieName, chosen.key, {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
    })
  }
  response.headers.set('x-experiment', `${experiment.key}=${chosen.key}`)
  return response
}

const stripTrailingSlash = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p)

async function getRedirects(): Promise<Map<string, Redirect>> {
  if (cache && Date.now() - cache.fetchedAt < TTL_MS) return cache.map

  const map = new Map<string, Redirect>()
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

  if (projectId && dataset) {
    try {
      const query = encodeURIComponent('*[_type == "redirect"]{source, destination, permanent}')
      const res = await fetch(
        `https://${projectId}.apicdn.sanity.io/v2025-02-19/data/query/${dataset}?query=${query}`
      )
      if (res.ok) {
        const { result } = (await res.json()) as { result?: Redirect[] }
        for (const r of result || []) {
          if (r?.source && r?.destination) map.set(stripTrailingSlash(r.source), r)
        }
      }
    } catch {
      // Sanity unreachable: serve without redirects rather than failing requests
    }
  }

  cache = { map, fetchedAt: Date.now() }
  return map
}

export async function proxy(request: NextRequest) {
  const redirects = await getRedirects()
  const hit = redirects.get(stripTrailingSlash(request.nextUrl.pathname))
  if (!hit) return (await applyExperiment(request)) ?? NextResponse.next()

  const destination = hit.destination.startsWith('http')
    ? hit.destination
    : new URL(hit.destination, request.url)
  return NextResponse.redirect(destination, hit.permanent === false ? 307 : 308)
}

export const config = {
  // Pages only: skip Next internals, API routes, the studio, the PostHog
  // relay, and any path with a file extension.
  matcher: ['/((?!api|_next|studio|relay-oh|.*\\..*).*)'],
}
