'use client'

import { useEffect } from 'react'
import { initializeGTM, setDefaultConsent } from '@/lib/gtm'

export function GTMInit() {
  useEffect(() => {
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID

    if (gtmId && typeof window !== 'undefined') {
      initializeGTM(gtmId)
      setDefaultConsent()
    }
  }, [])

  return null
}
