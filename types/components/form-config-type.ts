export type FormFieldConfig = {
  _key?: string
  fieldType: 'input' | 'textarea'
  label: string
  name: string
  placeholder?: string
  required?: boolean
  inputType?: 'text' | 'tel' | 'url'
}

export type SanityFormDocument = {
  _id?: string
  title?: string
  slug?: string
  active?: boolean
  submitLabel?: string
  showOptIn?: 'inherit' | 'show' | 'hide' | string
  optInLabel?: string
  disclaimer?: unknown
  fields?: Array<Partial<FormFieldConfig> | null>
}

export type FormSettingsData = {
  disclaimer?: unknown
  optInLabel?: string
  optInDefault?: boolean
  showOptInByDefault?: boolean
  defaultSubmitLabel?: string
}

export type ResolvedFormConfig = {
  formName: string
  formTitle: string
  submitLabel: string
  disclaimer?: unknown
  showOptIn: boolean
  optInLabel: string
  optInDefault: boolean
  fields: FormFieldConfig[]
}
