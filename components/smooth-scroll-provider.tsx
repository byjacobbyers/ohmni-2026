'use client'

import { ReactNode, useEffect } from 'react'
import Lenis from 'lenis'

interface SmoothScrollProviderProps {
  children: ReactNode
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, anchors: true })

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
