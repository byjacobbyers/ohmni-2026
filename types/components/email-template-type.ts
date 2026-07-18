export type EmailTemplateProps = {
  name: string
  email: string
  /** Friendly form label for the heading, e.g. "Free Audit" */
  formLabel?: string
  path?: string
  marketingOptIn?: boolean
  fields?: Record<string, string>
}
