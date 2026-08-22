/** Parses Sanity's YYYY-MM-DD date strings in local time (no UTC shift). */
export const parseSanityDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

import { intlLocale, type Locale } from '@/lib/i18n'

/** e.g. "Thursday, July 10, 2026" */
export const formatFullDate = (date: Date, lang: Locale = 'en') =>
  new Intl.DateTimeFormat(intlLocale(lang), {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)

/** e.g. "July 10, 2026" */
export const formatShortDate = (date: Date, lang: Locale = 'en') =>
  new Intl.DateTimeFormat(intlLocale(lang), {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
