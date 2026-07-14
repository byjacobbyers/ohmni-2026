/** Parses Sanity's YYYY-MM-DD date strings in local time (no UTC shift). */
export const parseSanityDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** e.g. "Thursday, July 10, 2026" */
export const formatFullDate = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).format

/** e.g. "July 10, 2026" */
export const formatShortDate = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).format
