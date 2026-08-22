import { describe, expect, it } from 'vitest'
import { parseLeadSubmit } from '@/lib/lead-validation'

describe('parseLeadSubmit', () => {
  it('accepts a valid lead with form id', () => {
    const result = parseLeadSubmit({
      name: 'Ada',
      email: 'ada@example.com',
      path: '/contact',
      formName: 'contact',
      formTitle: 'Contact Form',
    })
    expect(result).toMatchObject({
      ok: true,
      honeypot: false,
      data: {
        name: 'Ada',
        email: 'ada@example.com',
        _hp: '',
        path: '/contact',
        formName: 'contact',
        formTitle: 'Contact Form',
        fields: {},
      },
    })
  })

  it('accepts extra fields and opt-in', () => {
    const result = parseLeadSubmit({
      name: 'Ada',
      email: 'ada@example.com',
      formName: 'free-audit',
      marketingOptIn: true,
      fields: { company: 'Ohmni', notes: 'Hello' },
    })
    expect(result.ok).toBe(true)
    if (result.ok && !result.honeypot) {
      expect(result.data.marketingOptIn).toBe(true)
      expect(result.data.fields).toEqual({ company: 'Ohmni', notes: 'Hello' })
    }
  })

  it('strips reserved keys from fields', () => {
    const result = parseLeadSubmit({
      name: 'Ada',
      email: 'ada@example.com',
      formName: 'contact',
      fields: { email: 'hacked', company: 'Ok' },
    })
    expect(result.ok).toBe(true)
    if (result.ok && !result.honeypot) {
      expect(result.data.fields).toEqual({ company: 'Ok' })
    }
  })

  it('treats filled honeypot as success without data', () => {
    const result = parseLeadSubmit({
      name: 'Bot',
      email: 'bot@example.com',
      formName: 'contact',
      _hp: 'https://spam.test',
    })
    expect(result).toEqual({ ok: true, honeypot: true })
  })

  it('rejects missing formName', () => {
    const result = parseLeadSubmit({ name: 'Ada', email: 'ada@example.com' })
    expect(result.ok).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = parseLeadSubmit({
      name: 'Ada',
      email: 'not-an-email',
      formName: 'contact',
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatch(/email/i)
  })
})
