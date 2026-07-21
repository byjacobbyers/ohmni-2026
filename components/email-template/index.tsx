import * as React from 'react'
import type { EmailTemplateProps } from '@/types/components/email-template-type'
import { brand } from '@/lib/brand'
import { brandPalette as p } from '@/lib/brand-palette'

const labelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: p.mutedForeground,
}

const valueStyle: React.CSSProperties = {
  margin: '4px 0 0',
  fontSize: '15px',
  lineHeight: 1.45,
  color: p.foreground,
  wordBreak: 'break-word',
}

const rowStyle: React.CSSProperties = {
  margin: 0,
  padding: '14px 0',
  borderBottom: `1px solid ${p.border}`,
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={rowStyle}>
      <p style={labelStyle}>{label}</p>
      <p style={valueStyle}>{children}</p>
    </div>
  )
}

/**
 * Internal lead-notification email (Resend).
 * Uses {@link brandPalette} — not Tailwind — so it matches the site without CSS.
 */
export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  name,
  email,
  formLabel = 'Contact Form',
  path,
  marketingOptIn,
  fields,
}) => (
  <div
    style={{
      margin: 0,
      padding: '32px 16px',
      backgroundColor: p.muted,
      fontFamily: p.fontSans,
      color: p.foreground,
    }}
  >
    <div
      style={{
        maxWidth: '560px',
        margin: '0 auto',
        backgroundColor: p.background,
        border: `1px solid ${p.border}`,
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      <div style={{ height: '4px', backgroundColor: p.primary }} />

      <div style={{ padding: '28px 28px 8px' }}>
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: p.primary,
          }}
        >
          {brand.name}
        </p>
        <h1
          style={{
            margin: '10px 0 0',
            fontSize: '22px',
            fontWeight: 700,
            lineHeight: 1.25,
            color: p.foreground,
          }}
        >
          New {formLabel} submission
        </h1>
        <p
          style={{
            margin: '8px 0 0',
            fontSize: '14px',
            lineHeight: 1.5,
            color: p.mutedForeground,
          }}
        >
          A form on the {brand.name} site was submitted. Reply to this email to
          contact the lead.
        </p>
      </div>

      <div style={{ padding: '8px 28px 8px' }}>
        <Field label="Name">{name}</Field>
        <Field label="Email">
          <a href={`mailto:${email}`} style={{ color: p.primary, textDecoration: 'none' }}>
            {email}
          </a>
        </Field>
        {path ? <Field label="Page">{path}</Field> : null}
        {typeof marketingOptIn === 'boolean' ? (
          <Field label="Marketing opt-in">{marketingOptIn ? 'Yes' : 'No'}</Field>
        ) : null}
        {fields &&
          Object.entries(fields).map(([key, value]) => (
            <Field key={key} label={key}>
              {value}
            </Field>
          ))}
      </div>

      <div
        style={{
          padding: '20px 28px 28px',
          fontSize: '12px',
          lineHeight: 1.5,
          color: p.mutedForeground,
        }}
      >
        <p style={{ margin: 0 }}>Sent from the {brand.name} website contact pipeline.</p>
        <p style={{ margin: '6px 0 0' }}>{new Date().toLocaleString()}</p>
      </div>
    </div>
  </div>
)
