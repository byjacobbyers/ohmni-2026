'use client'

import dynamic from 'next/dynamic'
import { AppProvider } from '@/context/app'
import { CookieConsentBanner } from '@/components/cookie-consent-banner'
import { TooltipProvider } from '@/components/ui/tooltip'
import type { Locale } from '@/lib/i18n'

// Dev-only panel; dynamic import keeps it out of the prod client bundle
const DebugPanel =
  process.env.NODE_ENV === 'development'
    ? dynamic(() => import('@/components/debug-panel').then((m) => m.DebugPanel))
    : () => null

export function Providers({ children, lang = 'en' }: { children: React.ReactNode; lang?: Locale }) {
  return (
    <AppProvider>
      <TooltipProvider delayDuration={200}>
        {children}
        <CookieConsentBanner lang={lang} />
        <DebugPanel />
      </TooltipProvider>
    </AppProvider>
  )
}
