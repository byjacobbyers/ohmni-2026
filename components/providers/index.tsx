'use client'

import dynamic from 'next/dynamic'
import { AppProvider } from '@/context/app'
import { CookieConsentBanner } from '@/components/cookie-consent-banner'
import { TooltipProvider } from '@/components/ui/tooltip'

// Dev-only panel; dynamic import keeps it out of the prod client bundle
const DebugPanel =
  process.env.NODE_ENV === 'development'
    ? dynamic(() => import('@/components/debug-panel').then((m) => m.DebugPanel))
    : () => null

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <TooltipProvider delayDuration={200}>
        {children}
        <CookieConsentBanner />
        <DebugPanel />
      </TooltipProvider>
    </AppProvider>
  )
}
