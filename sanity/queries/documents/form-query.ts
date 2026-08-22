import { groq } from 'next-sanity'

/** Portable text projection for form disclaimers (simpleText). */
// @sanity-typegen-ignore
const disclaimerProjection = groq`disclaimer[] {
  ...,
  markDefs[] { ... }
}`

/** Shared form document fields for page-builder references. */
// @sanity-typegen-ignore
export const formDocumentProjection = groq`{
  _id,
  title,
  "slug": slug.current,
  "language": coalesce(language, "en"),
  active,
  submitLabel,
  showOptIn,
  optInLabel,
  fields[] {
    _key,
    fieldType,
    label,
    name,
    placeholder,
    required,
    inputType
  },
  ${disclaimerProjection}
}`

export const formSettingsQuery = groq`*[_type == "formSettings" && coalesce(language, "en") == $lang][0] {
  optInLabel,
  optInDefault,
  showOptInByDefault,
  defaultSubmitLabel,
  ${disclaimerProjection}
}`
