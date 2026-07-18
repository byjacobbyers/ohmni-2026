/**
 * Brand configuration: the single home for site-identity strings.
 * Colors and type live in globals.css @theme and app/(site)/fonts.ts.
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
  emailFrom: 'Ohmni <no-reply@example.com>',

  /** "Prefix for contact-form notification subject lines?" */
  emailSubjectPrefix: 'Ohmni',
} as const
