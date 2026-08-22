import { inngest, isInngestConfigured } from '@/lib/inngest/client'
import { sendLeadNotification, type Lead } from '@/lib/lead'
import { parseLeadSubmit } from '@/lib/lead-validation'
import { clientIpFromHeaders, rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = clientIpFromHeaders(request.headers)
    const limited = rateLimit(`lead:${ip}`, { limit: 8, windowMs: 60_000 })
    if (!limited.ok) {
      return Response.json(
        { error: 'Too many requests. Please try again shortly.' },
        {
          status: 429,
          headers: { 'Retry-After': String(limited.retryAfterSec) },
        }
      )
    }

    const body = await request.json()
    const parsed = parseLeadSubmit(body)

    if (!parsed.ok) {
      return Response.json({ error: parsed.error }, { status: 400 })
    }

    if (parsed.honeypot) {
      // Silent 200 for bots, but never silent in the logs: a filled honeypot
      // on a real submit is exactly how legitimate leads go missing.
      console.warn('[API Send] honeypot tripped, lead discarded', { ip })
      return Response.json({ success: true })
    }

    const { name, email, path, lang, formName, formTitle, marketingOptIn, fields, experiments } = parsed.data
    const lead: Lead = {
      name,
      email,
      path: path?.slice(0, 200),
      lang,
      formName,
      formTitle: formTitle?.slice(0, 120),
      marketingOptIn,
      fields: fields && Object.keys(fields).length > 0 ? fields : undefined,
      experiments: experiments && Object.keys(experiments).length > 0 ? experiments : undefined,
      submittedAt: new Date().toISOString(),
    }

    if (isInngestConfigured()) {
      try {
        await inngest.send({ name: 'lead/submitted', data: lead })
        return Response.json({ success: true })
      } catch (err) {
        console.error('[API Send] Inngest send failed, falling back to direct email:', err)
      }
    }

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
