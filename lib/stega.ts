import { stegaClean } from 'next-sanity'

/**
 * Cleans stega markers from Sanity Visual Editing strings.
 * Delegates to the official cleaner; keeps the string-only, trimmed contract.
 */
export const cleanStega = (value?: string): string =>
  typeof value === 'string' ? stegaClean(value).trim() : ''
