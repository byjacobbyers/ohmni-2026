import { createOgImageResponse, type OgRouteSite } from '@/lib/og-image-response'
import { titleAsSimpleTextH2 } from '@/lib/og-simple-text'
import { getOgSanityClient } from '@/sanity/lib/og-sanity-client'
import { groq } from 'next-sanity'

export const runtime = 'edge'
export const alt = 'Ohmni design system'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const siteQuery = groq`*[_type == "site"][0] {
  title,
  altTitle,
  tagline,
  organizationJsonLd { name },
  seo { metaTitle, metaDesc, "ogImageBackground": coalesce(autoShareImage.background, ogImageBackground) }
}`

export default async function Image() {
  let site: OgRouteSite | null = null
  try {
    site = await getOgSanityClient().fetch<OgRouteSite>(siteQuery)
  } catch {
    // brand falls back to lib/brand defaults
  }

  return createOgImageResponse({
    doc: null,
    site,
    headingPortableOverride: titleAsSimpleTextH2('Design system'),
  })
}
