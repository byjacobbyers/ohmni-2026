import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { clientIpFromHeaders, rateLimit } from '@/lib/rate-limit'

/**
 * Translate a list of strings. Pure text in, text out: nothing is written to
 * Sanity here, so the worst an abuser can do is spend a few cents. Hence the
 * gate is same-origin plus a rate limit, not a login.
 */
const Body = z.object({
  strings: z.array(z.object({ path: z.string().max(300), text: z.string().max(4000) })).max(2000),
  target: z.literal('es'),
})

const MODEL = process.env.TRANSLATE_MODEL || 'claude-sonnet-5'

const SYSTEM = `You translate website copy from English to Spanish for Ohmni, a B2B marketing technology consultancy. Neutral, professional Latin American Spanish, "tú" register, plain declarative voice. Keep product names, brand names, tool names (HubSpot, Vercel, Sanity, PostHog, Inngest, Attio, Customer.io, Deepgram), URLs, numbers, currency and code untouched. Keep leading and trailing whitespace exactly as in the source, because strings are fragments of rich text that will be rejoined. Never use em dashes or en dashes. Return only JSON: an object whose keys are the input paths and whose values are the translations.`

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return new Response('ANTHROPIC_API_KEY is not set', { status: 503 })

  const site = request.headers.get('sec-fetch-site')
  if (site && site !== 'same-origin') return new Response('Forbidden', { status: 403 })

  const limited = rateLimit(`translate:${clientIpFromHeaders(request.headers)}`, { limit: 20, windowMs: 60 * 60 * 1000 })
  if (!limited.ok) return new Response('Too many requests', { status: 429 })

  const parsed = Body.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return new Response('Bad request', { status: 400 })
  const { strings } = parsed.data
  if (strings.length === 0) return NextResponse.json({ translations: {} })

  const input = Object.fromEntries(strings.map((s) => [s.path, s.text]))
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 16000,
      system: SYSTEM,
      messages: [{ role: 'user', content: JSON.stringify(input) }],
    }),
  })
  if (!res.ok) return new Response(`Translation upstream error: ${res.status}`, { status: 502 })

  const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> }
  const text = data.content?.find((c) => c.type === 'text')?.text ?? ''
  const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)
  let translations: Record<string, string>
  try {
    translations = JSON.parse(json)
  } catch {
    return new Response('Translation was not valid JSON', { status: 502 })
  }
  // Only known paths, only strings: the model cannot write anywhere else.
  const known = new Set(strings.map((s) => s.path))
  const safe = Object.fromEntries(
    Object.entries(translations).filter(([k, v]) => known.has(k) && typeof v === 'string')
  )
  return NextResponse.json({ translations: safe })
}
