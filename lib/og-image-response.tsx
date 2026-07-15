import { ImageResponse } from 'next/og'
import type { SanityImageSource } from '@/types/components/sanity-image-type'
import { loadOgFonts } from '@/lib/og-fonts'
import { OG_BRAND_PRIMARY, ogSurfaceColors, normalizeOgSurface } from '@/lib/og-palette'
import { hasPortableHeading, renderSimpleTextForOg } from '@/lib/og-simple-text'
import { cleanStega } from '@/lib/stega'
import { getPublicSiteUrl } from '@/lib/site-url'
import { brand } from '@/lib/brand'

function absolutePublicFile(path: string): string {
  const base = getPublicSiteUrl().replace(/\/+$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

export type OgRouteDoc = {
  title?: string
  seo?: {
    metaTitle?: string
    ogImageHeading?: unknown
    ogImageBackground?: string
    shareGraphic?: SanityImageSource
  }
}

export type OgRouteSite = {
  title?: string
  organizationJsonLd?: { name?: string }
  seo?: {
    metaTitle?: string
    ogImageHeading?: unknown
    ogImageBackground?: string
    shareGraphic?: SanityImageSource
  }
}

/** Plain OG heading when autoShareImage has no portable text: document title first, then SEO/site fallbacks. */
function resolvePlainHeading(doc: OgRouteDoc | null, site: OgRouteSite | null): string {
  const pageTitle = cleanStega(doc?.title || '')
  if (pageTitle) return pageTitle
  const meta = cleanStega(doc?.seo?.metaTitle || site?.seo?.metaTitle || '')
  if (meta) return meta
  return (
    cleanStega(site?.organizationJsonLd?.name || '') ||
    cleanStega(site?.title || '') ||
    brand.name
  )
}

function firstPortableHeading(doc: OgRouteDoc | null, site: OgRouteSite | null): unknown {
  if (hasPortableHeading(doc?.seo?.ogImageHeading)) return doc?.seo?.ogImageHeading
  if (hasPortableHeading(site?.seo?.ogImageHeading)) return site?.seo?.ogImageHeading
  return null
}

function truncateHeading(text: string, max = 88): string {
  const t = text.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

/** Matches [`components/header/index.tsx`](components/header/index.tsx) wordmark (not scroll ring). */
function OgBrandFooter({ textColor }: { textColor: string }) {
  const logoUrl = absolutePublicFile('/ohmni.svg')
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        marginTop: 8,
      }}
    >
      <div style={{ width: '100%', height: 4, backgroundColor: OG_BRAND_PRIMARY }} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 18,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- OG ImageResponse requires img URL */}
        <img
          src={logoUrl}
          alt=""
          width={56}
          height={56}
          style={{ objectFit: 'contain', flexShrink: 0 }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 14,
            lineHeight: 1,
            color: textColor,
          }}
        >
          <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: -0.02 }}>OHMNI</span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 400,
              textTransform: 'uppercase',
              paddingBottom: 3,
            }}
          >
            Web Technologies
          </span>
        </div>
      </div>
    </div>
  )
}

export type CreateOgImageOptions = {
  doc: OgRouteDoc | null
  site: OgRouteSite | null
  /** Studio: current form portable text wins when it has content */
  headingPortableOverride?: unknown
  backgroundOverride?: string | null
}

export async function createOgImageResponse({
  doc,
  site,
  headingPortableOverride,
  backgroundOverride,
}: CreateOgImageOptions): Promise<ImageResponse> {
  const surface = normalizeOgSurface(
    backgroundOverride ?? doc?.seo?.ogImageBackground ?? site?.seo?.ogImageBackground ?? 'primary'
  )
  const colors = ogSurfaceColors(surface)

  const portableFromForm = hasPortableHeading(headingPortableOverride) ? headingPortableOverride : null
  const portableFromCms = firstPortableHeading(doc, site)
  const portableRaw = portableFromForm ?? portableFromCms

  const richHeading = portableRaw
    ? renderSimpleTextForOg(portableRaw, { color: colors.color, maxChars: 160 })
    : null
  const plainHeading = truncateHeading(resolvePlainHeading(doc, site))
  const useRichHeading = Boolean(richHeading)
  const headingContent = useRichHeading ? richHeading : plainHeading

  const loaded = await loadOgFonts()
  const fonts = loaded.length > 0 ? loaded : undefined

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 56,
          background: colors.background,
          color: colors.color,
          fontFamily: 'Roboto',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          {useRichHeading ? (
            headingContent
          ) : (
            <div
              style={{
                fontSize: 78,
                fontWeight: 700,
                lineHeight: 1.08,
              }}
            >
              {headingContent}
            </div>
          )}
        </div>
        <OgBrandFooter textColor={colors.color} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fonts ? { fonts } : {}),
    }
  )
}
