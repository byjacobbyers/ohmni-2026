/**
 * Hex / font values for non-CSS surfaces (email, PDF, invoices).
 * Keep in sync with `tokens/color.json` (light) and `tokens/font.json`.
 * Site UI should prefer Tailwind theme tokens from Style Dictionary — not this file.
 */
export const brandPalette = {
  background: '#ffffff',
  foreground: '#0a0a0a',
  primary: '#3265fd',
  primaryForeground: '#fafbfa',
  muted: '#e5e7eb',
  mutedForeground: '#737373',
  border: '#dadee4',
  /** Matches tokens/font.json → Inter stack */
  fontSans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
} as const

export type BrandPalette = typeof brandPalette
