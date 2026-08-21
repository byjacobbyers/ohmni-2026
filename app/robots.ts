import { MetadataRoute } from 'next'
import { brand } from '@/lib/brand'

function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

/**
 * Production builds should set NEXT_PUBLIC_SITE_URL to the canonical site origin.
 * Fallback avoids localhost in non-dev builds when the env is missing.
 */
const baseUrl = normalizeBaseUrl(
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_SITE_URL || brand.fallbackSiteUrl
)

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // Deliberate: AI crawlers (GPTBot, ClaudeBot, PerplexityBot, et al) are
      // allowed. AI-search visibility is the point; see AEO-AUDIT.md. Add
      // per-bot disallow rules here only for content-licensing engagements.
      userAgent: '*',
      allow: '/',
      disallow: ['/api/*', '/studio/*', '/present/*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
