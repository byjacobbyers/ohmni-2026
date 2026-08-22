import { groq } from 'next-sanity'

/**
 * Running experiments, shaped for proxy.ts. Fetched raw from the CDN (no
 * stega, no client) because the proxy runs at the edge.
 */
export const runningExperimentsQuery = groq`*[_type == "experiment" && status == "running"] {
  "key": key.current,
  pathname,
  variants[] { key, weight, "slug": page->slug.current }
}`
