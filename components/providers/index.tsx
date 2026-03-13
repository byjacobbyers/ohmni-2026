'use client'

import { AppProvider } from '@/context/app'
import { DebugPanel } from '@/components/debug-panel'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      {children}
      <DebugPanel />
    </AppProvider>
  )
}
