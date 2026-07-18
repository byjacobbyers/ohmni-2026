import { describe, expect, it } from 'vitest'
import { parseLeadSubmit } from '@/lib/lead-validation'

describe('parseLeadSubmit', () => {
  it('accepts a valid lead', () => {
    const result = parseLeadSubmit({
      name: 'Ada',
      email: 'ada@example.com',
      path: '/contact',
      formName: 'contact',
    })
    expect(result).toEqual({
      ok: true,
      honeypot: false,
      data: {
        name: 'Ada',
        email: 'ada@example.com',
        website: '',
        path: '/contact',
        formName: 'contact',
      },
    })
  })

  it('treats filled honeypot as success without data', () => {
    const result = parseLeadSubmit({
      name: 'Bot',
      email: 'bot@example.com',
      website: 'https://spam.test',
    })
    expect(result).toEqual({ ok: true, honeypot: true })
  })

  it('rejects invalid email', () => {
    const result = parseLeadSubmit({ name: 'Ada', email: 'not-an-email' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatch(/email/i)
  })
})
