import * as React from 'react'
import { Resend } from 'resend'
import { EmailTemplate } from '@/components/email-template'
import { brand } from '@/lib/brand'

export type Lead = {
  name: string
  email: string
  path?: string
  /** Which form sent it (e.g. 'contact', 'split-form'); campaign filters key on this */
  formName?: string
  submittedAt: string
}

/** Friendly names per form for notification subjects and headings. */
const FORM_LABELS: Record<string, string> = {
  'split-form': 'Free Audit',
  contact: 'Contact Form',
}

const formLabel = (lead: Lead) =>
  FORM_LABELS[lead.formName || ''] || FORM_LABELS.contact

/** Sends the internal notification email. Throws on Resend errors so callers can retry/alert. */
export async function sendLeadNotification(lead: Lead) {
  if (!process.env.RESEND_API_KEY) {
    return { skipped: 'RESEND_API_KEY not set' }
  }

  const recipients =
    process.env.CONTACT_FORM_RECIPIENT_EMAIL?.split(',').map((e) => e.trim()) ?? []
  if (recipients.length === 0) {
    return { skipped: 'CONTACT_FORM_RECIPIENT_EMAIL not set' }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL ?? brand.emailFrom

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: recipients,
    replyTo: lead.email,
    subject: `${brand.emailSubjectPrefix} - ${formLabel(lead)} Submission from ${lead.name}`,
    react: EmailTemplate({
      name: lead.name,
      email: lead.email,
      formLabel: formLabel(lead),
    }) as React.ReactElement,
  })

  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`)
  return { id: data?.id }
}

const ATTIO_BASE = 'https://api.attio.com/v2'

function attioHeaders() {
  return {
    Authorization: `Bearer ${process.env.ATTIO_API_KEY}`,
    'Content-Type': 'application/json',
  }
}

/** Upserts a person by email. Returns the Attio record id, or a skip marker without a key. */
export async function upsertAttioPerson(lead: Lead): Promise<{ recordId?: string; skipped?: string }> {
  if (!process.env.ATTIO_API_KEY) return { skipped: 'ATTIO_API_KEY not set' }

  const [firstName, ...rest] = lead.name.trim().split(/\s+/)
  const res = await fetch(
    `${ATTIO_BASE}/objects/people/records?matching_attribute=email_addresses`,
    {
      method: 'PUT',
      headers: attioHeaders(),
      body: JSON.stringify({
        data: {
          values: {
            email_addresses: [{ email_address: lead.email }],
            name: [
              {
                first_name: firstName,
                last_name: rest.join(' ') || firstName,
                full_name: lead.name,
              },
            ],
          },
        },
      }),
    }
  )
  if (!res.ok) {
    throw new Error(`Attio upsert failed: ${res.status} ${await res.text()}`)
  }
  const json = (await res.json()) as { data?: { id?: { record_id?: string } } }
  return { recordId: json.data?.id?.record_id }
}

/** Attaches a submission note to the person's timeline. */
export async function createAttioLeadNote(recordId: string, lead: Lead) {
  if (!process.env.ATTIO_API_KEY) return { skipped: 'ATTIO_API_KEY not set' }

  const parts = [
    `Website form submission${lead.formName ? ` (${lead.formName})` : ''}`,
    lead.path ? `Page: ${lead.path}` : null,
    `Submitted: ${lead.submittedAt}`,
  ].filter(Boolean)

  const res = await fetch(`${ATTIO_BASE}/notes`, {
    method: 'POST',
    headers: attioHeaders(),
    body: JSON.stringify({
      data: {
        parent_object: 'people',
        parent_record_id: recordId,
        title: `Website contact form${lead.path ? ` (${lead.path})` : ''}`,
        format: 'plaintext',
        content: parts.join('\n'),
      },
    }),
  })
  if (!res.ok) {
    throw new Error(`Attio note failed: ${res.status} ${await res.text()}`)
  }
  return { ok: true }
}

const customerioBase = () =>
  process.env.CUSTOMERIO_REGION === 'eu'
    ? 'https://track-eu.customer.io'
    : 'https://track.customer.io'

function customerioAuth() {
  const basic = Buffer.from(
    `${process.env.CUSTOMERIO_SITE_ID}:${process.env.CUSTOMERIO_TRACK_API_KEY}`
  ).toString('base64')
  return { Authorization: `Basic ${basic}`, 'Content-Type': 'application/json' }
}

/**
 * Identifies the lead in Customer.io and fires a lead_submitted event so
 * journeys (e.g. the welcome sequence) can trigger on it. Keys unset -> no-op.
 */
export async function trackLeadInCustomerio(lead: Lead) {
  if (!process.env.CUSTOMERIO_SITE_ID || !process.env.CUSTOMERIO_TRACK_API_KEY) {
    return { skipped: 'Customer.io Track API keys not set' }
  }

  const id = encodeURIComponent(lead.email)

  const identify = await fetch(`${customerioBase()}/api/v1/customers/${id}`, {
    method: 'PUT',
    headers: customerioAuth(),
    body: JSON.stringify({
      email: lead.email,
      name: lead.name,
    }),
  })
  if (!identify.ok) {
    throw new Error(`Customer.io identify failed: ${identify.status} ${await identify.text()}`)
  }

  const track = await fetch(`${customerioBase()}/api/v1/customers/${id}/events`, {
    method: 'POST',
    headers: customerioAuth(),
    body: JSON.stringify({
      name: 'lead_submitted',
      data: {
        ...(lead.path && { path: lead.path }),
        ...(lead.formName && { form_name: lead.formName }),
      },
    }),
  })
  if (!track.ok) {
    throw new Error(`Customer.io event failed: ${track.status} ${await track.text()}`)
  }
  return { ok: true }
}

/** Posts a failure alert to Slack. No webhook configured -> no-op. */
export async function sendSlackAlert(text: string) {
  const webhook = process.env.SLACK_ALERT_WEBHOOK_URL
  if (!webhook) return { skipped: 'SLACK_ALERT_WEBHOOK_URL not set' }
  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  return { ok: true }
}
