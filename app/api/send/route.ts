import { inngest, isInngestConfigured } from '@/lib/inngest/client'
import { sendLeadNotification, type Lead } from '@/lib/lead'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message, isAnonymous, website, path } = body

    // Honeypot: pretend success
    if (website && website.trim().length > 0) {
      return Response.json({ success: true })
    }

    if (!message || message.trim().length === 0) {
      return Response.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!isAnonymous) {
      if (!name || name.trim().length === 0) {
        return Response.json(
          { error: 'Name is required when not sending anonymously' },
          { status: 400 }
        )
      }
      if (!email || email.trim().length === 0) {
        return Response.json(
          { error: 'Email is required when not sending anonymously' },
          { status: 400 }
        )
      }
      const emailRegex = /\S+@\S+\.\S+/
      if (!emailRegex.test(email)) {
        return Response.json(
          { error: 'Please enter a valid email address' },
          { status: 400 }
        )
      }
    }

    const lead: Lead = {
      name: isAnonymous ? undefined : name,
      email: isAnonymous ? undefined : email,
      message: message.trim(),
      isAnonymous: Boolean(isAnonymous),
      path: typeof path === 'string' ? path.slice(0, 200) : undefined,
      submittedAt: new Date().toISOString(),
    }

    // Preferred path: hand off to the Inngest pipeline (CRM upsert, PostHog
    // server event, notification email as a step) and respond fast.
    if (isInngestConfigured()) {
      try {
        await inngest.send({ name: 'lead/submitted', data: lead })
        return Response.json({ success: true })
      } catch (err) {
        // Inngest unreachable (e.g. dev server not running): degrade to email
        console.error('[API Send] Inngest send failed, falling back to direct email:', err)
      }
    }

    // Fallback (no Inngest keys): direct email-only path, original behavior.
    const result = await sendLeadNotification(lead)
    if ('skipped' in result && result.skipped) {
      console.error(`[API Send] ${result.skipped}`)
      return Response.json({ error: 'Server configuration error' }, { status: 500 })
    }
    return Response.json({ success: true, data: result })
  } catch (error) {
    console.error('API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
