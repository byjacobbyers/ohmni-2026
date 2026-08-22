# Internationalization (Spanish)

English lives at `/`, Spanish at `/es/...`. **Same slug in both languages**;
the slug is the link between them. There is no translation-metadata document
and no plugin.

## The model

- Translatable document types are listed in `I18N_TYPES`
  (`sanity/schemas/lib/language.ts`): page, post, navigation, form,
  formSettings, postCtaSettings, announcement, team. **Presentations are
  deliberately not translated.**
- Every such document carries `language` (`en` | `es`, read-only in Studio).
  Legacy documents without it are English: queries filter with
  `coalesce(language, "en") == $lang`. Keep that form; `language == $lang`
  silently drops the old ones.
- The Spanish twin of `<id>` is `<id>--es` (`localizedId` in
  `lib/translate.ts`). Singletons follow the same rule: `header--es`,
  `footer--es`, `formSettings--es`, `postCtaSettings--es`, `announcement--es`.
- Slug uniqueness is per language (`isUniqueWithinLanguage`).

## Routing

- Two root layouts: `app/(site)` (`<html lang="en">`) and `app/(es)`
  (`<html lang="es">`), both rendering `components/site-shell`. Route files
  are one-liners over `lib/content-page.tsx` / `lib/post-page.tsx`; add a new
  CMS route in **both** groups.
- `/es/<slug>` with no Spanish document **falls back to the English one** and
  canonicalizes to `/<slug>`. The toggle never dead-ends; fallbacks never
  index as duplicates and never emit hreflang.
- hreflang (`alternates.languages` + `x-default`) is emitted only when both
  languages exist. The sitemap does the same per URL.
- `proxy.ts` suggests Spanish **once**, on a first visit to `/` with no `lang`
  cookie and `Accept-Language` ranking `es` first. Every other URL serves what
  it says. The cookie mirrors the last language viewed. Never redirect on
  country (`x-vercel-ip-country`); country is not language.
- Internal links follow the **target** document: `pageRoute.language == "es"`
  resolves to `/es/...` (`lib/route-resolver.ts`). Path routes are prefixed by
  the translate step.

## Strings in code

UI chrome (form labels, cookie banner, "Read more", share row) comes from
`t(lang, key)` in `lib/i18n.ts`. Blocks receive `lang` from `Sections`; use it
rather than reading the URL. Content comes from Sanity, never from code.

## Translating

- Studio: the **Translate to Spanish** document action creates a **draft**
  `<id>--es` via `/api/translate` (needs `ANTHROPIC_API_KEY`), repointing
  references at Spanish twins that already exist. Translate forms and team
  before pages so the repointing has something to find.
- Bulk: `scripts/i18n/export.mts` → translate `<id>.strings.json` into
  `<id>.es.json` → `scripts/i18n/import.mts`. The import refuses any
  translation containing an em or en dash.
- `TRANSLATABLE_KEYS` in `lib/translate.ts` is a whitelist. A new schema
  field holding copy must be added there or it ships in English.

## When adding things

- New translatable document type: `I18N_TYPES`, `languageField`, the
  `coalesce(language, "en") == $lang` filter on its queries, a Studio
  structure entry per language, and `both()` in `lib/revalidate-targets.ts`.
- Hardcoded UI string in a shared component: add a key to the `dict` in
  `lib/i18n.ts`, both languages.
