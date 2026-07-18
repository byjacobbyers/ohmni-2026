export type EmailTemplateProps = {
  name?: string
  email?: string
  /** Shown only for anonymous submissions (no name/email to display) */
  message?: string
  isAnonymous: boolean
  /** Friendly form label for the heading, e.g. "Free Audit" */
  formLabel?: string
}
