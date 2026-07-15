/**
 * Brand configuration (BUILD-PLAN Task 7).
 *
 * Every client-specific string the template ships. Onboarding a client means
 * editing this file (plus env vars, globals.css @theme, and app/(site)/fonts.ts
 * for colors and type, which stay in their native homes until the stage-3
 * token architecture).
 *
 * Each field documents the client-intake question that populates it; this
 * schema becomes the phase-3 questionnaire output.
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
