'use client'

import { usePathname } from 'next/navigation'
import { localizePath, stripLocale, t, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/**
 * Link to the same page in the other language. A plain anchor on purpose: the
 * two languages live under different root layouts, so this is a full
 * navigation, and the proxy records the choice in the `lang` cookie.
 */
export default function LanguageToggle({ lang, className }: { lang: Locale; className?: string }) {
  const pathname = usePathname() || '/'
  const { path } = stripLocale(pathname)
  const target: Locale = lang === 'es' ? 'en' : 'es'
  return (
    <a
      href={localizePath(path, target)}
      hrefLang={target}
      lang={target}
      aria-label={t(lang, 'switchToAria')}
      className={cn('font-bold uppercase transition-opacity hover:opacity-70', className)}
    >
      {t(lang, 'switchTo')}
    </a>
  )
}
