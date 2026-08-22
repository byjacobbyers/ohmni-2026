/**
 * Turn an English Sanity document into its Spanish sibling. Pure functions so
 * the Studio action, the API route and the bulk script all share one walker.
 *
 * The model: same slug, `language: 'es'`, `_id` = `<english id>--es`. No
 * translation-metadata documents. A reference is repointed to the `--es`
 * twin when one exists, so a Spanish page picks up the Spanish form.
 */
// Relative on purpose: scripts/ runs this file under plain Node, where '@/' does not resolve.
import { DEFAULT_LOCALE, type Locale } from './i18n'

/** Keys whose string value is human copy. Everything else is structure. */
export const TRANSLATABLE_KEYS = new Set([
  'text', // portable text spans
  'title',
  'subtitle',
  'heading',
  'kicker',
  'eyebrow',
  'intro',
  'description',
  'label',
  'placeholder',
  'question',
  'alt',
  'metaTitle',
  'metaDesc',
  'excerpt',
  'message',
  'footnote',
  'note',
  'total',
  'totalLabel',
  'value', // comparison rows; dataAttributes are skipped by the sibling-key rule
  'submitLabel',
  'optInLabel',
  'defaultSubmitLabel',
  'tags',
  'caption',
  'titleAttr',
  'ariaLabel',
  'headline',
  'primaryJobTitle',
  'secondaryJobTitle',
])

export type StringRef = { path: string; text: string }

type Json = Record<string, unknown>
const isObject = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v)

function walk(
  node: unknown,
  path: string[],
  parent: Json | null,
  root: Json,
  visit: (path: string[], text: string) => void
) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => walk(item, [...path, String(i)], parent, root, visit))
    return
  }
  if (!isObject(node)) return
  for (const [key, value] of Object.entries(node)) {
    const here = [...path, key]
    if (typeof value === 'string') {
      if (!TRANSLATABLE_KEYS.has(key) || !value.trim()) continue
      // navigation.title is a lookup key ("Header"), not a label
      if (path.length === 0 && key === 'title' && root._type === 'navigation') continue
      // dataAttributes are { key, value } pairs: machine values
      if (key === 'value' && 'key' in node) continue
      visit(here, value)
    } else if (Array.isArray(value) && TRANSLATABLE_KEYS.has(key) && value.every((v) => typeof v === 'string')) {
      value.forEach((v, i) => v.trim() && visit([...here, String(i)], v))
    } else {
      walk(value, here, node, root, visit)
    }
  }
}

/** Every translatable string with a dotted path back to where it lives. */
export function extractStrings(doc: Json): StringRef[] {
  const out: StringRef[] = []
  walk(doc, [], null, doc, (path, text) => out.push({ path: path.join('.'), text }))
  return out
}

function setAtPath(target: Json, path: string, value: string) {
  const keys = path.split('.')
  let cursor: unknown = target
  for (let i = 0; i < keys.length - 1; i++) {
    if (Array.isArray(cursor)) cursor = cursor[Number(keys[i])]
    else if (isObject(cursor)) cursor = cursor[keys[i]]
    else return
  }
  const last = keys[keys.length - 1]
  if (Array.isArray(cursor)) cursor[Number(last)] = value
  else if (isObject(cursor)) cursor[last] = value
}

/** Write translated strings back by path. Unknown paths are ignored. */
export function injectStrings<T extends Json>(doc: T, translations: Record<string, string>): T {
  const clone = structuredClone(doc)
  for (const [path, text] of Object.entries(translations)) {
    if (typeof text === 'string' && text.length) setAtPath(clone, path, text)
  }
  return clone
}

export const publishedId = (id: string) => id.replace(/^drafts\./, '')
export const localizedId = (id: string, lang: Locale) =>
  lang === DEFAULT_LOCALE ? publishedId(id) : `${publishedId(id)}--${lang}`

/** Paths that are deliberately outside the locale tree. */
const UNLOCALIZED_PATH = /^(present|studio|api)(\/|$)/

/**
 * Re-identify a document for a locale: new `_id`, `language`, references
 * swapped for their localized twins where those exist, and internal `path`
 * routes prefixed with the locale. System fields are dropped so the result
 * can be created as a fresh document.
 */
export function localizeDocument<T extends Json>(
  doc: T,
  lang: Locale,
  existingIds: Set<string>
): T & { _id: string; language: Locale } {
  const clone = structuredClone(doc)
  const { _rev, _createdAt, _updatedAt, ...rest } = clone as Json
  void _rev
  void _createdAt
  void _updatedAt
  const out = rest as Json
  out._id = localizedId(String(doc._id), lang)
  out.language = lang

  const visit = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(visit)
    if (!isObject(node)) return
    if (typeof node._ref === 'string') {
      const twin = localizedId(node._ref, lang)
      if (existingIds.has(twin)) node._ref = twin
    }
    if (node.linkType === 'path' && typeof node.route === 'string' && lang !== DEFAULT_LOCALE) {
      const route = node.route.replace(/^\/+/, '')
      if (!route.startsWith(`${lang}/`) && route !== lang && !UNLOCALIZED_PATH.test(route)) {
        node.route = route ? `${lang}/${route}` : lang
      }
    }
    for (const value of Object.values(node)) visit(value)
  }
  visit(out)
  return out as T & { _id: string; language: Locale }
}
