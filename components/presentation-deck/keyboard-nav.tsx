'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export type KeyboardNavProps = {
  prev: string | null
  next: string | null
  menu: string | null
}

/** Arrow keys, space and page keys, because nobody clicks during a call. */
export default function KeyboardNav({ prev, next, menu }: KeyboardNavProps) {
  const router = useRouter()

  useEffect(() => {
    // Warm the adjacent screens so a keypress is a paint, not a fetch.
    if (next) router.prefetch(next)
    if (prev) router.prefetch(prev)
  }, [router, prev, next])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      // A form block on a screen still needs its keys.
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return

      const forward = event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' '
      const back = event.key === 'ArrowLeft' || event.key === 'PageUp'

      if (forward && next) {
        event.preventDefault()
        router.push(next)
      } else if (back && prev) {
        event.preventDefault()
        router.push(prev)
      } else if (event.key === 'Escape' && menu) {
        event.preventDefault()
        router.push(menu)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [router, prev, next, menu])

  return null
}
