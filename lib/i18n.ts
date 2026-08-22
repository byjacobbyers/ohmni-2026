/**
 * Locale plumbing for the site. English lives at `/`, Spanish at `/es/...`,
 * same slug in both. Keep this pure: proxy.ts, metadata and components all
 * import it.
 */

export const LOCALES = ['en', 'es'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'
export const LANG_COOKIE = 'lang'
export const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export const isLocale = (v: unknown): v is Locale => LOCALES.includes(v as Locale)

/** Whatever a document carries (missing on legacy docs) → a locale. */
export const toLocale = (v?: string | null): Locale => (isLocale(v) ? v : DEFAULT_LOCALE)

/** `/pricing` + es → `/es/pricing`; `/` + es → `/es`; anything + en → unchanged. */
export function localizePath(path: string, lang: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (lang === DEFAULT_LOCALE) return clean
  return clean === '/' ? `/${lang}` : `/${lang}${clean}`
}

/** `/es/pricing` → { lang: 'es', path: '/pricing' }; `/pricing` → { lang: 'en', path: '/pricing' } */
export function stripLocale(pathname: string): { lang: Locale; path: string } {
  const m = pathname.match(/^\/([a-z]{2})(?=\/|$)(.*)$/)
  if (m && isLocale(m[1]) && m[1] !== DEFAULT_LOCALE) {
    return { lang: m[1], path: m[2] || '/' }
  }
  return { lang: DEFAULT_LOCALE, path: pathname || '/' }
}

/**
 * The browser's first-choice language from Accept-Language, mapped to a
 * locale we serve. Only the top preference counts: "es first" is a signal,
 * "es somewhere in the list" is not.
 */
export function preferredLocale(acceptLanguage?: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE
  const top = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const q = params.find((p) => p.trim().startsWith('q='))
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q.split('=')[1]) : 1 }
    })
    .filter((p) => p.tag && !Number.isNaN(p.q))
    .sort((a, b) => b.q - a.q)[0]
  if (!top) return DEFAULT_LOCALE
  const base = top.tag.split('-')[0]
  return isLocale(base) ? base : DEFAULT_LOCALE
}

/** Intl locale for dates. */
export const intlLocale = (lang: Locale) => (lang === 'es' ? 'es-ES' : 'en-US')

const dict = {
  en: {
    switchTo: 'Español',
    switchToAria: 'Ver este sitio en español',
    rights: 'All rights reserved.',
    cookiePrefs: 'Cookie preferences',
    cookieTitle: 'We use cookies',
    cookieBody: 'We use cookies to improve your experience and analyze our traffic.',
    rejectAll: 'Reject all',
    acceptAll: 'Accept all',
    done: 'Done',
    closePrefs: 'Close cookie preferences',
    adStorage: 'Ad storage (personalized ads)',
    analyticsStorage: 'Analytics storage',
    functionalityStorage: 'Functionality storage (basic site features)',
    adUserData: 'Ad user data',
    adPersonalization: 'Ad personalization',
    name: 'Name',
    email: 'Email',
    yourName: 'Your name',
    yourEmail: 'your.email@example.com',
    nameRequired: 'Name is required',
    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email address',
    isRequired: 'is required',
    sending: 'Sending...',
    thanks: 'Thank you! Your submission was received successfully.',
    submitError: 'Sorry, there was an error submitting the form. Please try again.',
    readMore: 'Read more',
    loadMore: 'Load more',
    noPosts: 'No posts published yet.',
    postNotFound: 'Post not found',
    posts: 'Posts',
    share: 'Share',
    shareLinkedIn: 'Share on LinkedIn',
    shareX: 'Share on X',
    shareEmail: 'Share by email',
    copyLink: 'Copy link',
    linkCopied: 'Link copied',
    linkCopiedLive: 'Link copied to clipboard',
    learnMore: 'Learn more',
    announcement: 'Site announcement',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    getStarted: 'Get started',
  },
  es: {
    switchTo: 'English',
    switchToAria: 'View this site in English',
    rights: 'Todos los derechos reservados.',
    cookiePrefs: 'Preferencias de cookies',
    cookieTitle: 'Usamos cookies',
    cookieBody: 'Usamos cookies para mejorar tu experiencia y analizar nuestro tráfico.',
    rejectAll: 'Rechazar todas',
    acceptAll: 'Aceptar todas',
    done: 'Listo',
    closePrefs: 'Cerrar preferencias de cookies',
    adStorage: 'Almacenamiento de anuncios (anuncios personalizados)',
    analyticsStorage: 'Almacenamiento de analítica',
    functionalityStorage: 'Almacenamiento funcional (funciones básicas del sitio)',
    adUserData: 'Datos de usuario para anuncios',
    adPersonalization: 'Personalización de anuncios',
    name: 'Nombre',
    email: 'Correo electrónico',
    yourName: 'Tu nombre',
    yourEmail: 'tu.correo@ejemplo.com',
    nameRequired: 'El nombre es obligatorio',
    emailRequired: 'El correo electrónico es obligatorio',
    emailInvalid: 'Introduce un correo electrónico válido',
    isRequired: 'es obligatorio',
    sending: 'Enviando...',
    thanks: 'Gracias. Recibimos tu mensaje correctamente.',
    submitError: 'Lo sentimos, hubo un error al enviar el formulario. Inténtalo de nuevo.',
    readMore: 'Leer más',
    loadMore: 'Cargar más',
    noPosts: 'Todavía no hay artículos publicados.',
    postNotFound: 'Artículo no encontrado',
    posts: 'Artículos',
    share: 'Compartir',
    shareLinkedIn: 'Compartir en LinkedIn',
    shareX: 'Compartir en X',
    shareEmail: 'Compartir por correo',
    copyLink: 'Copiar enlace',
    linkCopied: 'Enlace copiado',
    linkCopiedLive: 'Enlace copiado al portapapeles',
    learnMore: 'Más información',
    announcement: 'Anuncio del sitio',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    getStarted: 'Empezar',
  },
} as const

export type I18nKey = keyof (typeof dict)['en']

/** UI chrome strings that are code, not CMS content. Content is translated in Sanity. */
export const t = (lang: Locale, key: I18nKey): string => dict[lang][key] ?? dict.en[key]
