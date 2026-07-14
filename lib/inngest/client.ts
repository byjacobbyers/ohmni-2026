import { Inngest } from 'inngest'

export const inngest = new Inngest({ id: 'ohmni' })

/**
 * The pipeline runs when Inngest can actually receive events:
 * production needs keys; local dev auto-connects to `npx inngest-cli dev`.
 * Otherwise /api/send falls back to the direct email-only path.
 */
export const isInngestConfigured = () =>
  process.env.NODE_ENV === 'development' ||
  Boolean(process.env.INNGEST_EVENT_KEY && process.env.INNGEST_SIGNING_KEY)
