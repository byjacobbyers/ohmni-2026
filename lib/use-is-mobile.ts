'use client'

import { useSyncExternalStore } from 'react'

/** Matches Tailwind's md breakpoint (below 768px = mobile). */
const QUERY = '(max-width: 767px)'

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

/** True below the md breakpoint. Server snapshot is false (desktop-first SSR). */
export function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  )
}
