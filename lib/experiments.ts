/**
 * Edge-side A/B assignment, kept pure so it can be unit tested and so
 * proxy.ts stays a thin caller.
 */
export type ExperimentVariant = { key: string; weight: number; slug: string }
export type Experiment = { key: string; pathname: string; variants: ExperimentVariant[] }

export const COOKIE_PREFIX = 'ab_'
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/** Crawlers see the canonical page and never get a bucket. */
const BOT_UA = /bot|crawl|spider|slurp|facebookexternalhit|preview|headlesschrome|lighthouse/i
export const isBot = (userAgent: string | null | undefined) => !!userAgent && BOT_UA.test(userAgent)

const stripTrailing = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p)

export function findExperiment(experiments: Experiment[], pathname: string): Experiment | undefined {
  const path = stripTrailing(pathname)
  return experiments.find((e) => stripTrailing(e.pathname) === path && e.variants.length >= 2)
}

/** Deterministic given `roll` in [0,1), so the pick is testable. */
export function pickVariant(experiment: Experiment, roll: number): ExperimentVariant {
  const total = experiment.variants.reduce((n, v) => n + v.weight, 0) || 1
  let acc = 0
  for (const v of experiment.variants) {
    acc += v.weight / total
    if (roll < acc) return v
  }
  return experiment.variants[experiment.variants.length - 1]
}

/** `?ab=b` forces a variant, `?ab=reset` clears the cookie. */
export function parseOverride(search: URLSearchParams): { variant?: string; reset?: boolean } {
  const v = search.get('ab')
  if (!v) return {}
  if (v === 'reset') return { reset: true }
  return /^[a-z0-9]+$/.test(v) ? { variant: v } : {}
}

/** Parse `ab_*` cookies from a document.cookie style string into { key: variant }. */
export function parseAssignments(cookieHeader: string | null | undefined): Record<string, string> {
  const out: Record<string, string> = {}
  for (const part of (cookieHeader ?? '').split(';')) {
    const [rawName, ...rest] = part.split('=')
    const name = rawName?.trim()
    if (!name?.startsWith(COOKIE_PREFIX)) continue
    const value = rest.join('=').trim()
    if (/^[a-z0-9]+$/.test(value)) out[name.slice(COOKIE_PREFIX.length)] = value
  }
  return out
}

/** Super properties for PostHog: `$feature/<key>` so its experiment UI can read them. */
export function featureProperties(assignments: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(assignments).map(([k, v]) => [`$feature/${k}`, v]))
}
