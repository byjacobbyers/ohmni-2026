import type { FormFieldConfig, FormSettingsData, ResolvedFormConfig, SanityFormDocument } from '@/types/components/form-config-type'

export function resolveFormConfig(
  form: SanityFormDocument | null | undefined,
  settings: FormSettingsData | null | undefined
): ResolvedFormConfig | null {
  if (!form || form.active === false || !form.slug) return null

  const showOptIn =
    form.showOptIn === 'show'
      ? true
      : form.showOptIn === 'hide'
        ? false
        : Boolean(settings?.showOptInByDefault)

  const disclaimer =
    Array.isArray(form.disclaimer) && form.disclaimer.length > 0
      ? form.disclaimer
      : settings?.disclaimer

  const fields: FormFieldConfig[] = (form.fields || [])
    .filter((f): f is FormFieldConfig => Boolean(f?.name && f?.label && f?.fieldType))
    .map((f) => ({
      _key: f._key,
      fieldType: f.fieldType === 'textarea' ? 'textarea' : 'input',
      label: f.label,
      name: f.name,
      placeholder: f.placeholder,
      required: Boolean(f.required),
      inputType:
        f.inputType === 'tel' || f.inputType === 'url' ? f.inputType : 'text',
    }))

  return {
    formName: form.slug,
    formTitle: form.title || form.slug,
    submitLabel:
      (typeof form.submitLabel === 'string' && form.submitLabel.trim()) ||
      settings?.defaultSubmitLabel ||
      'Send Message',
    disclaimer,
    showOptIn,
    optInLabel:
      (typeof form.optInLabel === 'string' && form.optInLabel.trim()) ||
      settings?.optInLabel ||
      'Opt in for news and updates',
    optInDefault: Boolean(settings?.optInDefault),
    fields,
  }
}
