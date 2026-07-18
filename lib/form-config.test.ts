import { describe, expect, it } from 'vitest'
import { resolveFormConfig } from '@/lib/form-config'

describe('resolveFormConfig', () => {
  const settings = {
    optInLabel: 'News please',
    optInDefault: false,
    showOptInByDefault: true,
    defaultSubmitLabel: 'Send Message',
    disclaimer: [{ _type: 'block', children: [{ text: 'Default disclaimer' }] }],
  }

  it('returns null for inactive or missing form', () => {
    expect(resolveFormConfig(null, settings)).toBeNull()
    expect(
      resolveFormConfig({ title: 'X', slug: 'x', active: false }, settings)
    ).toBeNull()
  })

  it('merges settings with form overrides', () => {
    const config = resolveFormConfig(
      {
        title: 'Free Audit',
        slug: 'free-audit',
        active: true,
        submitLabel: 'Request Audit',
        showOptIn: 'hide',
        fields: [
          {
            fieldType: 'textarea',
            label: 'Goals',
            name: 'goals',
            required: true,
          },
        ],
      },
      settings
    )
    expect(config).toMatchObject({
      formName: 'free-audit',
      formTitle: 'Free Audit',
      submitLabel: 'Request Audit',
      showOptIn: false,
      optInLabel: 'News please',
    })
    expect(config?.fields).toHaveLength(1)
    expect(config?.fields[0]?.name).toBe('goals')
  })
})
