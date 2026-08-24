// Google Tag Manager utility functions (dataLayer-first)
// PostHog rides along: consent + custom events bridge into the second lane here,
// so every existing trackEvent call site feeds both GA4/GTM and PostHog.

import posthog from 'posthog-js'

type ConsentModeValue = 'granted' | 'denied'

type ConsentUpdate = {
  ad_storage: ConsentModeValue
  analytics_storage: ConsentModeValue
  functionality_storage: ConsentModeValue
  ad_user_data: ConsentModeValue
  ad_personalization: ConsentModeValue
}

type GTMEvent = {
  event: string
  [key: string]: unknown
}

const ensureDataLayer = () => {
  if (typeof window === 'undefined') return null
  const win = window as Window & { dataLayer?: Array<unknown> }
  win.dataLayer = win.dataLayer || []
  return win.dataLayer
}

const pushToDataLayer = (payload: Record<string, unknown>) => {
  const dataLayer = ensureDataLayer()
  if (!dataLayer) return
  dataLayer.push(payload)
}

export const updateConsentMode = (consent: ConsentUpdate, mode: 'default' | 'update' = 'update') => {
  if (typeof window === 'undefined') return

  const dataLayer = ensureDataLayer()
  if (!dataLayer) return

  if (mode === 'default') {
    const win = window as Window & {
      gtag?: (cmd: string, action: string, params: Record<string, string>) => void
    }
    if (win.gtag) {
      win.gtag('consent', mode, consent)
    } else {
      dataLayer.push(['consent', mode, consent])
    }
    return
  }

  const win = window as Window & {
    gtag?: (cmd: string, action: string, params: Record<string, string>) => void
  }
  if (win.gtag) {
    win.gtag('consent', 'update', consent)
  } else {
    dataLayer.push(['consent', 'update', consent])
  }

  const consentEvent = {
    event: 'consent_update',
    ad_storage: consent.ad_storage,
    analytics_storage: consent.analytics_storage,
    functionality_storage: consent.functionality_storage,
    ad_user_data: consent.ad_user_data,
    ad_personalization: consent.ad_personalization,
  }
  setTimeout(() => dataLayer.push(consentEvent), 0)

  // PostHog lane: init leaves capturing opted out; analytics consent flips it.
  if (posthog.__loaded) {
    if (consent.analytics_storage === 'granted') {
      if (posthog.has_opted_out_capturing()) posthog.opt_in_capturing()
      // Consent can arrive after init in a browser that already knows the
      // visitor; identify now so this session's events carry the person state.
      identifyStoredVisitor()
    } else {
      if (!posthog.has_opted_out_capturing()) posthog.opt_out_capturing()
      // Revoking analytics consent also forgets who this browser is: keeping
      // an identifier around for a visitor who said no is the wrong kind of
      // memory. A later form submit writes it again with fresh consent.
      try {
        localStorage.removeItem(KNOWN_LEAD_KEY)
      } catch {
        // Storage blocked: nothing to forget.
      }
    }
  }
}

/**
 * Who this browser belongs to, learned at form submit and kept so later
 * sessions can identify before the first pageview. Same pattern as
 * `cookieConsent`: plain localStorage, best effort, the visitor's own browser.
 */
const KNOWN_LEAD_KEY = 'knownLead'

export const rememberVisitor = (email: string, name?: string) => {
  if (typeof window === 'undefined') return
  const id = email.trim().toLowerCase()
  if (!id) return
  try {
    localStorage.setItem(KNOWN_LEAD_KEY, JSON.stringify({ email: id, ...(name?.trim() && { name: name.trim() }) }))
  } catch {
    // Storage full or blocked: the form-submit identify still ran.
  }
}

/**
 * Identify from the persisted lead, if there is one. Called right after
 * posthog.init (so the session's first pageview carries the person state)
 * and again when consent is granted mid-session. No-op while opted out or
 * when nothing is stored.
 */
export const identifyStoredVisitor = () => {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(KNOWN_LEAD_KEY)
    if (!raw) return
    const { email, name } = JSON.parse(raw) as { email?: string; name?: string }
    if (email) identifyVisitor(email, name ? { name } : {})
  } catch {
    // Unreadable value: ignore; the next form submit rewrites it.
  }
}

export const trackEvent = (eventName: string, parameters: Record<string, unknown> = {}) => {
  pushToDataLayer({ event: eventName, ...parameters })
  // capture() is a no-op while the visitor is opted out, so consent holds here too
  if (posthog.__loaded) posthog.capture(eventName, parameters)
}

/**
 * Merge the anonymous browser person into a known one. Call the moment an email
 * is known (form submit). Everything that anonymous id did, before and after,
 * folds into the identified person, and server-side events keyed by the same
 * email land there too. No-op while the visitor is opted out, so consent holds.
 */
export const identifyVisitor = (email: string, properties: Record<string, unknown> = {}) => {
  const id = email.trim().toLowerCase()
  if (!id || !posthog.__loaded || posthog.has_opted_out_capturing()) return
  posthog.identify(id, { email: id, ...properties })
}

export const trackGeolocation = (geolocation: { country: string; region: string; city: string }) => {
  const payload: GTMEvent = {
    event: 'geolocation_detected',
    country: geolocation.country,
    region: geolocation.region,
    city: geolocation.city,
  }

  pushToDataLayer(payload)
}
