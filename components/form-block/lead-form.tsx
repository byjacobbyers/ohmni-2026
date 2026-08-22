'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import SimpleText from '@/components/simple-text'
import { identifyVisitor, trackEvent } from '@/lib/gtm'
import { parseAssignments } from '@/lib/experiments'
import { t, type Locale } from '@/lib/i18n'
import type { FormFieldConfig, ResolvedFormConfig } from '@/types/components/form-config-type'

type LeadFormProps = {
  config: ResolvedFormConfig
  lang?: Locale
}

/**
 * Dynamic lead form: system name/email + CMS fields, opt-in, disclaimer.
 * Hosts provide section chrome around this island.
 */
export default function LeadForm({ config, lang = 'en' }: LeadFormProps) {
  const {
    formName,
    formTitle,
    submitLabel,
    disclaimer,
    showOptIn,
    optInLabel,
    optInDefault,
    fields,
  } = config

  const [isSubmitting, setIsSubmitting] = useState(false)
  const reduceMotion = useReducedMotion()
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [marketingOptIn, setMarketingOptIn] = useState(optInDefault)
  const [extra, setExtra] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, '']))
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = t(lang, 'nameRequired')
    if (!email.trim()) {
      next.email = t(lang, 'emailRequired')
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      next.email = t(lang, 'emailInvalid')
    }
    for (const field of fields) {
      if (field.required && !(extra[field.name] || '').trim()) {
        next[field.name] = `${field.label} ${t(lang, 'isRequired')}`
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const resetForm = () => {
    setName('')
    setEmail('')
    setWebsite('')
    setMarketingOptIn(optInDefault)
    setExtra(Object.fromEntries(fields.map((f) => [f.name, ''])))
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // No client-side honeypot decision. Autofill and password managers fill
      // hidden fields, and a silent fake success swallowed real leads. The
      // server decides and logs it, so a false positive is visible.
      const fieldsPayload = Object.fromEntries(
        fields
          .map((f) => [f.name, (extra[f.name] || '').trim()] as const)
          .filter(([, v]) => v.length > 0)
      )

      // Identify before the request so the server-side lead_submitted event,
      // keyed by the same email, lands on the merged person rather than a
      // second one.
      identifyVisitor(email, { name })

      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          _hp: website,
          path: window.location.pathname,
          lang,
          // Which variant this person saw, so the server-side conversion is attributable
          experiments: parseAssignments(document.cookie),
          formName,
          formTitle,
          marketingOptIn: showOptIn ? marketingOptIn : undefined,
          fields: fieldsPayload,
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        trackEvent('form_submit', { form_name: formName, form_type: 'contact' })
        resetForm()
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormFieldConfig) => {
    const id = `field-${field.name}`
    const value = extra[field.name] || ''
    const onChange = (v: string) => {
      setExtra((prev) => ({ ...prev, [field.name]: v }))
      if (errors[field.name]) {
        setErrors((prev) => {
          const next = { ...prev }
          delete next[field.name]
          return next
        })
      }
    }

    return (
      <div key={field._key || field.name} className="space-y-2">
        <Label htmlFor={id}>
          {field.label}
          {field.required ? ' *' : ''}
        </Label>
        {field.fieldType === 'textarea' ? (
          <textarea
            id={id}
            name={field.name}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className={`flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
              errors[field.name] ? 'border-red-500' : ''
            }`}
          />
        ) : (
          <Input
            id={id}
            name={field.name}
            type={field.inputType || 'text'}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={errors[field.name] ? 'border-red-500' : ''}
          />
        )}
        {errors[field.name] ? (
          <p className="text-sm text-red-500">{errors[field.name]}</p>
        ) : null}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-form-name={formName}>
      <div className="space-y-2">
        <Label htmlFor="name">{t(lang, 'name')} *</Label>
        <Input
          id="name"
          name="name"
          placeholder={t(lang, 'yourName')}
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
          }}
          className={errors.name ? 'border-red-500' : ''}
          autoComplete="name"
        />
        {errors.name ? <p className="text-sm text-red-500">{errors.name}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t(lang, 'email')} *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t(lang, 'yourEmail')}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
          }}
          className={errors.email ? 'border-red-500' : ''}
          autoComplete="email"
        />
        {errors.email ? <p className="text-sm text-red-500">{errors.email}</p> : null}
      </div>

      {fields.map(renderField)}

      <input
        type="text"
        id="hp-field"
        name="_hp"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{
          position: 'absolute',
          left: '-9999px',
          opacity: 0,
          pointerEvents: 'none',
        }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        // readOnly is the part that actually stops autofill. Browsers and
        // form-filler extensions never populate a read-only input, while a
        // bot assigning .value through the DOM still lands in it. Renaming
        // alone did not help: the field was filled under _hp too.
        readOnly
      />

      {showOptIn ? (
        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={marketingOptIn}
            onChange={(e) => setMarketingOptIn(e.target.checked)}
            className="size-4 accent-primary"
          />
          <span>{optInLabel}</span>
        </label>
      ) : null}

      {disclaimer && Array.isArray(disclaimer) && disclaimer.length > 0 ? (
        <div className="content text-sm text-muted-foreground [&_p]:text-sm">
          <SimpleText content={disclaimer} />
        </div>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t(lang, 'sending') : submitLabel}
      </Button>

      {submitStatus === 'success' && (
        <motion.div
          role="status"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border border-green-200 rounded-md"
        >
          <p className="text-green-800 text-sm">
            {t(lang, 'thanks')}
          </p>
        </motion.div>
      )}

      {submitStatus === 'error' && (
        <motion.div
          role="alert"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-md"
        >
          <p className="text-red-800 text-sm">
            {t(lang, 'submitError')}
          </p>
        </motion.div>
      )}
    </form>
  )
}
