import { inngest } from '../client'
import { captureServerEvent } from '@/lib/posthog-server'
import { getPublicSiteUrl } from '@/lib/site-url'
import { featureProperties } from '@/lib/experiments'
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
        `Lead pipeline failed after retries: ${error.message}\nFrom: ${lead.name} <${lead.email}>${lead.path ? `\nPage: ${lead.path}` : ''}`
      )
    },
  },
  async ({ event, step }) => {
    const lead = event.data as Lead

    const attio = await step.run('attio-upsert-person', () => upsertAttioPerson(lead))

    // One join key across systems: PostHog persons are keyed by lowercased
    // email (the client identify lowercases), so the server event must too,
    // or Mixed@Case.com becomes a second person.
    const distinctId = lead.email.trim().toLowerCase()

    if (attio.recordId) {
      await step.run('attio-timeline-note', () =>
        createAttioLeadNote(attio.recordId!, lead)
      )
    }

    await step.run('posthog-server-event', () =>
      captureServerEvent('lead_submitted', distinctId, {
        path: lead.path,
        form_name: lead.formName,
        form_title: lead.formTitle,
        marketing_opt_in: lead.marketingOptIn,
        // $current_url is what PostHog's URL/Screen column reads
        ...(lead.path && {
          $current_url: `${getPublicSiteUrl().replace(/\/+$/, '')}${lead.path}`,
        }),
        crm_synced: Boolean(attio.recordId),
        // The variant rides with the conversion, recorded server side
        ...featureProperties(lead.experiments ?? {}),
        // Person properties, so the profile is filled in even when browser
        // consent was denied and the client never identified. The Attio
        // record id is the bridge: PostHog stays keyed by email, but every
        // person carries the CRM id that Customer.io also uses, so one human
        // is one hop away in any system.
        $set: {
          email: distinctId,
          name: lead.name,
          ...(attio.recordId && { attio_record_id: attio.recordId }),
        },
      })
    )

    // Lifecycle lane: identify + event so Customer.io journeys can trigger
    // The CRM record id becomes the Customer.io person id, so one human stays
    // one person across both even if their email changes later.
    const customerio = await step.run('customerio-track', () =>
      trackLeadInCustomerio(lead, attio.recordId)
    )

    // Instant heads-up in Slack for every lead (same webhook as failure alerts).
    // Runs before the email step so a broken email lane can't suppress the ping.
    await step.run('slack-new-lead-ping', () =>
      sendSlackAlert(
        `New lead${lead.formTitle || lead.formName ? ` via ${lead.formTitle || lead.formName}` : ''}: ${lead.name} <${lead.email}>${lead.path ? `\nPage: ${lead.path}` : ''}${
          typeof lead.marketingOptIn === 'boolean'
            ? `\nOpt-in: ${lead.marketingOptIn ? 'yes' : 'no'}`
            : ''
        }`
      )
    )

    const email = await step.run('resend-notification', () => sendLeadNotification(lead))

    return { attio, customerio, email }
  }
)
