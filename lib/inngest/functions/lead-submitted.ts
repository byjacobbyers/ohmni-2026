import { inngest } from '../client'
import { captureServerEvent } from '@/lib/posthog-server'
import { getPublicSiteUrl } from '@/lib/site-url'
import {
  createAttioLeadNote,
  sendLeadNotification,
  sendSlackAlert,
  trackLeadInCustomerio,
  upsertAttioPerson,
  type Lead,
} from '@/lib/lead'

/**
 * The speed-to-lead pipeline (BUILD-PLAN Task 2). CRM is the system of record;
 * email is a notification step. Each step retries independently; exhausted
 * retries alert Slack via onFailure.
 */
export const leadSubmitted = inngest.createFunction(
  {
    id: 'lead-submitted',
    triggers: [{ event: 'lead/submitted' }],
    onFailure: async ({ event, error }) => {
      const lead = event.data.event.data as Lead
      await sendSlackAlert(
        `Lead pipeline failed after retries: ${error.message}\nFrom: ${lead.name || 'Anonymous'} <${lead.email || 'no email'}>\nMessage: ${lead.message.slice(0, 300)}`
      )
    },
  },
  async ({ event, step }) => {
    const lead = event.data as Lead

    const attio = await step.run('attio-upsert-person', () => upsertAttioPerson(lead))

    if (attio.recordId) {
      await step.run('attio-timeline-note', () =>
        createAttioLeadNote(attio.recordId!, lead)
      )
    }

    await step.run('posthog-server-event', () =>
      captureServerEvent('lead_submitted', lead.email || `anonymous-${event.id}`, {
        is_anonymous: Boolean(lead.isAnonymous),
        path: lead.path,
        form_name: lead.formName,
        // $current_url is what PostHog's URL/Screen column reads
        ...(lead.path && {
          $current_url: `${getPublicSiteUrl().replace(/\/+$/, '')}${lead.path}`,
        }),
        crm_synced: Boolean(attio.recordId),
      })
    )

    // Lifecycle lane: identify + event so Customer.io journeys can trigger
    const customerio = await step.run('customerio-track', () => trackLeadInCustomerio(lead))

    // Instant heads-up in Slack for every lead (same webhook as failure alerts).
    // Runs before the email step so a broken email lane can't suppress the ping.
    await step.run('slack-new-lead-ping', () =>
      sendSlackAlert(
        `New lead${lead.formName ? ` via ${lead.formName}` : ''}: ${lead.name || 'Anonymous'} <${lead.email || 'no email'}>${lead.path ? `\nPage: ${lead.path}` : ''}\n${lead.message.slice(0, 300)}`
      )
    )

    const email = await step.run('resend-notification', () => sendLeadNotification(lead))

    return { attio, customerio, email }
  }
)
