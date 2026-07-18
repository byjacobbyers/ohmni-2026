/** Shared cover / cover-video layout tokens (position + overlay). */

const POSITION_CLASSES: Record<string, string> = {
  'top-left': 'items-start justify-start text-left',
  'top-center': 'items-start justify-center text-center',
  'top-right': 'items-start justify-end text-right',
  'center-left': 'items-center justify-start text-left',
  center: 'items-center justify-center text-center',
  'center-right': 'items-center justify-end text-right',
  'bottom-left': 'items-end justify-start text-left',
  'bottom-center': 'items-end justify-center text-center',
  'bottom-right': 'items-end justify-end text-right',
}

const DEFAULT_POSITION = 'items-center justify-center text-center'

export function coverPositionClass(contentPosition?: string): string {
  if (!contentPosition) return DEFAULT_POSITION
  return POSITION_CLASSES[contentPosition] || DEFAULT_POSITION
}

/** CSS color for the dimming overlay (not Tailwind). */
export function coverOverlayCssColor(overlayColor?: string): string | undefined {
  if (overlayColor === 'black') return 'var(--foreground)'
  if (overlayColor === 'primary') return 'var(--primary)'
  if (overlayColor === 'white') return 'var(--background)'
  return undefined
}

/** Text color classes when content sits on media + overlay. */
export function coverOverlayTextClass(overlayColor?: string): string {
  if (overlayColor === 'black') return 'text-background'
  if (overlayColor === 'primary') return 'text-primary-foreground'
  return 'text-foreground'
}

export function coverOverlayButtonVariant(
  overlayColor?: string
): 'default' | 'secondary' {
  return overlayColor === 'primary' ? 'secondary' : 'default'
}
