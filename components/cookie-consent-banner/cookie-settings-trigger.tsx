'use client'

import { useApp } from '@/context'
import { Button } from '@/components/ui/button'
import { t, type Locale } from '@/lib/i18n'

/** Footer (or elsewhere): reopen cookie preferences after a choice has been stored. */
export function CookieSettingsTrigger({ lang = 'en' }: { lang?: Locale }) {
  const { hasAcceptedCookies, setShowCookiePreferences } = useApp()

  if (!process.env.NEXT_PUBLIC_GTM_ID || !hasAcceptedCookies) {
    return null
  }

  return (
    <Button
      type="button"
      variant="link"
      className="h-auto min-h-0 p-0 text-sm font-normal hover:opacity-80"
      onClick={() => setShowCookiePreferences(true)}
    >
      {t(lang, 'cookiePrefs')}
    </Button>
  )
}
