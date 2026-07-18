import { z } from 'zod'

export const leadSubmitSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .max(320)
    .pipe(z.email('Please enter a valid email address')),
  /** Honeypot — must be empty when present */
  website: z.string().max(500).optional().default(''),
  path: z.string().max(200).optional(),
  formName: z.string().max(50).optional(),
})

export type LeadSubmitInput = z.infer<typeof leadSubmitSchema>

export type LeadParseResult =
  | { ok: true; honeypot: true }
  | { ok: true; honeypot: false; data: LeadSubmitInput }
  | { ok: false; error: string }

/** Shared server-side parse for /api/send. Honeypot filled → pretend success. */
export function parseLeadSubmit(body: unknown): LeadParseResult {
  const parsed = leadSubmitSchema.safeParse(body)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { ok: false, error: first?.message || 'Invalid form data' }
  }
  if (parsed.data.website.trim().length > 0) {
    return { ok: true, honeypot: true }
  }
  return { ok: true, honeypot: false, data: parsed.data }
}
