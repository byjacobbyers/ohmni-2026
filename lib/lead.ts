import * as React from 'react'
import { Resend } from 'resend'
import { EmailTemplate } from '@/components/email-template'

export type Lead = {
  name?: string
  email?: string
  message: string
  isAnonymous?: boolean
  path?: string
  submittedAt: string
}

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
  const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL ?? 'Ohmni <no-reply@example.com>'
  const replyToDefault = process.env.CONTACT_FORM_REPLY_TO ?? 'no-reply@example.com'

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: recipients,
    replyTo: lead.isAnonymous || !lead.email ? replyToDefault : lead.email,
    subject: lead.isAnonymous
      ? 'Ohmni - Anonymous Contact Form Submission'
      : `Ohmni - Contact Form Submission from ${lead.name}`,
    react: EmailTemplate({
      name: lead.isAnonymous ? undefined : lead.name,
      email: lead.isAnonymous ? undefined : lead.email,
      message: lead.message,
      isAnonymous: Boolean(lead.isAnonymous),
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
  if (!lead.email) return { skipped: 'anonymous lead, no email to match on' }

  const [firstName, ...rest] = (lead.name || '').trim().split(/\s+/)
  const res = await fetch(
    `${ATTIO_BASE}/objects/people/records?matching_attribute=email_addresses`,
    {
      method: 'PUT',
      headers: attioHeaders(),
      body: JSON.stringify({
        data: {
          values: {
            email_addresses: [{ email_address: lead.email }],
            ...(lead.name
              ? {
                  name: [
                    {
                      first_name: firstName,
                      last_name: rest.join(' ') || firstName,
                      full_name: lead.name,
                    },
                  ],
                }
              : {}),
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

/** Attaches the form message to the person's timeline as a note. */
export async function createAttioLeadNote(recordId: string, lead: Lead) {
  if (!process.env.ATTIO_API_KEY) return { skipped: 'ATTIO_API_KEY not set' }

  const res = await fetch(`${ATTIO_BASE}/notes`, {
    method: 'POST',
    headers: attioHeaders(),
    body: JSON.stringify({
      data: {
        parent_object: 'people',
        parent_record_id: recordId,
        title: `Website contact form${lead.path ? ` (${lead.path})` : ''}`,
        format: 'plaintext',
        content: lead.message,
      },
    }),
  })
  if (!res.ok) {
    throw new Error(`Attio note failed: ${res.status} ${await res.text()}`)
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
