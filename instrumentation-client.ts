import posthog from 'posthog-js'
import { featureProperties, parseAssignments } from '@/lib/experiments'
import { identifyStoredVisitor } from '@/lib/gtm'

// Client-side PostHog init (Next.js instrumentation-client convention).
// No key -> analytics silently off; the template works without an account.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY

if (key) {
  posthog.init(key, {
    // First-party proxy (see rewrites in next.config.ts) so capture survives ad blockers
    api_host: '/relay-oh',
    ui_host: 'https://us.posthog.com',
    defaults: '2026-05-30',
    // Consent-gated: opted out until the cookie banner grants analytics_storage
    // (updateConsentMode in lib/gtm.ts flips it, including for saved consent on load).
    opt_out_capturing_by_default: true,
    // ponytail: replay recording left on library defaults; configure sampling and
    // billing caps in the PostHog project settings per the MarTech stack report.
  })

  // Experiment assignment lives in ab_* cookies set at the edge. Registering it
  // as $feature/<key> puts the variant on every event, including the first
  // $pageview, and lets PostHog's experiment UI read our assignment as its own.
  // A property, not a capture: consent still gates whether anything is sent.
  const assignments = parseAssignments(document.cookie)
  if (Object.keys(assignments).length > 0) posthog.register(featureProperties(assignments))

  // A browser that already told us who it is (form submit persisted the email)
  // identifies before the first pageview flushes, so events ingest with the
  // person state and the Activity feed shows the email rather than the UUID.
  // A returning consented visitor is already opted in from persistence at this
  // point; anyone opted out makes this a no-op, so consent still holds.
  identifyStoredVisitor()
}
