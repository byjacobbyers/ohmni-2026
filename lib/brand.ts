/**
 * Brand configuration: the single home for site-identity strings.
 * Colors and type live in globals.css @theme and app/(site)/fonts.ts.
 *
 * Runtime UI/SEO should prefer Site Settings via {@link resolveBrand}, and
 * fall back to these values when CMS fields are empty or unavailable.
 */
export const brand = {
  /** "What is the company's public name?" Used in titles, JSON-LD fallbacks, header/footer. */
  name: 'Ohmni',

  /** "Tagline shown next to the logo in the header?" */
  tagline: 'Web Technologies',

  /** "One-sentence company description?" Default meta description when a page has none. */
  description: 'Ohmni',

  /** "Suffix appended to page titles in search results?" Include the separator. */
  titleSuffix: ' :: Ohmni',

  /**
   * "Production domain (https://, no trailing slash)?" Fallback only:
   * NEXT_PUBLIC_SITE_URL wins everywhere at runtime.
   */
  fallbackSiteUrl: 'https://www.ohmni.com',

  /**
   * "From address for transactional email?" Must be on a Resend-verified
   * domain. Fallback only: CONTACT_FORM_FROM_EMAIL wins.
   */
  emailFrom: 'Ohmni <no-reply@ohmni.tech>',

  /** "Prefix for contact-form notification subject lines?" */
  emailSubjectPrefix: 'Ohmni',
} as const

/** Minimal site shape used to override {@link brand} at runtime. */
export type BrandSiteInput = {
  altTitle?: string | null
  tagline?: string | null
  seo?: { metaDesc?: string | null } | null
}

export type ResolvedBrand = {
  name: string
  tagline: string
  description: string
  /** Always derived as ` :: ${name}` */
  titleSuffix: string
}

function clean(value?: string | null): string {
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * Prefer Site Settings (Brand Name / Tagline / SEO Meta Description), then
 * {@link brand}. Safe to call with null/undefined when Sanity is unavailable.
 */
export function resolveBrand(site?: BrandSiteInput | null): ResolvedBrand {
  const name = clean(site?.altTitle) || brand.name
  const tagline = clean(site?.tagline) || brand.tagline
  const description = clean(site?.seo?.metaDesc) || brand.description
  return {
    name,
    tagline,
    description,
    titleSuffix: ` :: ${name}`,
  }
}
