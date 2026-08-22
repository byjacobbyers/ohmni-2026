import { defineField, type SlugValidationContext } from 'sanity'

export const LANGUAGES = [
  { id: 'en', title: 'English' },
  { id: 'es', title: 'Español' },
] as const

/** Document types that exist once per language. Presentations deliberately do not. */
export const I18N_TYPES = [
  'page',
  'post',
  'navigation',
  'form',
  'formSettings',
  'postCtaSettings',
  'announcement',
  'team',
] as const

/**
 * Set by the Translate action, never by hand. Read-only so a Spanish document
 * cannot quietly become a second English one with the same slug.
 */
export const languageField = defineField({
  name: 'language',
  title: 'Language',
  type: 'string',
  readOnly: true,
  initialValue: 'en',
  options: { list: LANGUAGES.map((l) => ({ title: l.title, value: l.id })) },
})

/** Same slug is expected across languages; it is the link between them. */
export async function isUniqueWithinLanguage(slug: string, context: SlugValidationContext) {
  const { document, getClient } = context
  const client = getClient({ apiVersion: '2025-02-19' })
  const id = (document?._id ?? '').replace(/^drafts\./, '')
  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug,
    type: document?._type,
    language: (document as { language?: string } | undefined)?.language ?? 'en',
  }
  const query = `!defined(*[_type == $type && !(_id in [$draft, $published]) && slug.current == $slug && coalesce(language, "en") == $language][0]._id)`
  return client.fetch<boolean>(query, params)
}
