import { z } from 'zod'

const RESERVED_FIELD_KEYS = new Set([
  'name',
  'email',
  'website',
  'path',
  'formName',
  'formTitle',
  'marketingOptIn',
  'fields',
  'submittedAt',
])

export const leadSubmitSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .max(320)
    .pipe(z.email('Please enter a valid email address')),
  website: z.string().max(500).optional().default(''),
  path: z.string().max(200).optional(),
  formName: z
    .string()
    .trim()
    .min(1, 'Form is required')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Invalid form id'),
  formTitle: z.string().trim().max(120).optional(),
  marketingOptIn: z.boolean().optional(),
  fields: z.record(z.string(), z.string().max(5000)).optional().default({}),
})

export type LeadSubmitInput = z.infer<typeof leadSubmitSchema>

export type LeadParseResult =
  | { ok: true; honeypot: true }
  | { ok: true; honeypot: false; data: LeadSubmitInput }
  | { ok: false; error: string }

function sanitizeFields(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!/^[a-z][a-z0-9_]*$/.test(key)) continue
    if (RESERVED_FIELD_KEYS.has(key)) continue
    if (typeof value !== 'string') continue
    const trimmed = value.trim().slice(0, 5000)
    if (!trimmed) continue
    out[key] = trimmed
    if (Object.keys(out).length >= 40) break
  }
  return out
}

/** Shared server-side parse for /api/send. Honeypot filled → pretend success. */
export function parseLeadSubmit(body: unknown): LeadParseResult {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid form data' }
  }

  const incoming = body as Record<string, unknown>
  const normalized = {
    ...incoming,
    fields: sanitizeFields(incoming.fields),
  }

  const parsed = leadSubmitSchema.safeParse(normalized)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { ok: false, error: first?.message || 'Invalid form data' }
  }
  if (parsed.data.website.trim().length > 0) {
    return { ok: true, honeypot: true }
  }
  return { ok: true, honeypot: false, data: parsed.data }
}
